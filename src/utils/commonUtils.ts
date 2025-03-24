import fs from "fs";
import { Allcode } from "./types";
import axios from "axios";

/**
 * The function get random number x of elements from a array
 * @param array
 * @returns child of array
 */
export function getRandomElements(array: any[]) {
  const number = randomIndex(array) + 1;
  const shuffled = [...array].sort(() => 0.5 - Math.random()); // Trộn ngẫu nhiên mảng
  return shuffled.slice(0, number); // Lấy `count` phần tử đầu tiên
}

/**
 * The function that return random a element from a array
 * @param array
 * @returns a random element
 */
export function randomValue(array: any[]) {
  const index = randomIndex(array);
  return array[index];
}

export function randomIndex(array: any[]) {
  return Math.floor(Math.random() * array.length);
}

/**
 * The function return a date from today to process.env.RANGE_DATE
 * @returns
 */
export function getRandomDateFromToday(): string {
  const rangeDate = Number(process.env.RANGE_DATE);
  const today = new Date();
  const randomDays = Math.floor(Math.random() * rangeDate);
  const randomDate = new Date(today);
  randomDate.setDate(today.getDate() + randomDays);
  const formattedDate = randomDate.toISOString().split("T")[0];
  return formattedDate;
}

/**
 * The function convert file to base64
 * @param filePath
 * @returns
 */
export function getBase64(filePath: string): string {
  const imageBuffer = fs.readFileSync(filePath);
  return imageBuffer.toString("base64");
}

export function convertBufferToBase64(bufferData: string) {
  const base64 = Buffer.from(bufferData).toString("utf-8");
  return base64;
}

export async function getAllcode(inputType: Allcode) {
  const response = await axios.get(
    `${process.env.SERVER_URL}/api/allcode?type=${inputType}`
  );
  let data = response.data;
  return data.data;
}

export function convertDatetimeToString(datetime: Date) {
  return new Date(datetime).toISOString().split("T")[0];
}
