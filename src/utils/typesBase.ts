export type Specialty = {
  id?: string;
  name: string;
  image: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
};

export type Clinic = {
  id?: string;
  name: string;
  address: string;
  descriptionMarkdown: string;
  descriptionHTML: string;
  provinceId: string;
  image: string;
};

export type DoctorInfor = {
  doctorId?: string;
  priceId: any;
  paymentId: any;
  provinceId: any;
  clinicId: any;
  specialtyId: any;
  contentMarkdown: string;
  contentHTML: string;
  description: string;
  note: string;
};

export type Booking = {
  doctorId?: string;
  date?: string;
  timeType?: string;
  email: string;
  firstName: string;
  phonenumber: string;
  address: string;
  reason: string;
  doctorName?: string;
  price?: string;
  time?: string;
  lang: string;
};
