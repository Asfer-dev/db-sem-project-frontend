import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTimeFromDateString(dateString) {
  const date = new Date(dateString);
  // Extract time components
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format time as HH:mm:ss
  return `${hours}:${minutes}:${seconds}`;
}

export function combineDateAndTime(date, time) {
  // Ensure the date is a Date object
  if (!(date instanceof Date)) {
    throw new Error("Invalid date object");
  }

  // Ensure the time is a string in HH:mm format
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) {
    throw new Error("Invalid time format");
  }

  // Extract date parts
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const day = String(date.getDate()).padStart(2, "0");

  // Combine date and time parts into a datetime string
  const datetimeString = `${year}-${month}-${day}T${time}:00`;

  return datetimeString;
}
