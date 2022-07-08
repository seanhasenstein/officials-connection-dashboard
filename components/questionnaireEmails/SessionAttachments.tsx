import React from 'react';
import styled from 'styled-components';
import { useQueryClient } from 'react-query';
import {
  CloudinaryAttachment,
  SessionWithAttachment,
  Year,
} from '../../interfaces';
import {
  cloudinaryUrl,
  getCloudinarySignature,
} from '../../utils/questionnaire';
import Session from './Session';

type Props = {
  attachments: CloudinaryAttachment[];
  sessions: SessionWithAttachment[];
  year: Year;
};

export default function SessionAttachments(props: Props) {
  const queryClient = useQueryClient();

  const handleUploadPdf = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files[0] === undefined) return;

    const public_id = `officials-connection/pdf/${e.target.files[0].name}`;
    const { signature, timestamp } = await getCloudinarySignature(public_id);

    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('api_key', `${process.env.NEXT_PUBLIC_CLOUDINARY_KEY}`);
    formData.append('public_id', public_id);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);

    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('An error occurred uploading to cloudinary');
    }

    queryClient.invalidateQueries('sessions');
  };

  return (
    <SessionAttachmentsStyles>
      <div className="attachments-header">
        <h3>Sessions attachments</h3>
        <label htmlFor="upload-pdf" className="add-attachment-label">
          Upload a pdf
        </label>
        <input
          type="file"
          accept="image/pdf"
          name="upload-pdf"
          id="upload-pdf"
          className="sr-only"
          onChange={handleUploadPdf}
        />
      </div>
      <div className="grid">
        <div className="camp">
          {props.sessions
            .filter(s => s.camp.name === 'Kaukauna')
            .map(s => (
              <Session
                key={s.sessionId}
                attachments={props.attachments}
                session={s}
                sessions={props.sessions.filter(
                  s => s.camp.name === 'Kaukauna'
                )}
                year={props.year}
              />
            ))}
        </div>
        <div className="camp">
          {props.sessions
            .filter(s => s.camp.name === 'Plymouth')
            .map(s => (
              <Session
                key={s.sessionId}
                attachments={props.attachments}
                session={s}
                sessions={props.sessions.filter(
                  s => s.camp.name === 'Plymouth'
                )}
                year={props.year}
              />
            ))}
        </div>
      </div>
    </SessionAttachmentsStyles>
  );
}

const SessionAttachmentsStyles = styled.div`
  .attachments-header {
    margin: 0 0 2rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .camp {
    width: 100%;
  }

  .add-attachment-label {
    padding: 0.375rem 0.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;
    transition: all 150ms linear;

    &:hover {
      color: #000;
      border-color: #dadde2;
      box-shadow: 0 1px 4px 0 rgb(0 0 0 / 0.075);
    }
  }
`;
