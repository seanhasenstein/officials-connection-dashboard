import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  formatPhoneNumber,
  formatSessionName,
  formatToMoney,
  getUrlParam,
} from '../../utils/misc';
import useRegistrationQuery from '../../hooks/queries/useRegistrationQuery';
import useDeleteRegistration from '../../hooks/mutations/useDeleteRegistration';
import useUpdateRegistrationNotes from '../../hooks/mutations/useUpdateRegistrationNotes';
import useAuthSession from '../../hooks/useAuthSession';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import Notes from '../../components/Notes';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteModal from '../../components/DeleteModal';

export default function Registration() {
  const [session, sessionLoading] = useAuthSession();
  const router = useRouter();
  const {
    isLoading,
    error,
    data: registration,
  } = useRegistrationQuery(getUrlParam(router.query.rid));
  const deleteRegistration = useDeleteRegistration();
  const notesMutation = useUpdateRegistrationNotes();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteMenuClick = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const deleteCallback = () =>
    deleteRegistration.mutate(`${registration?._id}`, {
      onSuccess: () => router.push('/?deleteRegistrationModal=true', '/'),
    });

  if (sessionLoading || !session) return <div />;

  return (
    <Layout
      title={
        isLoading
          ? 'Loading...'
          : `${registration?.firstName} ${registration?.lastName}`
      }
    >
      <RegistrationStyles>
        <div className="container">
          {isLoading && <RegistrationSpinner isLoading={isLoading} />}
          {error instanceof Error && <div>Error: {error.message}</div>}
          {registration && (
            <div className="box">
              <div className="header">
                <div className="row">
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="name">
                      {registration.firstName} {registration.lastName}
                    </p>
                    <div className="column">
                      <p className="details">
                        Registration <span>#{registration.registrationId}</span>
                      </p>
                      <p className="details">
                        {format(
                          new Date(registration.createdAt),
                          "LLLL dd, yyyy 'at' h:mmaaa"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="menu">
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(prevState => !prevState)}
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
                  <Menu open={isMenuOpen} setOpen={setIsMenuOpen}>
                    <Link
                      href={`/registrations/update?rid=${registration._id}`}
                    >
                      <a>Update Registration</a>
                    </Link>
                    <button type="button" onClick={handleDeleteMenuClick}>
                      Delete Registration
                    </button>
                  </Menu>
                </div>
              </div>
              <div className="body">
                <div>
                  <div className="first-column">
                    <div className="vertical-item">
                      <h3>Session{registration.sessions.length > 1 && 's'}</h3>
                      <div className="list">
                        {registration.sessions.map(s => (
                          <p
                            key={s.sessionId}
                            className={
                              s.attending ? 'attending' : 'not-attending'
                            }
                          >
                            <Link
                              href={`/registrations/session?sid=${s.sessionId}`}
                            >
                              {formatSessionName(s)}
                            </Link>
                          </p>
                        ))}
                      </div>
                    </div>
                    <div className="vertical-item">
                      <h3>Crew Members</h3>
                      <div className="list">
                        {registration.crewMembers &&
                        registration.crewMembers.length > 0 ? (
                          registration.crewMembers?.map((m, i) => (
                            <p key={`${i}`}>{m}</p>
                          ))
                        ) : (
                          <p>None</p>
                        )}
                      </div>
                    </div>
                    {registration.wiaaClass && (
                      <div className="vertical-item">
                        <h3>WIAA Class</h3>
                        <p>{registration.wiaaClass}</p>
                      </div>
                    )}
                    {registration.wiaaNumber && (
                      <div className="vertical-item">
                        <h3>WIAA Number</h3>
                        <p>{registration.wiaaNumber}</p>
                      </div>
                    )}
                    {registration.associations && (
                      <div className="vertical-item">
                        <h3>Associations</h3>
                        <p>{registration.associations}</p>
                      </div>
                    )}
                    <div className="vertical-item">
                      <h3>Email</h3>
                      <p>
                        <a href={`mailto:${registration.email}`}>
                          {registration.email}
                        </a>
                      </p>
                    </div>
                    <div className="vertical-item">
                      <h3>Phone</h3>
                      <p>{formatPhoneNumber(registration.phone)}</p>
                    </div>
                    <div className="vertical-item">
                      <h3>Address</h3>
                      <p>
                        {registration.address.street} <br />
                        {registration.address.street2 && (
                          <>
                            {registration.address.street2} <br />
                          </>
                        )}
                        {registration.address.city}
                        {registration.address.city &&
                          registration.address.state &&
                          ','}{' '}
                        {registration.address.state}{' '}
                        {registration.address.zipcode}
                      </p>
                    </div>
                    <div className="vertical-item">
                      <h3>Food Allergies</h3>
                      <p>
                        {registration.foodAllergies
                          ? registration.foodAllergies
                          : 'None provided'}{' '}
                      </p>
                    </div>
                    <div className="vertical-item">
                      <h3>Emergency Contact</h3>
                      <p>
                        {registration.emergencyContact.name ? (
                          <>
                            {registration.emergencyContact.name} <br />
                            {formatPhoneNumber(
                              registration.emergencyContact.phone
                            )}
                          </>
                        ) : (
                          'None provided'
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="third-column">
                  <div className="payment-section">
                    <div className="horizontal-item">
                      <h3>Status</h3>
                      <p>
                        {registration.paymentStatus === 'paid' && (
                          <span className="paid">Paid</span>
                        )}
                        {registration.paymentStatus === 'fullyRefunded' && (
                          <span className="refunded">Full refund</span>
                        )}
                        {registration.paymentStatus === 'partiallyRefunded' && (
                          <span className="refunded">Partial refund</span>
                        )}
                        {registration.paymentStatus === 'unpaid' && (
                          <span className="unpaid">Needs to pay</span>
                        )}
                      </p>
                    </div>
                    <div className="horizontal-item">
                      <h3>Method:</h3>
                      <p className="capitalize">{registration.paymentMethod}</p>
                    </div>
                    {registration.paymentMethod === 'check' && (
                      <div className="horizontal-item">
                        <h3>Check #</h3>
                        <p>{registration.checkNumber}</p>
                      </div>
                    )}
                    {registration.paymentMethod === 'card' && (
                      <div className="horizontal-item">
                        <h3>Stripe Id</h3>
                        <p>
                          <a
                            href={`https://dashboard.stripe.com/payments/${registration.stripeId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {registration.stripeId}
                          </a>
                        </p>
                      </div>
                    )}
                    <div className="horizontal-item">
                      <h3>Subtotal:</h3>
                      <p>{formatToMoney(registration.subtotal, true)}</p>
                    </div>
                    {registration.refundAmount > 0 && (
                      <div className="horizontal-item">
                        <h3>Refund Amount</h3>
                        <p>{formatToMoney(registration.refundAmount, true)}</p>
                      </div>
                    )}
                    <div className="horizontal-item">
                      <h3>Discount:</h3>
                      <p>{formatToMoney(registration.discount.amount, true)}</p>
                    </div>
                    {registration.discount.active && (
                      <div className="horizontal-item">
                        <h3>Discount:</h3>
                        <p>{registration.discount.name}</p>
                      </div>
                    )}
                    <div className="horizontal-item total">
                      <h3>Total:</h3>
                      <p>{formatToMoney(registration.total, true)}</p>
                    </div>
                  </div>
                  <div className="notes-section">
                    <Notes
                      notes={registration.notes}
                      document={registration}
                      addNotesMutation={updatedNotes => {
                        notesMutation.mutate({ registration, updatedNotes });
                      }}
                      deleteNotesMutation={updatedNotes => {
                        notesMutation.mutate({ registration, updatedNotes });
                      }}
                      isLoading={notesMutation.isLoading}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {registration?._id && (
          <DeleteModal
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            callback={deleteCallback}
            isLoading={deleteRegistration.isLoading}
            category="registration"
          />
        )}
      </RegistrationStyles>
    </Layout>
  );
}

const RegistrationStyles = styled.div`
  padding: 2.5rem;
  background-color: #f3f4f6;
  min-height: 100vh;

  .container {
    margin: 0 auto;
    max-width: 80rem;
    width: 100%;
  }

  .box {
    position: relative;
    padding: 2rem 3.5rem 3rem;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  }

  .body {
    margin: 1.5rem 0 0;
    display: grid;
    grid-template-columns: 1fr 31rem;
    justify-content: space-between;
  }

  .first-column {
    display: grid;
    grid-template-columns: 1fr 0.875fr;
  }

  .third-column {
    padding-left: 2.5rem;
    border-left: 1px solid #e5e7eb;
  }

  .header {
    padding: 0 0 1.5rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e5e7eb;

    .row {
      display: flex;
    }

    .column {
      margin: 0.125rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .icon {
      margin: 0 0.5rem 0 0;
      height: 4.5rem;
      width: 4.5rem;
      color: #e5e7eb;
    }

    p {
      margin: 0;

      &.name {
        font-size: 1.5rem;
        font-weight: 700;
      }

      &.details {
        font-size: 0.9375rem;
        font-weight: 500;
        color: #7f8694;

        span {
          color: #111827;
        }
      }
    }
  }

  .vertical-item {
    padding: 1.125rem 0;

    h3 {
      margin: 0 0 0.25rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #6b7280;
    }

    p {
      margin: 0;
      font-size: 0.9375rem;
      font-weight: 400;
      color: #111827;
      line-height: 1.35;

      &.not-attending {
        text-decoration: line-through;
        color: #991b1b;
      }

      a {
        &:hover {
          text-decoration: underline;
        }

        &:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          text-decoration: underline;
          color: #1d4ed8;
        }
      }
    }
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

  .capitalize {
    text-transform: capitalize;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .payment-section {
    padding: 0.5rem 1rem 2rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .horizontal-item {
    padding: 0.3125rem 0;
    display: flex;
    align-items: center;

    &.total {
      h3 {
        color: #111827;
        font-weight: 600;
      }

      p {
        font-weight: 600;
        color: #059669;
      }
    }

    h3,
    p {
      margin: 0;
      font-size: 0.9375rem;
    }

    h3 {
      width: 9rem;
      font-weight: 500;
      color: #6b7280;
    }

    p {
      color: #111827;

      a {
        &:hover {
          text-decoration: underline;
        }

        &:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          text-decoration: underline;
          color: #1d4ed8;
        }
      }
    }
  }

  .notes-section {
    padding: 2rem 1rem 0;
    position: relative;
  }

  .menu {
    position: relative;

    .menu-button {
      margin: 0;
      padding: 0.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: #9ca3af;
      border-radius: 9999px;

      svg {
        height: 1.25rem;
        width: 1.25rem;
      }

      &:hover {
        color: #111827;
      }
    }
  }

  @media (max-width: 1200px) {
    .first-column {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 1024px) {
    .body {
      grid-template-columns: 1fr;
    }

    .first-column {
      grid-template-columns: 1fr 0.5fr;
    }

    .third-column {
      padding-left: 0;
      border-left: none;
    }

    .payment-section,
    .notes-section {
      padding-left: 0;
      padding-right: 0;
    }

    .payment-section {
      margin-top: 1.5rem;
      padding-bottom: 3.5rem;
    }

    .notes-section {
      margin-top: 0.5rem;
    }
  }

  @media (min-width: 1520px) {
    padding: 5rem 2.5rem;
  }
`;

const RegistrationSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
