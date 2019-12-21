require('dotenv').config();
/**
 * Configuration to mail service
 */
export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'GymPoint Team <noreply@gympoint.com>',
  },
};
