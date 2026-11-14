import {
  convertInquiryToStudentService,
  createInquiryService,
  deleteInquiryService,
  getInquiryDetailService,
  listInquiriesService,
  updateInquiryService
} from '../services/inquiryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createInquiry = asyncHandler(async (req, res) => {
  const inquiry = await createInquiryService(req.body, req.ip);
  res.status(201).json({
    success: true,
    message: 'Inquiry received successfully. Our admissions counselor will contact you shortly.',
    data: inquiry
  });
});

export const listInquiries = asyncHandler(async (req, res) => {
  const result = await listInquiriesService(req.query, req.user);
  res.json({
    success: true,
    data: result.inquiries,
    counts: result.counts,
    pagination: result.pagination
  });
});

export const getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await getInquiryDetailService(req.params.id, req.user);
  res.json({
    success: true,
    data: inquiry
  });
});

export const updateInquiry = asyncHandler(async (req, res) => {
  const updated = await updateInquiryService(req.params.id, req.body, req.user, req.ip);
  res.json({
    success: true,
    message: 'Inquiry updated successfully',
    data: updated
  });
});

export const convertInquiryToStudent = asyncHandler(async (req, res) => {
  const result = await convertInquiryToStudentService(req.params.id, req.body, req.user, req.ip);
  res.status(201).json({
    success: true,
    message: 'Inquiry successfully converted to student profile',
    data: result
  });
});

export const deleteInquiry = asyncHandler(async (req, res) => {
  await deleteInquiryService(req.params.id, req.user, req.ip);
  res.json({
    success: true,
    message: 'Inquiry deleted successfully'
  });
});

