export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorDetail extends Doctor {
  patientCount: number;
}

export interface DoctorInput {
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
}

export interface DoctorQueryParams {
  search?: string;
  specialization?: string;
  hospital?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
