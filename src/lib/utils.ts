import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTo12HourFormat(time24: string) {
    if (!time24) return "";
    const [hours, minutes] = time24.split(":");
    let h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    
    const hStr = h < 10 ? `0${h}` : h;
    return `${hStr}:${minutes} ${ampm}`;
}
