import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { connectToDb, registration } from '../../db';
import styled from 'styled-components';
import { Registration, Session } from '../../interfaces';
import { formatPhoneNumber } from '../../utils';
import { sessionsData } from '../../data';
import Layout from '../../components/Layout';

const HomeStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .wrapper {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.25rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
  }

  h3 {
    margin: 0;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-align: center;
    color: #9ca3af;
  }

  h4 {
    margin: 0 0 1rem;
    padding: 0 1rem;
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.0375em;

    span {
      margin-left: 0.375rem;
    }
  }

  .section {
    margin: 4rem 0 0;
  }

  .no-attending-registrations {
    margin: 4rem 0 0;
    padding: 1.25rem 0;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 500;
    color: #4b5563;
    background-color: #edf0f3;
    border-top: 1px solid #dadde2;
    border-bottom: 1px solid #dadde2;
  }

  .table-wrapper {
    padding: 0.75rem;
    overflow: hidden;
    border-radius: 0.5rem;
    background-color: #fff;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  table {
    min-width: 100%;
    border-collapse: collapse;
  }

  thead {
    background-color: #f9fafb;
    border-top: 1px solid #edf0f3;
    border-bottom: 1px solid #edf0f3;
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &.text-right {
      text-align: right;
    }
  }

  tr:nth-of-type(even) td {
    background-color: #f9fafb;
  }

  td {
    padding: 0.875rem 1.5rem;
    white-space: nowrap;
    font-size: 0.875rem;
    border-bottom: 1px solid #edf0f3;
  }

  .name,
  .sessions {
    color: #1f2937;
    font-weight: 500;
  }

  .sessions,
  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .sessions > div {
    display: flex;
    align-items: center;
    line-height: 1;

    .attending,
    .not-attending {
      margin: 0 0.375rem 0 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 1rem;
      width: 1rem;
      border-radius: 9999px;

      svg {
        height: 1rem;
        width: 1rem;
      }
    }

    .attending {
      color: #0ea5e9;
    }

    .not-attending {
      color: #dc2626;
    }
  }

  .contact {
    color: #4b5563;
  }

  .email a:hover {
    text-decoration: underline;
  }

  .status {
    text-align: center;
  }

  .paid,
  .refunded,
  .unpaid {
    padding: 0 0.5rem;
    display: inline-flex;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1.25rem;
    border-radius: 9999px;
  }

  .paid {
    background-color: #dcfce7;
    color: #16a34a;
  }

  .refunded {
    background-color: #ffedd5;
    color: #9a3412;
  }

  .unpaid {
    background-color: #ffe4e6;
    color: #9f1239;
  }

  .links {
    color: #9ca3af;
    text-align: right;

    a {
      padding: 0.25rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border-radius: 9999px;

      &:first-of-type {
        margin: 0 0.5rem 0 0;
      }

      &:hover {
        background-color: #edf0f3;
        color: #4b5563;
      }
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }
  }
`;

type Props = {
  registrations: {
    attending: Registration[];
    notAttending: Registration[];
  };
  session: Session;
};

export default function Index({ registrations, session }: Props) {
  return (
    <Layout>
      <HomeStyles>
        <div className="wrapper">
          <h2>2021 WBYOC Registrations</h2>
          <h3>[{session?.name}]</h3>
          {registrations.attending.length > 0 ? (
            <div className="section">
              <h4>
                Attending<span>({registrations.attending.length})</span>
              </h4>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Sessions</th>
                      <th>Contact</th>
                      <th className="status">Status</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.attending.map((r: Registration) => (
                      <tr key={r._id}>
                        <td className="name">
                          {r.firstName} {r.lastName}
                        </td>
                        <td>
                          <div className="sessions">
                            {r.sessions.map(s => (
                              <div key={s.id}>
                                {s.attending ? (
                                  <span className="attending">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="not-attending">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                                {s.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="contact">
                            <div className="email">
                              <a href={`mailto:${r.email}`}>{r.email}</a>
                            </div>
                            <div>{formatPhoneNumber(r.phone)}</div>
                          </div>
                        </td>
                        <td className="status">
                          {r.paymentStatus === 'succeeded' && (
                            <span className="paid">Paid</span>
                          )}
                          {r.paymentStatus === 'fully_refunded' && (
                            <span className="refunded">Fully refunded</span>
                          )}
                          {r.paymentStatus === 'unpaid' && (
                            <span className="unpaid">Needs to pay</span>
                          )}
                        </td>
                        <td className="links">
                          <Link href={`/registration?id=${r._id}`}>
                            <a>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                            </a>
                          </Link>
                          <Link href={`/registration/edit?id=${r._id}`}>
                            <a>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                              </svg>
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="no-attending-registrations">
              No one is currently registered to attend this session.
            </div>
          )}
          {registrations.notAttending.length > 0 && (
            <div className="section">
              <h4>
                No Longer Attending
                <span>({registrations.notAttending.length})</span>
              </h4>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Sessions</th>
                      <th>Contact</th>
                      <th className="status">Status</th>
                      <th className="text-right">
                        [{registrations.notAttending.length}]
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.notAttending.map((r: Registration) => (
                      <tr key={r._id}>
                        <td className="name">
                          {r.firstName} {r.lastName}
                        </td>
                        <td>
                          <div className="sessions">
                            {r.sessions.map(s => (
                              <div key={s.id}>
                                {s.attending ? (
                                  <span className="attending">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                ) : (
                                  <span className="not-attending">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                )}
                                {s.name}
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <div className="contact">
                            <div className="email">
                              <a href={`mailto:${r.email}`}>{r.email}</a>
                            </div>
                            <div>{formatPhoneNumber(r.phone)}</div>
                          </div>
                        </td>
                        <td className="status">
                          {r.paymentStatus === 'succeeded' && (
                            <span className="paid">Paid</span>
                          )}
                          {r.paymentStatus === 'fully_refunded' && (
                            <span className="refunded">Fully refunded</span>
                          )}
                          {r.paymentStatus === 'unpaid' && (
                            <span className="unpaid">Needs to pay</span>
                          )}
                        </td>
                        <td className="links">
                          <Link href={`/registration?id=${r._id}`}>
                            <a>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 6h16M4 12h16M4 18h16"
                                />
                              </svg>
                            </a>
                          </Link>
                          <Link href={`/registration/edit?id=${r._id}`}>
                            <a>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                                />
                              </svg>
                            </a>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </HomeStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    if (!id) {
      throw new Error('No query id provided.');
    }

    const { db } = await connectToDb();
    const response = await registration.getRegistrations(db, {
      'sessions.id': context.query.id,
    });

    const session = sessionsData.find(s => s.id === context.query.id);

    const registrations = response.sort((a, b) => {
      if (a.lastName === b.lastName) return a.firstName < b.firstName ? -1 : 1;
      return a.lastName < b.lastName ? -1 : 1;
    });

    const sortedRegistrations = registrations.reduce(
      (acc, currReg: Registration) => {
        currReg.sessions.forEach(s => {
          if (s.id === context.query.id && s.attending) {
            acc.attending.push(currReg);
            return;
          } else if (s.id === context.query.id) {
            acc.notAttending.push(currReg);
          }
        });
        return acc;
      },
      { attending: [], notAttending: [] }
    );

    return {
      props: {
        registrations: {
          attending: sortedRegistrations.attending,
          notAttending: sortedRegistrations.notAttending,
        },
        session,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};
