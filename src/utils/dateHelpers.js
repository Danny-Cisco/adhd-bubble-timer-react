/**
 * Format a date in a simple human-readable format
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDateSimple = (date) => {
  if (!date) return "";

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const dayNum = date.getDate();

  let hours = date.getHours();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${dayName}, ${monthName} ${dayNum}, ${hours}:${minutes} ${ampm}`;
};
