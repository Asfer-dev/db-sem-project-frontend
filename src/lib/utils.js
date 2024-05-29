import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTimeFromDateString(dateString) {
  const date = new Date(dateString);

  // Extract time components
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Determine AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  // Format time as H:mm AM/PM
  return `${hours}:${minutes} ${ampm}`;
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

export function getFormattedDate(dateString) {
  const date = new Date(dateString);

  // Options for toLocaleDateString to get the "Day Month" format
  const options = { day: "numeric", month: "long" };

  // Format the date string
  return date.toLocaleDateString("en-US", options);
}

export function isTodayOrFuture(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Normalize the dates to remove the time part
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  // Compare the dates
  return inputDate >= today;
}
