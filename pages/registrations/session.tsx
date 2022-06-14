import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { Registration, Session } from '../../interfaces';
import useAuthSession from '../../hooks/useAuthSession';
import useMenu from '../../hooks/useMenu';
import useSessionRegistrationsQuery from '../../hooks/queries/useSessionRegistrationsQuery';
import useYearQuery from '../../hooks/queries/useYearQuery';
import {
  formatSessionName,
  formatPhoneNumber,
  formatToMoney,
  getUrlParam,
} from '../../utils/misc';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function RegistrationSession() {
  const router = useRouter();
  const [authSession, authSessionLoading] = useAuthSession();
  const { getSession, year } = useYearQuery();
  const {
    isLoading,
    error,
    data: registrations,
  } = useSessionRegistrationsQuery(getUrlParam(router.query.sid));
  const { activeMenuId, isOpen, setIsOpen, handleMenuButtonClick } = useMenu();
  const [session, setSession] = React.useState<Session>();

  React.useEffect(() => {
    setSession(getSession(getUrlParam(router.query.sid)));
  }, [getSession, router.query.sid]);

  if (authSessionLoading || !authSession) return null;

  return (
    <Layout>
      <SessionStyles>
        <div className="container">
          <h2>{year?.year} WBYOC Registrations</h2>
          <h3>
            [<span>{session && formatSessionName(session)}</span>]
          </h3>
          {isLoading && <SessionLoadingSpinner isLoading={isLoading} />}
          {error instanceof Error && <div>Error: {error}</div>}
          {registrations && (
            <>
              {registrations.attending.length > 0 ? (
                <div className="section">
                  <h4>
                    Attending<span>({registrations.attending.length})</span>
                  </h4>
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th className="text-left lg-tb-cell">Date</th>
                          <th className="text-left name-cell">Camper</th>
                          <th className="text-left">Sessions</th>
                          <th className="text-left lg-tb-cell">Contact</th>
                          <th className="text-left">Total</th>
                          <th className="text-left">Status</th>
                          <th className="text-center">Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.attending.map((r: Registration) => (
                          <tr key={r._id}>
                            <td className="lg-tb-cell">
                              {format(new Date(r.createdAt), 'P hh:mmaa')}
                            </td>
                            <td className="name-cell">
                              <div className="camper">
                                {r.notes.length > 0 ? (
                                  <div className="has-notes">*</div>
                                ) : null}
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
                                    key={s.sessionId}
                                    className={
                                      s.attending
                                        ? 'attending'
                                        : 'not-attending'
                                    }
                                  >
                                    <Link
                                      href={`/registrations/session?sid=${s.sessionId}`}
                                    >
                                      {formatSessionName(s)}
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="lg-tb-cell">
                              <div className="contact">
                                <div className="email">
                                  <a href={`mailto:${r.email}`}>{r.email}</a>
                                </div>
                                <div>{formatPhoneNumber(r.phone)}</div>
                              </div>
                            </td>
                            <td>{formatToMoney(r.total, true)}</td>
                            <td className="status">
                              {r.paymentStatus === 'paid' && (
                                <span className="paid">Paid</span>
                              )}
                              {r.paymentStatus === 'fullyRefunded' ||
                                (r.paymentStatus === 'partiallyRefunded' && (
                                  <span className="refunded">Refunded</span>
                                ))}
                              {r.paymentStatus === 'unpaid' && (
                                <span className="unpaid">Needs to pay</span>
                              )}
                            </td>
                            <td>
                              <div className="menu-container">
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
                                      <a>View Registration</a>
                                    </Link>
                                    {/* <Link
                                      href={`/registrations/update?rid=${r._id}`}
                                    >
                                      <a>Update Registration</a>
                                    </Link> */}
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
                <div className="empty">
                  No one is currently registered to attend this session.
                </div>
              )}
              {registrations.notAttending.length > 0 && (
                <div className="section">
                  <h4>
                    Not Attending
                    <span>({registrations.notAttending.length})</span>
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
                          <th className="text-left">Status</th>
                          <th className="text-center">Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {registrations.notAttending.map((r: Registration) => (
                          <tr key={r._id}>
                            <td className="date">
                              {format(new Date(r.createdAt), 'P hh:mmaa')}
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
                                    key={s.sessionId}
                                    className={
                                      s.attending
                                        ? 'attending'
                                        : 'not-attending'
                                    }
                                  >
                                    <Link
                                      href={`/registrations/session?sid=${s.sessionId}`}
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
                            <td>{formatToMoney(r.total, true)}</td>
                            <td className="status">
                              {r.paymentStatus === 'paid' && (
                                <span className="paid">Paid</span>
                              )}
                              {r.paymentStatus === 'fullyRefunded' ||
                                (r.paymentStatus === 'partiallyRefunded' && (
                                  <span className="refunded">Refunded</span>
                                ))}
                              {r.paymentStatus === 'unpaid' && (
                                <span className="unpaid">Needs to pay</span>
                              )}
                            </td>
                            <td>
                              <div className="menu-container">
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
                                      <a>View Registration</a>
                                    </Link>
                                    <Link
                                      href={`/registrations/update?rid=${r._id}`}
                                    >
                                      <a>Update Registration</a>
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

  .empty {
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

  .lg-tb-cell {
    display: table-cell;
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
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
  }

  .has-notes {
    position: absolute;
    top: 0;
    left: -0.625rem;
    color: #b91c1c;
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
    padding: 0.25rem 0.4375rem;
    display: inline-flex;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    line-height: 1;
    border-radius: 0.1875rem;
  }

  .paid {
    background-color: #cdf9dc;
    color: #166534;
  }

  .refunded {
    background-color: #b8f6fd;
    color: #0e7490;
  }

  .unpaid {
    background-color: #fedddd;
    color: #991b1b;
  }

  .menu-container {
    position: relative;
    overflow: visible;
    color: #9ca3af;
    display: flex;
    justify-content: center;

    a:hover {
      text-decoration: none;
    }
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

  @media (max-width: 1170px) {
    th,
    td {
      padding-left: 0.5rem;
      padding-right: 0.5rem;

      &:first-of-type,
      &.name-cell {
        padding-left: 0.75rem;
      }

      &:last-of-type {
        padding-right: 0.75rem;
      }
    }

    .lg-tb-cell {
      display: none;
    }
  }
`;

const SessionLoadingSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
