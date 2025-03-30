import { createTransport } from 'nodemailer';
import 'dotenv/config';

export const nodemailerTransport = createTransport({
  host: process.env.GMAIL_SMTP,
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});
