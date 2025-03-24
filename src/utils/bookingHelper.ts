import axios from "axios";

import {
  BookingDataType,
  ConfirmBookingDataType,
} from "../tests/testData/bookingData";

export async function createBookingByApi(bookingInfor: BookingDataType) {
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/patient-book-appointment`,
    { data: bookingInfor }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to create booking");
  }
}

export async function verifyBookingByApi(
  bookingToken: string,
  doctorId: string
) {
  const response = await axios.put(
    `${process.env.SERVER_URL}/api/verify-book-appointment?token=${bookingToken}&doctorId=${doctorId}`
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to verify booking");
  }
}

export async function confirmBookingDoneByApi(
  token: string,
  confirmBookingData: ConfirmBookingDataType
) {
  const response = await axios.post(
    `${process.env.SERVER_URL}/api/confirm-book-done`,
    {
      headers: { Authorization: token },
      data: confirmBookingData,
    }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to verify booking");
  }
}

export async function deleteBookingByApi(token: string, bookId: string) {
  const response = await axios.delete(
    `${process.env.SERVER_URL}/api/delete-book-appointment`,
    {
      headers: { Authorization: token },
      params: { id: bookId },
    }
  );
  if (response.status !== 200 || response.data.errCode !== 0) {
    throw new Error("Failed to delete booking");
  }
}
