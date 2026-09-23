import { Router } from 'express';
import {
  getDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctorController.js';
import { validate } from '../middleware/validateMiddleware.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  createDoctorSchema,
  updateDoctorSchema,
} from '../validators/doctorValidator.js';

const router = Router();

router
  .route('/')
  .get(getDoctors)
  .post(protect, validate(createDoctorSchema), createDoctor);

router
  .route('/:id')
  .get(getDoctorById)
  .put(protect, validate(updateDoctorSchema), updateDoctor)
  .delete(protect, deleteDoctor);

export default router;
