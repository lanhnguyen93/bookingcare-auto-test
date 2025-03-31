import axios from "axios";
import { api } from "./api";
import { randomSpecialtyData } from "../tests/testData/specialtyData";
import { randomClinicData } from "../tests/testData/clinicData";
import { randomDoctorInforData } from "../tests/testData/doctorInforData";
import { randomSchedulesData } from "../tests/testData/schedulesData";
import { Clinic, Specialty } from "./types";

export async function getAllSpecialtiesByApi(specialtyId?: string) {
  const id = specialtyId ? specialtyId : "ALL";
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-specialty`,
    { params: { id: id } }
  );
  let data = response.data;
  return data.specialties;
}

export async function createSpecialtyByApi(token: string) {
  const specialtyInfor = randomSpecialtyData();
  const response = await api.post(`/api/create-specialty`, specialtyInfor, {
    headers: { Authorization: token },
  });
  let specialty = response.data.specialty;
  return specialty;
}

export async function deleteSpecialtyByApi(token: string, specialtyId: string) {
  const response = await api.delete(`/api/delete-specialty`, {
    headers: { Authorization: token },
    params: { id: specialtyId },
  });
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete specialty");
  }
}

export async function deleteSpecialtyByName(
  token: string,
  specialtyName: string
) {
  const specialties = await getAllSpecialtiesByApi();
  let id = "";
  const specialty = specialties.find(
    (specialty: Specialty) => specialty.name === specialtyName
  );
  if (specialty.id) {
    await deleteSpecialtyByApi(token, specialty.id);
  } else {
    throw new Error("The specialty is not exist");
  }
}

export async function getAllClinicsByApi() {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-clinics`,
    { params: { id: "ALL" } }
  );
  let data = response.data;
  return data.clinics;
}

export async function createClinicByApi(token: string) {
  const clinicInfor = await randomClinicData();
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/create-clinic`,
    clinicInfor,
    { headers: { Authorization: token } }
  );
  let clinic = response.data.clinic;
  return clinic;
}

export async function deleteClinicByApi(token: string, clinicId: string) {
  const response = await api.delete(`/api/delete-clinic`, {
    headers: { Authorization: token },
    params: { id: clinicId },
  });
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete specialty");
  }
}

export async function deleteClinicByName(token: string, clinicName: string) {
  const clinics = await getAllClinicsByApi();
  const clinic = clinics.find((clinic: Clinic) => clinic.name === clinicName);
  if (clinic.id) {
    await deleteClinicByApi(token, clinic.id);
  } else {
    throw new Error("The clinic is not exist");
  }
}

export async function getAllDoctorByApi() {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-all-doctors`
  );
  let data = response.data;
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to get all doctors");
  }
  return data.data;
}

export async function getTopDoctorByApi() {
  const limit = process.env.DOCTOR_LIMIT ? process.env.DOCTOR_LIMIT : 10;
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/top-doctor-home`,
    { params: { limit: limit } }
  );
  let data = response.data;
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to get top doctors");
  }
  return data.data;
}

export async function getDetailDoctorByDoctorIdByApi(doctorId: string) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/get-detail-doctor-by-doctor-id`,
    { params: { doctorId: doctorId } }
  );
  let data = response.data;
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to get detail doctor");
  }
  return data.doctorInfor;
}

export async function createDoctorInforByApi(token: string, doctorId: string) {
  const doctorInforData = await randomDoctorInforData(doctorId);
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/create-detail-info-doctor`,
    doctorInforData,
    { headers: { Authorization: token } }
  );

  let data = await response.data;
  if (response.status !== 201 || data.errCode !== 0) {
    throw new Error("Failed to create doctor infor");
  }
  return data.doctor;
}

export async function deleteDoctorInforByApi(token: string, doctorId: string) {
  const response = await axios.delete(
    `${process.env.SERVER_URL}/api/delete-detail-info-doctor`,
    {
      headers: { Authorization: token },
      params: { doctorId: doctorId },
    }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete doctor infor");
  }
}

export async function createSchedulesByApi(
  token: string,
  doctorId: string,
  date?: string
) {
  const schedulesData = await randomSchedulesData(doctorId, date);
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/bulk-create-schedules`,
    schedulesData,
    { headers: { Authorization: token } }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete schedule");
  }
  return response.data.schedules;
}

export async function deleteScheduleByApi(
  token: string,
  doctorId: string,
  date: string
) {
  const response = await axios.delete(
    `${process.env.SERVER_URL}/api/delete-schedules`,
    {
      headers: { Authorization: token },
      data: { doctorId: doctorId, date: date },
    }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete schedule");
  }
}
