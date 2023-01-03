import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { FilterOptions, Registration, SortOrder, SortVariable } from '../types';
import useAuthSession from '../hooks/useAuthSession';
import useMenu from '../hooks/useMenu';
import useNotification from '../hooks/useNotification';
import useRegistrationSearch from '../hooks/useRegistrationSearch';
import useRegistrationsQuery from '../hooks/queries/useRegistrationsQuery';
import useYearQuery from '../hooks/queries/useYearQuery';
import { formatSessionName, formatToMoney } from '../utils/misc';
import Layout from '../components/Layout';
import Menu from '../components/Menu';
import Notification from '../components/Notification';
import LoadingSpinner from '../components/LoadingSpinner';
import SortAndFilter from '../components/SortAndFilter';

export default function Home() {
  const [session, sessionLoading] = useAuthSession();
  const router = useRouter();
  const { year } = useYearQuery();
  const { isLoading, error, data: registrations } = useRegistrationsQuery();
  const [sortOrder, setSortOrder] = React.useState<SortOrder>('descending');
  const [sortVariable, setSortVariable] = React.useState<SortVariable>('date');
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>({
    paymentStatus: [],
    sessions: [],
  });
  const [sortFilterResults, setSortFilterResults] = React.useState<
    Registration[]
  >([]);
  const { search, setSearch, searchResults, handleSearchChange } =
    useRegistrationSearch(sortFilterResults);
  const { isOpen, setIsOpen, activeMenuId, handleMenuButtonClick } = useMenu();
  const { showNotification, setShowNotification } = useNotification();

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <HomeStyles showDeleteButton={search.length > 0}>
        <div className="container">
          <h2>{year?.year} WBYOC Registrations</h2>
          <h3>
            [<span>All Registrations</span>]
          </h3>
          {isLoading && <RegistrationLoadingSpinner isLoading={isLoading} />}
          {error && <div>Error: {error.message}</div>}
          <>
            {registrations && (
              <>
                <div className="table-actions-row">
                  <SortAndFilter
                    regQueryData={registrations}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    sortVariable={sortVariable}
                    setSortVariable={setSortVariable}
                    filterOptions={filterOptions}
                    setFilterOptions={setFilterOptions}
                    setRegistrations={setSortFilterResults}
                  />
                  <div className="search">
                    <div className="icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <label htmlFor="search" className="sr-only">
                      Search Registrations
                    </label>
                    <input
                      type="text"
                      placeholder="Search"
                      name="search"
                      id="search"
                      value={search}
                      onChange={handleSearchChange}
                    />
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="delete-search-button"
                      tabIndex={search.length > 0 ? 0 : -1}
                    >
                      <span className="sr-only">Delete search text</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {searchResults && (
                  <div className="table-container">
                    <table>
                      <thead>
                        <tr>
                          <th />
                          <th className="text-left lg-td">Date</th>
                          <th className="text-left name-cell">Camper</th>
                          <th className="text-left">Sessions</th>
                          <th className="text-left lg-td">WIAA Information</th>
                          <th className="text-left">Total</th>
                          <th className="text-left">Status</th>
                          <th className="text-center">Menu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResults.length === 0 && (
                          <tr className="empty">
                            <td>
                              {year && year.registrations.length > 0
                                ? 'No registrations match your filter.'
                                : 'No one is currently registered for 2023.'}
                            </td>
                          </tr>
                        )}
                        {searchResults.map((r, i) => (
                          <tr key={r.id}>
                            <td>{`${i + 1}.`}</td>
                            <td className="lg-td">
                              {format(new Date(r.createdAt), 'P hh:mmaa')}
                            </td>
                            <td className="name-cell">
                              <div className="camper">
                                {r.notes.length > 0 ? (
                                  <div className="has-notes">*</div>
                                ) : null}
                                <div className="camper-name">
                                  <Link href={`/registrations/${r.id}`}>
                                    {r.firstName} {r.lastName}
                                  </Link>
                                </div>
                                <div className="camper-detail">
                                  <a
                                    href={`mailto:${r.email}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {r.email}
                                  </a>
                                </div>
                                <div className="camper-detail">
                                  {r.address.city}
                                  {r.address.city && r.address.state ? (
                                    <>{', '}</>
                                  ) : null}
                                  {r.address.state}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex-col">
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
                            <td className="lg-td">
                              <div className="flex-col">
                                <div>{r.wiaaClass}</div>
                                <div>{r.wiaaNumber}</div>
                              </div>
                            </td>
                            <td>{formatToMoney(r.total, true)}</td>
                            <td className="status">
                              {r.paymentStatus === 'paid' && (
                                <span className="paid">Paid</span>
                              )}
                              {r.paymentStatus === 'fullyRefunded' && (
                                <span className="refunded">Refunded</span>
                              )}
                              {r.paymentStatus === 'partiallyRefunded' && (
                                <span className="refunded">Refunded</span>
                              )}
                              {r.paymentStatus === 'unpaid' && (
                                <span className="unpaid">Unpaid</span>
                              )}
                            </td>
                            <td>
                              <div className="menu-container">
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleMenuButtonClick(r.id);
                                  }}
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
                                  open={r.id === activeMenuId && isOpen}
                                  setOpen={setIsOpen}
                                >
                                  <>
                                    <Link href={`/registrations/${r.id}`}>
                                      View Registration
                                    </Link>
                                    <Link
                                      href={`/registrations/update?rid=${r.id}`}
                                    >
                                      Update Registration
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
                )}
              </>
            )}
          </>
        </div>
      </HomeStyles>
      {router.query.deleteRegistrationModal && (
        <Notification
          show={showNotification}
          setShow={setShowNotification}
          heading="Successfully deleted!"
          description="The registration was successfully deleted."
        />
      )}
      {router.query.deleteGameModal && (
        <Notification
          show={showNotification}
          setShow={setShowNotification}
          heading="Successfully deleted!"
          description="The game was successfully deleted."
        />
      )}
    </Layout>
  );
}

const HomeStyles = styled.div<{ showDeleteButton: boolean }>`
  padding: 5rem 2.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    margin: 0 auto;
    max-width: 77.5rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.125rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
    text-align: center;
    letter-spacing: -0.0125em;
  }

  h3 {
    margin: 0 0 2.5rem;
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

  .table-actions-row {
    margin: 0 0 1rem;
    display: flex;
    justify-content: space-between;
  }

  .search {
    position: relative;
    width: 20rem;

    .icon {
      position: absolute;
      top: 0.625rem;
      left: 0.75rem;
      height: 1.125rem;
      width: 1.125rem;
      color: #9ca3af;
      pointer-events: none;
    }

    .delete-search-button {
      position: absolute;
      top: 0.6875rem;
      right: 0.75rem;
      height: 1rem;
      width: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      color: ${props => (props.showDeleteButton ? '#374151' : 'transparent')};
      cursor: pointer;
      pointer-events: ${props => (props.showDeleteButton ? 'auto' : 'none')};

      svg {
        flex-shrink: 0;
        height: 0.875rem;
        width: 0.875rem;
      }

      &:hover {
        color: #000;
      }
    }

    input {
      padding-left: 2.375rem;
      width: 100%;
      border-radius: 0.3125rem;
    }
  }

  .table-container {
    padding: 0.75rem;
    overflow: visible;
    background-color: #fff;
    border-radius: 0.375rem;
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

  .lg-td {
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
    margin: 1px 0 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
  }

  .camper-detail {
    font-size: 0.75rem;
    font-weight: 500;
    color: #9ca3af;
  }

  .flex-col {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    a:hover {
      text-decoration: underline;
    }
  }

  .not-attending a {
    text-decoration-color: #b91c1c;
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

    .lg-td {
      display: none;
    }
  }
`;

const RegistrationLoadingSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
