import fs from 'fs';
import fetch from 'node-fetch';
import FormData from 'form-data';

function getReadStreamBuffer(filepath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(filepath);
    const attachment: Buffer[] = [];

    readStream.on('data', (chunk: Buffer) => {
      attachment.push(chunk);
    });

    readStream.on('error', err => {
      reject(err);
    });

    readStream.on('end', () => {
      resolve(Buffer.concat(attachment));
    });
  });
}

type SendEmailParams = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: string;
  replyTo?: string;
  attachments?: { url: string; filename: string }[];
  cachedFiles?: Record<string, Buffer>;
};

const AUTHTOKEN = `Basic ${Buffer.from(
  `api:${process.env.MAILGUN_API_KEY}`
).toString(`base64`)}`;

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  bcc,
  replyTo,
  attachments,
  cachedFiles,
}: SendEmailParams) {
  try {
    const form = new FormData();
    const endpoint = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

    form.append('to', to);
    form.append('from', from);
    form.append('subject', subject);
    form.append('text', text);

    if (html) form.append('html', html);
    if (bcc) form.append('bcc', bcc);
    if (replyTo) form.append('h:Reply-To', replyTo);
    if (attachments) {
      if (!cachedFiles) {
        throw new Error(
          'Must provide a cahcedFiles object for the buffered files'
        );
      }

      for (const attachment of attachments) {
        const filename = attachment.filename;
        const filepath = `/tmp/${filename}`;

        // check to see if the file already exists
        const fileExists = fs.existsSync(filepath);

        // if NO then fetch and writeFileSync
        if (!fileExists) {
          const response = await fetch(attachment.url);

          if (!response.ok) {
            throw new Error('An error occurred fetching the attachment');
          }

          const arrayBuffer = await response.arrayBuffer();

          fs.writeFileSync(filepath, Buffer.from(arrayBuffer), {
            encoding: null,
          });

          const attachmentBuffer = await getReadStreamBuffer(filepath);
          cachedFiles[filename] = attachmentBuffer;
        }

        form.append('attachment', cachedFiles[filename], { filename });
      }
    }

    const res = await fetch(endpoint, {
      method: 'post',
      body: form,
      headers: {
        Authorization: AUTHTOKEN,
      },
    });

    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
}
