// email/contact-form.tsx
import React from 'react';

interface ContactFormEmailProps {
  shortUrl: string;
  longUrl: string;
}

const ContactFormEmail: React.FC<ContactFormEmailProps> = ({ shortUrl, longUrl }) => {
  return (
    <div>
      <p>Your shortened URL is: {shortUrl}</p>
      <p>The original URL is: {longUrl}</p>
    </div>
  );
};

export default ContactFormEmail;
