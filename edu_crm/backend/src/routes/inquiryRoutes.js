import { Router } from 'express';
import { ROLES } from '../config/constants.js';
import {
  convertInquiryToStudent,
  createInquiry,
  deleteInquiry,
  getInquiryById,
  listInquiries,
  updateInquiry
} from '../controllers/inquiryController.js';
import { authenticate } from '../middleware/auth.js';
import { authorize } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';
import {
  convertInquirySchema,
  createInquirySchema,
  updateInquirySchema
} from '../validators/inquiryValidator.js';
import { uuidParamSchema } from '../validators/studentValidator.js';

const router = Router();

// PUBLIC endpoint for website inquiry submissions
router.post('/', validate(createInquirySchema), createInquiry);

// Protected staff endpoints
router.use(authenticate);

router.get('/', listInquiries);
router.get('/:id', validate(uuidParamSchema, 'params'), getInquiryById);
router.patch(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COUNSELOR),
  validate(uuidParamSchema, 'params'),
  validate(updateInquirySchema),
  updateInquiry
);
router.post(
  '/:id/convert',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.COUNSELOR),
  validate(uuidParamSchema, 'params'),
  validate(convertInquirySchema),
  convertInquiryToStudent
);
router.delete(
  '/:id',
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  validate(uuidParamSchema, 'params'),
  deleteInquiry
);

export default router;

