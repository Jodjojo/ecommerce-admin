import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

///creating a formatter that we will use for the price format in the products model
export const formatter = new Intl.NumberFormat("en-us", {
	style: "currency",
	currency: "USD",
});
