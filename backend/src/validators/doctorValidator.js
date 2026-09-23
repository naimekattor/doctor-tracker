import { z } from 'zod';

export const createDoctorSchema = z.object({
  name: z
    .string({ required_error: 'Doctor name is required' })
    .trim()
    .min(2, 'Doctor name must be at least 2 characters long'),
  specialization: z
    .string({ required_error: 'Specialization is required' })
    .trim()
    .min(2, 'Specialization is required'),
  hospital: z
    .string({ required_error: 'Hospital is required' })
    .trim()
    .min(2, 'Hospital is required'),
  phone: z
    .string({ required_error: 'Phone number is required' })
    .trim()
    .min(4, 'Valid phone number is required'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Invalid email address')
    .toLowerCase(),
});

export const updateDoctorSchema = createDoctorSchema.partial();

export default {
  createDoctorSchema,
  updateDoctorSchema,
};
