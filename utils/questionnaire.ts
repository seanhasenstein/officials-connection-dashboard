export const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_NAME}/raw/upload`;

export async function getCloudinarySignature(public_id: string, metadata = '') {
  const response = await fetch(
    `/api/get-cloudinary-signature?public_id=${public_id}&metadata=${metadata}`
  );
  const data: { signature: string; timestamp: string } = await response.json();
  const { signature, timestamp } = data;
  return { signature, timestamp };
}
