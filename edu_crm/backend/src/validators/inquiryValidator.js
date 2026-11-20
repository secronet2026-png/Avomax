import { z } from 'zod';
import { INQUIRY_STATUSES } from '../config/constants.js';

const optionalNullableUuid = z
  .union([z.string().uuid(), z.literal(''), z.null()])
  .optional()
  .transform((v) => (v === '' ? null : v));

export const createInquirySchema = z.object({
  full_name: z.string().trim().min(2, 'Full name is required (min 2 characters)').max(150),
  email: z.string().trim().email('Valid email address is required'),
  phone: z.string().trim().min(5, 'Phone number is required').max(40),
  parent_phone: z.string().trim().max(40).optional().nullable(),
  destination_country: z.string().trim().max(100).optional().nullable(),
  program_of_interest: z.string().trim().max(200).optional().nullable(),
  intake: z.string().trim().max(60).optional().nullable(),
  passport_id: z.string().trim().max(100).optional().nullable(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD')
    .optional()
    .nullable()
    .or(z.literal('')),
  gender: z.string().trim().max(50).optional().nullable(),
  marital_status: z.string().trim().max(50).optional().nullable(),
  nationality: z.string().trim().max(100).optional().nullable(),
  high_school: z.string().trim().max(200).optional().nullable(),
  address: z.string().trim().max(300).optional().nullable(),
  notes: z.string().trim().max(3000).optional().nullable(),
  heard_from: z.string().trim().max(255).optional().nullable(),
  source: z.string().trim().max(50).default('website')
});

export const updateInquirySchema = z.object({
  status: z.enum(INQUIRY_STATUSES).optional(),
  assigned_counselor_id: optionalNullableUuid,
  counselor_notes: z.string().trim().max(3000).optional().nullable(),
  destination_country: z.string().trim().max(100).optional().nullable(),
  program_of_interest: z.string().trim().max(200).optional().nullable(),
  intake: z.string().trim().max(60).optional().nullable()
});

export const convertInquirySchema = z.object({
  university_name: z.string().trim().min(2, 'University name is required').max(200).default('To Be Assigned'),
  course_name: z.string().trim().max(200).optional().nullable(),
  academic_year: z.string().trim().max(30).default('2026-2027'),
  assigned_counselor_id: optionalNullableUuid,
  passport_number: z.string().trim().max(64).optional().nullable(),
  passport_expiry_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable()
    .or(z.literal(''))
});

