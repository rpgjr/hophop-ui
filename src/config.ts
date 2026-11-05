// Single place that reads .env values. Add new globals here.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const CURRENCY_LOCALE = import.meta.env.VITE_CURRENCY_LOCALE;

export const CURRENCY_SYMBOLS = { PHP: "₱", USD: "$" } as const;
