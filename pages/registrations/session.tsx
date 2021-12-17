import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Registration } from '../../interfaces';
import useRegistration from '../../hooks/useRegistration';
import useSession from '../../hooks/useSessions';
import useMenu from '../../hooks/useMenu';
import {
  formatSessionName,
  formatPhoneNumber,
  formatToMoney,
} from '../../utils';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RegistrationSession() {
  const [authSession, authSessionLoading] = useSession();
  const { session, sessionQuery } = useRegistration();
  const { activeMenuId, isOpen, setIsOpen, handleMenuButtonClick } = useMenu();

  if (authSessionLoading || !authSession) return null;

  return (
    <Layout>
      <SessionStyles>
        <div className="container">
          <h2>2021 WBYOC Registrations</h2>
          <h3>
            [<span>{session && formatSessionName(session)}</span>]
          </h3>
          {sessionQuery.isLoading && (
            <SessionLoadingSpinner isLoading={sessionQuery.isLoading} />
          )}
          {sessionQuery.error instanceof Error && (
            <div>Error: {sessionQuery.error}</div>
          )}
          {sessionQuery.isSuccess && sessionQuery.data && (
            <>
              {sessionQuery.data.attending.length > 0 ? (
                <div className="section">
                  <h4>
                    Attending<span>({sessionQuery.data.attending.length})</span>
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th className="text-left">Date</th>
                          <th className="text-left">Camper</th>
                          <th className="text-left">Sessions</th>
                          <th className="text-left">Contact</th>
                          <th className="text-left">Total</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionQuery.data.attending.map((r: Registration) => (
                          <tr key={r._id}>
                            <td className="date">
                              {format(new Date(r.createdAt), 'P')}
                            </td>
                            <td>
                              <div className="camper">
                                <div className="camper-name">
                                  <Link href={`/registrations/${r._id}`}>
                                    <a>
                                      {r.firstName} {r.lastName}
                                    </a>
                                  </Link>
                                </div>
                                <div className="camper-location">
                                  {r.address.city}
                                  {r.address.city && r.address.state ? (
                                    <>{', '}</>
                                  ) : null}
                                  {r.address.state}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="sessions">
                                {r.sessions.map(s => (
                                  <div
                                    key={s.id}
                                    className={
                                      s.attending
                                        ? 'attending'
                                        : 'not-attending'
                                    }
                                  >
                                    <Link
                                      href={`/registrations/session?sid=${s.id}`}
                                    >
                                      {formatSessionName(s)}
                                    </Link>
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
                            <td>
                              {formatToMoney(r.total - r.refundAmount, true)}
                            </td>
                            <td className="status text-center">
                              {r.paymentStatus === 'paid' && (
                                <span className="paid">Paid</span>
                              )}
                              {r.paymentStatus === 'fullyRefunded' && (
                                <span className="refunded">Fully refunded</span>
                              )}
                              {r.paymentStatus === 'partiallyRefunded' && (
                                <span className="refunded">
                                  Partially refunded
                                </span>
                              )}
                              {r.paymentStatus === 'unpaid' && (
                                <span className="unpaid">Needs to pay</span>
                              )}
                            </td>
                            <td>
                              <div className="menu">
                                <button
                                  type="button"
                                  onClick={() => handleMenuButtonClick(r._id)}
                                  className="menu-button"
                                >
                                  <span className="sr-only">Menu</span>
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
                                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                    />
                                  </svg>
                                </button>
                                <Menu
                                  open={r._id === activeMenuId && isOpen}
                                  setOpen={setIsOpen}
                                >
                                  <>
                                    <Link href={`/registrations/${r._id}`}>
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
                                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                          />
                                        </svg>
                                        View Registration
                                      </a>
                                    </Link>
                                    <Link
                                      href={`/registrations/update?rid=${r._id}`}
                                    >
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
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                          />
                                        </svg>
                                        Update Registration
                                      </a>
                                    </Link>
                                  </>
                                </Menu>
                              </div>
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
              {sessionQuery.data.notAttending.length > 0 && (
                <div className="section">
                  <h4>
                    Not Attending
                    <span>({sessionQuery.data.notAttending.length})</span>
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th className="text-left">Date</th>
                          <th className="text-left">Camper</th>
                          <th className="text-left">Sessions</th>
                          <th className="text-left">Contact</th>
                          <th className="text-left">Total</th>
                          <th className="text-center">Status</th>
                          <th className="text-center">Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sessionQuery.data.notAttending.map(
                          (r: Registration) => (
                            <tr key={r._id}>
                              <td className="date">
                                {format(new Date(r.createdAt), 'P')}
                              </td>
                              <td>
                                <div className="camper">
                                  <div className="camper-name">
                                    <Link href={`/registrations/${r._id}`}>
                                      <a>
                                        {r.firstName} {r.lastName}
                                      </a>
                                    </Link>
                                  </div>
                                  <div className="camper-location">
                                    {r.address.city}
                                    {r.address.city && r.address.state ? (
                                      <>{', '}</>
                                    ) : null}
                                    {r.address.state}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="sessions">
                                  {r.sessions.map(s => (
                                    <div
                                      key={s.id}
                                      className={
                                        s.attending
                                          ? 'attending'
                                          : 'not-attending'
                                      }
                                    >
                                      <Link
                                        href={`/registrations/session?gid=${s.id}`}
                                      >
                                        {formatSessionName(s)}
                                      </Link>
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
                              <td>
                                {formatToMoney(r.total - r.refundAmount, true)}
                              </td>
                              <td className="status text-center">
                                {r.paymentStatus === 'paid' && (
                                  <span className="paid">Paid</span>
                                )}
                                {r.paymentStatus === 'fullyRefunded' && (
                                  <span className="refunded">
                                    Fully refunded
                                  </span>
                                )}
                                {r.paymentStatus === 'partiallyRefunded' && (
                                  <span className="refunded">
                                    Partially refunded
                                  </span>
                                )}
                                {r.paymentStatus === 'unpaid' && (
                                  <span className="unpaid">Needs to pay</span>
                                )}
                              </td>
                              <td>
                                <div className="menu">
                                  <button
                                    type="button"
                                    onClick={() => handleMenuButtonClick(r._id)}
                                    className="menu-button"
                                  >
                                    <span className="sr-only">Menu</span>
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
                                        d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                      />
                                    </svg>
                                  </button>
                                  <Menu
                                    open={r._id === activeMenuId && isOpen}
                                    setOpen={setIsOpen}
                                  >
                                    <>
                                      <Link href={`/registrations/${r._id}`}>
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
                                              d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                          </svg>
                                          View Registration
                                        </a>
                                      </Link>
                                      <Link
                                        href={`/registrations/update?rid=${r._id}`}
                                      >
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
                                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                          </svg>
                                          Update Registration
                                        </a>
                                      </Link>
                                    </>
                                  </Menu>
                                </div>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </SessionStyles>
    </Layout>
  );
}

const SessionStyles = styled.div`
  padding: 5rem 2.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    margin: 0 auto;
    max-width: 77.5rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.25rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    text-align: center;
  }

  h3 {
    margin: 0 0 3.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.75rem;
    font-weight: 400;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    text-align: center;
    color: #d1d5db;

    span {
      font-size: 1.125rem;
      font-weight: 600;
      color: #9ca3af;
    }
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

  .table-container {
    padding: 0.75rem;
    overflow: visible;
    border-radius: 0.375rem;
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
    padding: 0.75rem 1rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody {
    background-color: #fff;
    border-top: 1px solid rgb(229, 231, 235);
  }

  tr:nth-of-type(even) td {
    background-color: #f9fafb;
  }

  td {
    padding: 0.875rem 1rem;
    white-space: nowrap;
    font-size: 0.8125rem;
    font-weight: 500;
    color: #6b7280;
    border-bottom: 1px solid #edf0f3;

    a:hover {
      text-decoration: underline;
    }
  }

  .camper {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .camper-name {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;

    &:hover {
      text-decoration: underline;
    }
  }

  .camper-location {
    font-size: 0.75rem;
    font-weight: 500;
    color: #9ca3af;
  }

  .sessions,
  .contact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .not-attending {
    color: #b91c1c;
    text-decoration: line-through;
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
    border: 1px solid #bbf7d0;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px,
      inset 0 1px 1px #fff;
  }

  .refunded {
    background-color: #e0e7ff;
    color: #3730a3;
    border: 1px solid #c7d2fe;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px,
      inset 0 1px 1px #fff;
  }

  .unpaid {
    background-color: #ffe4e6;
    color: #9f1239;
    border: 1px solid #fecdd3;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px,
      inset 0 1px 1px #fff;
  }

  .menu {
    position: relative;
    overflow: visible;
    color: #9ca3af;
    display: flex;
    justify-content: center;
  }

  .menu-button {
    margin: 0;
    padding: 0;
    height: 1.625rem;
    width: 1.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    border-radius: 9999px;

    svg {
      height: 1.125rem;
      width: 1.125rem;
    }

    &:hover {
      color: #111827;
    }
  }
`;

const SessionLoadingSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
