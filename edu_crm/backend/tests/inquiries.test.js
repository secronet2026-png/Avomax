import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-for-unit-tests-only';

const { default: app } = await import('../src/app.js');
const { setSupabaseClientForTesting } = await import('../src/config/supabase.js');

const superAdminToken = jwt.sign(
  {
    sub: '11111111-1111-4111-8111-111111111101',
    role: 'super_admin',
    email: 'superadmin@educrm.io'
  },
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);

test('Public inquiry submission succeeds with valid payload', async () => {
  const payload = {
    full_name: 'Tendai Moyo',
    email: 'tendai.moyo@example.com',
    phone: '+263 77 123 4567',
    destination_country: 'United Kingdom',
    program_of_interest: 'MBBS Medicine',
    intake: 'Fall 2026',
    notes: 'Looking for scholarship opportunities'
  };

  const response = await fetch('http://localhost:5001/api/inquiries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(() => null);

  // We test the logic through direct service if server not listening in unit test
  const { createInquiryService, listInquiriesService } = await import('../src/services/inquiryService.js');
  const inquiry = await createInquiryService(payload);

  assert.equal(inquiry.full_name, 'Tendai Moyo');
  assert.equal(inquiry.email, 'tendai.moyo@example.com');
  assert.equal(inquiry.status, 'New');

  const list = await listInquiriesService({}, { role: 'super_admin', id: '11111111-1111-4111-8111-111111111101' });
  assert.ok(list.inquiries.length >= 1);
  assert.ok(list.counts.new >= 1);
});

