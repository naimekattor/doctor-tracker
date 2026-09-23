import { Router } from 'express';
import {
  getPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patientController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createPatientSchema,
  updatePatientSchema,
} from '../validators/patientValidator.js';

const router = Router();

router
  .route('/')
  .get(getPatients)
  .post(protect, validate(createPatientSchema), createPatient);

router
  .route('/:id')
  .get(getPatientById)
  .put(protect, validate(updatePatientSchema), updatePatient)
  .delete(protect, deletePatient);

export default router;
