import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

type SendEmailParams = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: { url: string; filename: string }[];
};

// const AUTHTOKEN = `Basic ${Buffer.from(
//   `api:${process.env.MAILGUN_API_KEY}`
// ).toString(`base64`)}`;

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  bcc,
  replyTo,
  attachments,
}: SendEmailParams) {
  try {
    console.log('inside sendEmail function...');
    const form = new FormData();
    // const endpoint = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

    form.append('to', to);
    form.append('from', from);
    form.append('subject', subject);
    form.append('text', text);

    if (html) form.append('html', html);
    if (bcc) form.append('bcc', bcc);
    if (replyTo) form.append('h:Reply-To', replyTo);
    if (attachments) {
      for (const attachment of attachments) {
        const filename = attachment.filename;

        // check to see if the file already exists
        const fileExists = fs.existsSync(`/tmp/${filename}`);

        // if NO then fetch and writeFileSync
        if (!fileExists) {
          const response = await fetch(attachment.url);

          if (!response.ok) {
            throw new Error('An error occurred fetching the attachment');
          }

          const arrayBuffer = await response.arrayBuffer();

          fs.writeFileSync(`/tmp/${filename}`, Buffer.from(arrayBuffer), {
            encoding: null,
          });

          console.log('FILEPATH: ', `/tmp/${filename}`);
        }

        // if YES then add that file to the form data
        form.append('attachment', fs.createReadStream(filename));
      }
    }

    console.log('FORM: ', form);

    // const res = await fetch(endpoint, {
    //   method: 'post',
    //   body: form,
    //   headers: {
    //     Authorization: AUTHTOKEN,
    //   },
    // });

    // const data = await res.json();

    // return data;
  } catch (error) {
    console.error(error);
  }
}
