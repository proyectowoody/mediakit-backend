import 'dotenv/config';

export const isProduction = process.env.NODE_ENV === "production"; 

export const GOOGLE_CLIENT_ID = isProduction
    ? process.env.GOOGLE_CLIENT_ID_PRODUCTION
    : process.env.GOOGLE_CLIENT_ID_DEV;

export const GOOGLE_CLIENT_SECRET = isProduction
    ? process.env.GOOGLE_CLIENT_SECRET_PRODUCTION
    : process.env.GOOGLE_CLIENT_SECRET_DEV;

export const URL_BACKEND = isProduction
    ? process.env.URL_BACKEND_PRODUCTION
    : process.env.URL_BACKEND_DEV;

export const URL_FRONTEND = isProduction
    ? process.env.URL_FRONTEND_PRODUCTION
    : process.env.URL_FRONTEND_DEV;
