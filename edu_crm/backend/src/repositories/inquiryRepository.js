import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getSupabase } from '../config/supabase.js';
import { sanitizeSearchTerm } from '../utils/sanitize.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DATA_FILE = path.resolve(__dirname, '../../data/inquiries.json');

// Ensure local fallback data file exists
function ensureLocalDataFile() {
  const dir = path.dirname(LOCAL_DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(LOCAL_DATA_FILE)) {
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readLocalInquiries() {
  try {
    ensureLocalDataFile();
    const raw = fs.readFileSync(LOCAL_DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalInquiries(inquiries) {
  try {
    ensureLocalDataFile();
    fs.writeFileSync(LOCAL_DATA_FILE, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local inquiries file:', err);
  }
}

const INQUIRY_WITH_RELATIONS = `
  *,
  counselor:profiles!inquiries_assigned_counselor_id_fkey(id, full_name, email, role),
  converted_student:students!inquiries_converted_student_id_fkey(id, student_code, full_name)
`;

export async function insertInquiry(payload) {
  const supabase = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record = {
    id,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    destination_country: payload.destination_country || null,
    program_of_interest: payload.program_of_interest || null,
    intake: payload.intake || null,
    passport_id: payload.passport_id || null,
    date_of_birth: payload.date_of_birth || null,
    gender: payload.gender || null,
    marital_status: payload.marital_status || null,
    nationality: payload.nationality || null,
    high_school: payload.high_school || null,
    address: payload.address || null,
    notes: payload.notes || null,
    source: payload.source || 'website',
    status: 'New',
    assigned_counselor_id: payload.assigned_counselor_id || null,
    counselor_notes: null,
    converted_student_id: null,
    created_at: now,
    updated_at: now
  };

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .insert(record)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    // If Supabase table does not exist or network failed, save to local fallback
    console.warn('Supabase inquiries insert fallback to local JSON:', err.message || err);
    const locals = readLocalInquiries();
    locals.unshift(record);
    writeLocalInquiries(locals);
    return record;
  }
}

export async function findInquiries(filters = {}) {
  const {
    search,
    status,
    source,
    assigned_counselor_id,
    counselorScopeId,
    sortBy = 'created_at',
    sortOrder = 'desc',
    page = 1,
    limit = 20
  } = filters;

  const supabase = getSupabase();

  try {
    const ascending = String(sortOrder).toLowerCase() === 'asc';
    let query = supabase
      .from('inquiries')
      .select('*')
      .order(sortBy, { ascending });

    if (counselorScopeId) {
      query = query.eq('assigned_counselor_id', counselorScopeId);
    } else if (assigned_counselor_id) {
      query = query.eq('assigned_counselor_id', assigned_counselor_id);
    }

    if (status && status !== 'All') {
      query = query.eq('status', status);
    }
    if (source && source !== 'All') {
      query = query.eq('source', source);
    }

    if (search) {
      const clean = sanitizeSearchTerm(search);
      if (clean) {
        query = query.or(
          `full_name.ilike.%${clean}%,email.ilike.%${clean}%,phone.ilike.%${clean}%,destination_country.ilike.%${clean}%,program_of_interest.ilike.%${clean}%`
        );
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    let records = data || [];
    const totalCount = records.length;
    const startIndex = (page - 1) * limit;
    const paginated = records.slice(startIndex, startIndex + limit);

    return {
      inquiries: paginated,
      totalCount
    };
  } catch (err) {
    // Fallback to local store
    console.warn('Supabase inquiries query fallback to local JSON:', err.message || err);
    let records = readLocalInquiries();

    if (counselorScopeId) {
      records = records.filter((r) => r.assigned_counselor_id === counselorScopeId);
    } else if (assigned_counselor_id) {
      records = records.filter((r) => r.assigned_counselor_id === assigned_counselor_id);
    }

    if (status && status !== 'All') {
      records = records.filter((r) => r.status === status);
    }
    if (source && source !== 'All') {
      records = records.filter((r) => r.source === source);
    }

    if (search) {
      const s = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.full_name?.toLowerCase().includes(s) ||
          r.email?.toLowerCase().includes(s) ||
          r.phone?.toLowerCase().includes(s) ||
          r.destination_country?.toLowerCase().includes(s) ||
          r.program_of_interest?.toLowerCase().includes(s)
      );
    }

    // Sort
    records.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const totalCount = records.length;
    const startIndex = (page - 1) * limit;
    const paginated = records.slice(startIndex, startIndex + limit);

    return {
      inquiries: paginated,
      totalCount
    };
  }
}

export async function findInquiryById(id) {
  const supabase = getSupabase();
  try {
    const { data, error } = await supabase
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  } catch (err) {
    const records = readLocalInquiries();
    return records.find((r) => r.id === id) || null;
  }
}

export async function updateInquiryRecord(id, updates) {
  const supabase = getSupabase();
  const patch = {
    ...updates,
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('inquiries')
      .update(patch)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const records = readLocalInquiries();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...patch };
    writeLocalInquiries(records);
    return records[index];
  }
}

export async function deleteInquiryRecord(id) {
  const supabase = getSupabase();
  try {
    const { error } = await supabase.from('inquiries').delete().eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    const records = readLocalInquiries();
    const filtered = records.filter((r) => r.id !== id);
    writeLocalInquiries(filtered);
    return true;
  }
}

export async function getInquiryCounts() {
  try {
    const { inquiries: all } = await findInquiries({ limit: 10000 });
    const counts = {
      total: all.length,
      new: 0,
      contacted: 0,
      in_progress: 0,
      converted: 0,
      closed: 0
    };
    all.forEach((item) => {
      const st = String(item.status || '').toLowerCase().replace(/\s+/g, '_');
      if (counts[st] !== undefined) {
        counts[st] += 1;
      }
    });
    return counts;
  } catch {
    return { total: 0, new: 0, contacted: 0, in_progress: 0, converted: 0, closed: 0 };
  }
}

