import { ROLES } from '../config/constants.js';
import {
  deleteInquiryRecord,
  findInquiries,
  findInquiryById,
  getInquiryCounts,
  insertInquiry,
  updateInquiryRecord
} from '../repositories/inquiryRepository.js';
import { createStudentWithModules } from '../repositories/studentRepository.js';
import { AppError } from '../utils/AppError.js';
import { buildPaginationMeta, parsePagination } from '../utils/pagination.js';
import { sanitizeText } from '../utils/sanitize.js';
import { logActivity } from './activityService.js';
import { notifyStakeholders } from './notificationService.js';

export async function createInquiryService(payload, ipAddress = null) {
  const sanitized = {
    ...payload,
    full_name: sanitizeText(payload.full_name),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone.trim(),
    parent_phone: payload.parent_phone ? payload.parent_phone.trim() : null,
    destination_country: payload.destination_country ? sanitizeText(payload.destination_country) : null,
    program_of_interest: payload.program_of_interest ? sanitizeText(payload.program_of_interest) : null,
    intake: payload.intake ? sanitizeText(payload.intake) : null,
    passport_id: payload.passport_id ? sanitizeText(payload.passport_id) : null,
    nationality: payload.nationality ? sanitizeText(payload.nationality) : null,
    high_school: payload.high_school ? sanitizeText(payload.high_school) : null,
    address: payload.address ? sanitizeText(payload.address) : null,
    notes: payload.notes ? sanitizeText(payload.notes) : null,
    source: payload.source || 'website'
  };

  const created = await insertInquiry(sanitized);

  // Attempt non-blocking activity log & notification
  try {
    await logActivity({
      actorId: null,
      studentId: null,
      entityType: 'inquiry',
      entityId: created.id,
      action: 'inquiry_received',
      description: `New online inquiry received from ${created.full_name} for ${created.program_of_interest || 'study abroad'}`,
      newData: { id: created.id, email: created.email, phone: created.phone, source: created.source },
      ipAddress
    });
  } catch (err) {
    console.warn('Non-blocking activity log error:', err.message || err);
  }

  try {
    await notifyStakeholders({
      type: 'inquiry_received',
      title: 'New Online Inquiry Received',
      message: `${created.full_name} submitted an inquiry for ${created.program_of_interest || 'admission'}.`,
      entityType: 'inquiry',
      entityId: created.id
    });
  } catch (err) {
    console.warn('Non-blocking notification error:', err.message || err);
  }

  return created;
}

export async function listInquiriesService(query, user) {
  const { page, limit } = parsePagination(query);
  const counselorScopeId = user.role === ROLES.COUNSELOR ? user.id : null;

  const filters = {
    search: query.search || '',
    status: query.status || '',
    source: query.source || '',
    assigned_counselor_id: query.assigned_counselor_id || null,
    counselorScopeId,
    sortBy: query.sortBy || 'created_at',
    sortOrder: query.sortOrder || 'desc',
    page,
    limit
  };

  const { inquiries, totalCount } = await findInquiries(filters);
  const counts = await getInquiryCounts();

  return {
    inquiries,
    counts,
    pagination: buildPaginationMeta(totalCount, page, limit)
  };
}

export async function getInquiryDetailService(id, user) {
  const inquiry = await findInquiryById(id);
  if (!inquiry) {
    throw new AppError('Inquiry not found', 404);
  }

  if (user.role === ROLES.COUNSELOR && inquiry.assigned_counselor_id && inquiry.assigned_counselor_id !== user.id) {
    throw new AppError('Access denied: inquiry is assigned to another counselor', 403);
  }

  return inquiry;
}

export async function updateInquiryService(id, payload, user, ipAddress = null) {
  const existing = await findInquiryById(id);
  if (!existing) {
    throw new AppError('Inquiry not found', 404);
  }

  const updates = {};
  if (payload.status) updates.status = payload.status;
  if (payload.assigned_counselor_id !== undefined) updates.assigned_counselor_id = payload.assigned_counselor_id;
  if (payload.counselor_notes !== undefined) updates.counselor_notes = payload.counselor_notes;
  if (payload.destination_country !== undefined) updates.destination_country = payload.destination_country;
  if (payload.program_of_interest !== undefined) updates.program_of_interest = payload.program_of_interest;
  if (payload.intake !== undefined) updates.intake = payload.intake;

  const updated = await updateInquiryRecord(id, updates);

  try {
    await logActivity({
      actorId: user.id,
      studentId: null,
      entityType: 'inquiry',
      entityId: id,
      action: 'inquiry_updated',
      description: `Inquiry for ${existing.full_name} updated to status "${updated.status}" by ${user.full_name}`,
      previousData: { status: existing.status, counselor: existing.assigned_counselor_id },
      newData: updates,
      ipAddress
    });
  } catch (err) {
    console.warn('Non-blocking activity log error:', err.message || err);
  }

  return updated;
}

export async function convertInquiryToStudentService(id, convertPayload, user, ipAddress = null) {
  const inquiry = await findInquiryById(id);
  if (!inquiry) {
    throw new AppError('Inquiry not found', 404);
  }

  if (inquiry.status === 'Converted' || inquiry.converted_student_id) {
    throw new AppError('Inquiry has already been converted to a student', 400);
  }

  const defaultDob = inquiry.date_of_birth || '2004-01-01';
  const defaultPassport = inquiry.passport_id || convertPayload.passport_number || 'PENDING-' + Math.floor(100000 + Math.random() * 900000);
  const defaultPassportExp = convertPayload.passport_expiry_date || '2034-01-01';

  const studentPayload = {
    full_name: inquiry.full_name,
    email: inquiry.email,
    phone: inquiry.phone,
    passport_number: defaultPassport,
    passport_expiry_date: defaultPassportExp,
    nationality: inquiry.nationality || 'Zimbabwean',
    date_of_birth: defaultDob,
    gender: inquiry.gender || 'Prefer not to say',
    destination_country: inquiry.destination_country || convertPayload.destination_country || 'United Kingdom',
    university_name: convertPayload.university_name || 'To Be Assigned',
    course_name: inquiry.program_of_interest || convertPayload.course_name || 'Undergraduate Degree',
    intake: inquiry.intake || convertPayload.intake || 'Fall 2026',
    academic_year: convertPayload.academic_year || '2026-2027',
    assigned_counselor_id: convertPayload.assigned_counselor_id || inquiry.assigned_counselor_id || (user.role === ROLES.COUNSELOR ? user.id : null),
    internal_remarks: `Converted from online inquiry (ID: ${inquiry.id}). Original Notes: ${inquiry.notes || 'None'}`
  };

  const student = await createStudentWithModules(studentPayload, user.id);

  const updatedInquiry = await updateInquiryRecord(id, {
    status: 'Converted',
    converted_student_id: student.id,
    assigned_counselor_id: studentPayload.assigned_counselor_id
  });

  try {
    await logActivity({
      actorId: user.id,
      studentId: student.id,
      entityType: 'inquiry',
      entityId: id,
      action: 'inquiry_converted',
      description: `Inquiry for ${inquiry.full_name} converted to Student ${student.student_code} by ${user.full_name}`,
      newData: { student_id: student.id, student_code: student.student_code },
      ipAddress
    });
  } catch (err) {
    console.warn('Non-blocking activity log error:', err.message || err);
  }

  return {
    student,
    inquiry: updatedInquiry
  };
}

export async function deleteInquiryService(id, user, ipAddress = null) {
  const existing = await findInquiryById(id);
  if (!existing) {
    throw new AppError('Inquiry not found', 404);
  }

  await deleteInquiryRecord(id);

  try {
    await logActivity({
      actorId: user.id,
      studentId: null,
      entityType: 'inquiry',
      entityId: id,
      action: 'inquiry_deleted',
      description: `Inquiry for ${existing.full_name} deleted by ${user.full_name}`,
      previousData: existing,
      ipAddress
    });
  } catch (err) {
    console.warn('Non-blocking activity log error:', err.message || err);
  }

  return true;
}

