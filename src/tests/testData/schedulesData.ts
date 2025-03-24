import {
  getAllcode,
  getRandomDateFromToday,
  getRandomElements,
} from "../../utils/commonUtils";

export interface ScheduleDataType {
  currentNumber?: number;
  maxNumber?: number;
  date: string;
  timeType: string;
  doctorId: string;
}

export type ScheduleDataArray = ScheduleDataType[];

/**
 * The function create random schedules (object) for a doctor
 * @param doctorId
 * @param _date otional: create random schedules for the specific date
 * @returns
 */
export async function randomSchedulesData(
  doctorId: string,
  _date?: string
): Promise<ScheduleDataArray> {
  let date: string = _date ? _date : getRandomDateFromToday();
  const timeTypes = await getAllcode("TIME");
  const randomTimetypes = getRandomElements(timeTypes);

  const schedule = randomTimetypes.map((timeType) => ({
    doctorId: doctorId,
    date: date,
    timeType: timeType.key,
  }));

  return schedule;
}
