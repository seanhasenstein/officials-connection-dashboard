export const mailgunAuthToken = `Basic ${Buffer.from(
  `api:${process.env.MAILGUN_API_KEY}`
).toString('base64')}`;
