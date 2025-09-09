import { Timestamp } from "firebase/firestore";

export function formatFirestoreDate(input: Date | Timestamp): string {
  // Convert Firestore Timestamp to JS Date if needed
  const date = input instanceof Timestamp ? input.toDate() : input;

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZoneName: "short",
  };

  // Format date
  let formatted = new Intl.DateTimeFormat("en-US", options).format(date);

  // Replace comma with "at" and GMT with UTC
  formatted = formatted.replace(",", " at").replace("GMT", "UTC");

  return formatted;
}
