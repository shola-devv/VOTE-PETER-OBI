declare module 'framer-motion';
declare module 'nodemailer';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      profile?: number | null;
    };
  }
}