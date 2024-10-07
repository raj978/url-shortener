"use server";

import { Resend } from 'resend';
import React from 'react';
import ContactFormEmail from '@/email/contact-form';
import { getErrorMessage } from '@/lib/utils';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const email = formData.get("email") as string | null;
  const shortUrl = formData.get("shortUrl") as string | null;
  const longUrl = formData.get("longUrl") as string | null;

  if (!email || !shortUrl || !longUrl) {
    return {
      error: 'Invalid form data',
    };
  }

  let data;
  try {
    data = await resend.emails.send({
      from: "URL-Shortener Service <onboarding@resend.dev>",
      to: email,
      subject: "Your Shortened URL",
      react: React.createElement(ContactFormEmail, {
        shortUrl,
        longUrl,
      }),
    });
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
