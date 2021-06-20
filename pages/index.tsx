import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import Layout from '../components/Layout';
import { Registration } from '../interfaces';
import { formatDate } from '../utils';

const HomeStyles = styled.div`
  padding: 5rem 1.5rem;
  background-color: #f3f4f6;

  .wrapper {
    margin: 0 auto;
    max-width: 70rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 3.5rem;
    text-align: center;
  }

  .table-wrapper {
    overflow: hidden;
    border-radius: 0.5rem;
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
  }

  th {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tbody {
    background-color: #fff;
    border-top: 1px solid rgb(229, 231, 235);
  }

  td {
    padding: 0.875rem 1.5rem;
    white-space: nowrap;
    font-size: 0.875rem;
    border-bottom: 1px solid rgb(229, 231, 235);
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
      margin: 0 0.5rem 0 0;
      height: 0.875rem;
      width: 0.875rem;
      border-radius: 9999px;
    }

    .attending {
      background-color: #34d399;
      border: 3px solid #d1fae5;
    }

    .not-attending {
      background-color: #f87171;
      border: 3px solid #fee2e2;
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
    font-size: 0.75rem;
    font-weight: 500;
    line-height: 1.25rem;
    border-radius: 9999px;
  }

  .paid {
    background-color: #dcfce7;
    color: #166534;
  }

  .refunded {
    background-color: #ffedd5;
    color: #9a3412;
  }

  .unpaid {
    background-color: #ffe4e6;
    color: #9f1239;
  }

  .links span {
    margin: 0 0.25rem;
    color: #9ca3af;
  }

  .links a:hover {
    text-decoration: underline;
  }
`;

export default function Home() {
  const { isLoading, isError, data, error } = useQuery(
    'registrations',
    async () => {
      const response = await fetch('/api/get-registrations');

      if (!response.ok) {
        throw new Error('Failed to fetch!');
      }

      return await response.json();
    }
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError && error instanceof Error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Layout>
      <HomeStyles>
        <div className="wrapper">
          <h2>2021 WBYOC - Master List</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Name</th>
                  <th>Sessions</th>
                  {/* <th>Contact</th> */}
                  <th className="status">Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.registrations.map((r: Registration) => (
                  <tr key={r._id}>
                    <td className="date">{formatDate(`${r.createdAt}`)}</td>
                    <td className="name">
                      {r.firstName} {r.lastName}
                    </td>
                    <td>
                      <div className="sessions">
                        {r.sessions.map(s => (
                          <div key={s.id}>
                            <span
                              className={
                                s.attending ? 'attending' : 'not-attending'
                              }
                            />
                            {s.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    {/* <td>
                      <div className="contact">
                        <div className="email">
                          <a href={`mailto:${r.email}`}>{r.email}</a>
                        </div>
                        <div>{formatPhoneNumber(r.phone)}</div>
                      </div>
                    </td> */}
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
                        <a>View</a>
                      </Link>
                      <span>|</span>
                      <Link href={`/registration/edit?id=${r._id}`}>
                        <a>Edit</a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </HomeStyles>
    </Layout>
  );
}
