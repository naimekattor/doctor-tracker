import { z } from 'zod';

export const createPatientSchema = z.object({
  name: z
    .string({ required_error: 'Patient name is required' })
    .trim()
    .min(2, 'Patient name must be at least 2 characters long'),
  age: z.coerce
    .number({ required_error: 'Age is required' })
    .int('Age must be an integer')
    .min(0, 'Age cannot be negative'),
  gender: z.enum(['Male', 'Female', 'Other'], {
    required_error: 'Gender is required (Male, Female, or Other)',
  }),
  condition: z
    .string({ required_error: 'Patient condition is required' })
    .trim()
    .min(1, 'Patient condition is required'),
  contactPhone: z
    .string({ required_error: 'Contact phone is required' })
    .trim()
    .min(4, 'Valid contact phone is required'),
  doctor: z
    .string({ required_error: 'Doctor reference is required' })
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid doctor ID format'),
});

export const updatePatientSchema = createPatientSchema.partial();

export default {
  createPatientSchema,
  updatePatientSchema,
};
