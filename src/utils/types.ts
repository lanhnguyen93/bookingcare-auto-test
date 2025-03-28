export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  address: string;
  phonenumber: string;
  gender: string;
  image: string;
  roleId: string;
  positionId: string;
};

export type Specialty = {
  id: string;
  name: string;
  image: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
};

export type Clinic = {
  id: string;
  name: string;
  address: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
  provinceId: string;
  image: string;
};

export type DoctorInfor = {
  id: string;
  doctorId: string;
  priceId: string;
  paymentId: string;
  provinceId: string;
  clinicId: string;
  specialtyId: string;
  contentMarkdown: string;
  contentHTML: string;
  description: string;
  note: string;
};

export type Schedule = {
  id: string;
  currentNumber?: number;
  maxNumber?: number;
  date: Date;
  timeType: string;
  doctorId: string;
};

export type Booking = {
  id: string;
  statusId: string;
  doctorId: string;
  patientId: string;
  date: string;
  reason: string;
  timeType: string;
  token: string;
};

export type Role = "Admin" | "Doctor" | "Patient";

export type Allcode =
  | "ROLE"
  | "STATUS"
  | "TIME"
  | "POSITION"
  | "GENDER"
  | "PRICE"
  | "PAYMENT"
  | "PROVINCE";

export type AllcodeArray = {
  id: string;
  key: string;
  type: string;
  valueEn: string;
  valueVi: string;
};
