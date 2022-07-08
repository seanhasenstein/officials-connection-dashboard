import cloudinary, { ResourceApiResponse } from 'cloudinary';
import { CloudinaryAttachment } from '../interfaces';

type CloudinaryAccumulator = {
  sessionsWithAttachments: Record<string, CloudinaryAttachment>;
  cloudinaryAttachments: CloudinaryAttachment[];
};

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

export async function getCloudinaryAttachments() {
  const cloudinaryData: ResourceApiResponse = await cloudinary.v2.api.resources(
    {
      type: 'upload',
      resource_type: 'raw',
      prefix: 'officials-connection/pdf',
      metadata: true,
      context: true,
    }
  );

  return cloudinaryData.resources.reduce(
    (accumulator: CloudinaryAccumulator, currentResource) => {
      const splitUrl = currentResource.secure_url.split('/');
      const filename = splitUrl[splitUrl.length - 1];
      const dataObj = {
        public_id: currentResource.public_id,
        filename,
        url: currentResource.url,
        secure_url: currentResource.secure_url,
        session_ids: currentResource.metadata?.session_ids
          ? currentResource.metadata.session_ids
          : undefined,
      };

      accumulator.cloudinaryAttachments.push(dataObj);

      if (currentResource.metadata) {
        const sessionIds: string[] = (
          currentResource.metadata as Record<string, any>
        ).session_ids.split(',');

        sessionIds.forEach(s => {
          accumulator.sessionsWithAttachments[s] = dataObj;
        });
      }

      return accumulator;
    },
    { sessionsWithAttachments: {}, cloudinaryAttachments: [] }
  );
}
