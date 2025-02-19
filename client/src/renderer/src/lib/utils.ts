import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function printInvoice(invoice: string) {
  await window.api.urlPreview(
    `http://localhost:5000/invoices/${invoice}/render`,
  );
}
