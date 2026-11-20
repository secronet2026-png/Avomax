import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { getSupabase } from '../config/supabase.js';
import { sanitizeSearchTerm } from '../utils/sanitize.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCAL_DATA_FILE = path.resolve(__dirname, '../../data/inquiries.json');
const SETTINGS_STORE_KEY = 'crm_inquiries_store';

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
    console.error('Failed to write local inquiries file:', err.message || err);
  }
}

/**
 * Reads persistent inquiries from Supabase system_settings if inquiries table does not exist.
 * Falls back to local inquiries.json if Supabase is unavailable.
 */
async function fetchPersistentFallbackInquiries() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('system_settings')
      .select('setting_value')
      .eq('setting_key', SETTINGS_STORE_KEY)
      .maybeSingle();

    if (!error && data?.setting_value && Array.isArray(data.setting_value)) {
      return data.setting_value;
    }
  } catch (err) {
    console.warn('Could not read from Supabase system_settings fallback:', err.message || err);
  }

  return readLocalInquiries();
}

/**
 * Saves persistent inquiries to Supabase system_settings.
 * Also mirrors to local file if writable.
 */
async function savePersistentFallbackInquiries(records) {
  writeLocalInquiries(records);

  try {
    const supabase = getSupabase();
    await supabase.from('system_settings').upsert(
      {
        setting_key: SETTINGS_STORE_KEY,
        setting_value: records,
        description: 'Persistent fallback store for CRM inquiries'
      },
      { onConflict: 'setting_key' }
    );
  } catch (err) {
    console.warn('Could not write to Supabase system_settings fallback:', err.message || err);
  }
}

export async function insertInquiry(payload) {
  const supabase = getSupabase();
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const record = {
    id,
    full_name: payload.full_name,
    email: payload.email,
    phone: payload.phone,
    parent_phone: payload.parent_phone || null,
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
    heard_from: payload.heard_from || null,
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

    if (error) {
      // If heard_from or parent_phone column is missing in Supabase schema, fold into notes and retry
      if (
        error.message?.includes('heard_from') ||
        error.message?.includes('parent_phone') ||
        error.code === '42703'
      ) {
        const fallbackRecord = { ...record };
        delete fallbackRecord.heard_from;
        delete fallbackRecord.parent_phone;
        const extraNotes = [];
        if (record.heard_from) extraNotes.push(`Heard From: ${record.heard_from}`);
        if (record.parent_phone) extraNotes.push(`Parent Phone: ${record.parent_phone}`);
        if (extraNotes.length > 0) {
          fallbackRecord.notes = fallbackRecord.notes
            ? `${fallbackRecord.notes} | ${extraNotes.join(' | ')}`
            : extraNotes.join(' | ');
        }
        const retryResult = await supabase
          .from('inquiries')
          .insert(fallbackRecord)
          .select()
          .single();

        if (retryResult.error) throw retryResult.error;
        return {
          ...retryResult.data,
          heard_from: record.heard_from,
          parent_phone: record.parent_phone
        };
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.warn('Supabase inquiries insert failed, falling back to persistent storage:', error.message || error);
    const existing = await fetchPersistentFallbackInquiries();
    const updated = [record, ...existing.filter((r) => r.id !== record.id)];
    await savePersistentFallbackInquiries(updated);
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
      // Counselors see inquiries assigned to them OR unassigned inquiries from the website
      query = query.or(`assigned_counselor_id.eq.${counselorScopeId},assigned_counselor_id.is.null`);
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
          `full_name.ilike.%${clean}%,email.ilike.%${clean}%,phone.ilike.%${clean}%,parent_phone.ilike.%${clean}%,destination_country.ilike.%${clean}%,program_of_interest.ilike.%${clean}%`
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
    console.warn('Supabase inquiries query fallback to persistent storage:', err.message || err);
    let records = await fetchPersistentFallbackInquiries();

    if (counselorScopeId) {
      records = records.filter((r) => !r.assigned_counselor_id || r.assigned_counselor_id === counselorScopeId);
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
          r.parent_phone?.toLowerCase().includes(s) ||
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
    const records = await fetchPersistentFallbackInquiries();
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
    const records = await fetchPersistentFallbackInquiries();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...patch };
    await savePersistentFallbackInquiries(records);
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
    const records = await fetchPersistentFallbackInquiries();
    const filtered = records.filter((r) => r.id !== id);
    await savePersistentFallbackInquiries(filtered);
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
