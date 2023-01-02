import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import {
  CloudinaryAttachment,
  Registration,
  SessionWithAttachment,
} from '../types';
import useYearQuery from '../hooks/queries/useYearQuery';
import Layout from '../components/Layout';
import SessionAttachments from '../components/questionnaireEmails/SessionAttachments';
import Camp from '../components/questionnaireEmails/Camp';

type CloudinaryQuery = {
  attachments: CloudinaryAttachment[];
  kaukaunaEmailsNeeded: Registration[];
  plymouthEmailsNeeded: Registration[];
  sessions: SessionWithAttachment[];
};

export default function QuestionnaireEmails() {
  const yearQuery = useYearQuery();
  const cloudinaryQuery = useQuery<CloudinaryQuery, Error>(
    ['sessions', 'attachments'],
    async () => {
      const response = await fetch('/api/get-cloudinary-attachments');

      if (!response.ok) {
        throw new Error(
          'An error occurred fetching the cloudinary attachments'
        );
      }

      const data: CloudinaryQuery = await response.json();
      return {
        attachments: data.attachments,
        kaukaunaEmailsNeeded: data.kaukaunaEmailsNeeded,
        plymouthEmailsNeeded: data.plymouthEmailsNeeded,
        sessions: data.sessions,
      };
    },
    {
      staleTime: 1000 * 60 * 10, // 10 minutes
    }
  );

  if (!yearQuery.year) {
    return null;
  }

  return (
    <Layout title="Questionnaire Emails">
      <QuestionnaireEmailsStyles>
        <div className="container">
          {yearQuery.isLoading || cloudinaryQuery.isLoading ? (
            'Loading...'
          ) : (
            <div className="box">
              <div className="header-row">
                <h2>Questionnaire emails</h2>
              </div>
              <div className="section">
                <SessionAttachments
                  attachments={cloudinaryQuery.data?.attachments || []}
                  sessions={cloudinaryQuery.data?.sessions || []}
                  year={yearQuery.year}
                />
              </div>
              <div className="section emails-and-form grid-cols-2">
                <Camp
                  camp={yearQuery.year.camps.find(
                    c => c.location.city === 'Kaukauna'
                  )}
                  emailsNeeded={
                    cloudinaryQuery.data?.kaukaunaEmailsNeeded || []
                  }
                  sessions={cloudinaryQuery.data?.sessions}
                />
                <Camp
                  camp={yearQuery.year.camps.find(
                    c => c.location.city === 'Plymouth'
                  )}
                  emailsNeeded={
                    cloudinaryQuery.data?.plymouthEmailsNeeded || []
                  }
                  sessions={cloudinaryQuery.data?.sessions}
                />
              </div>
            </div>
          )}
        </div>
      </QuestionnaireEmailsStyles>
    </Layout>
  );
}

const QuestionnaireEmailsStyles = styled.div`
  padding: 3.5rem 0;
  background-color: #f3f4f6;
  min-height: calc(100vh - 151px);

  .container {
    margin: 0 auto;
    padding: 0;
    max-width: 80rem;
    width: 100%;
  }

  .box {
    margin: 0 0 2.25rem;
    padding: 2rem;
    border: 1px solid #e5e7eb;
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  }

  h2 {
    margin: 0;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 600;
  }

  h3 {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:after {
      content: '';
      border-top: 1px solid #e5e7eb;
      width: 100%;
    }
  }

  .dot {
    margin: 0 0.625rem 0 0;
    display: inline-block;
    height: 0.375rem;
    width: 0.375rem;
    border-radius: 9999px;

    &.valid {
      background-color: #34d399;
    }

    &.invalid {
      background-color: #fb7185;
    }
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .toggle {
    padding: 0;
    position: relative;
    flex-shrink: 0;
    display: inline-flex;
    height: 1.5rem;
    width: 2.75rem;
    border: 2px solid transparent;
    border-radius: 9999px;
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
        rgb(99, 102, 241) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }

    &.on {
      background-color: #0441ac;

      & .switch {
        transform: translateX(1.25rem);
      }
    }

    &.off {
      background-color: #dadde2;

      & .switch {
        transform: translateX(0rem);
      }
    }
  }

  .switch {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #fff;
    border-radius: 9999px;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(59, 130, 246, 0.5) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    pointer-events: none;
    transition-duration: 0.2s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .line-through {
    text-decoration: line-through;
  }

  .section {
    margin: 2.5rem 0 0;

    .attachments-header h3 {
      margin: 0;
    }

    .grid {
      display: flex;
      gap: 4rem;
    }
  }

  .grid-cols-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .emails-and-form {
    margin: 5rem 0 0;
    padding: 2.5rem 0;
    background-color: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 0.125rem;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);

    .grid {
      gap: 0;
    }

    .camp {
      padding: 0 2.5rem;
    }

    .item {
      padding: 0.5rem 0;
      display: grid;
      grid-template-columns: 1fr 1fr 1.125rem;
      align-items: center;
      font-size: 0.8125rem;
      color: #111827;
      border-top: 1px solid #e5e7eb;
      transition: all 100ms linear;

      &:hover {
        background-color: #f3f4f6;

        svg {
          color: #374151;
        }
      }

      &:last-of-type {
        margin: 0;
        border-bottom: 1px solid #e5e7eb;
      }

      .sessions {
        display: flex;
        flex-direction: column;
        gap: 0.3125rem;
      }

      svg {
        height: 1.125rem;
        width: 1.125rem;
        color: #9ca3af;
      }
    }

    .no-emails {
      padding: 0.5625rem 0;
      display: flex;
      align-items: center;
      gap: 0.4375rem;
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #1f2937;

      svg {
        height: 0.875rem;
        width: 0.875rem;
        color: #059669;
      }
    }
  }
`;
