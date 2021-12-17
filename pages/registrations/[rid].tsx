import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import {
  formatPhoneNumber,
  formatSessionName,
  formatToMoney,
} from '../../utils';
import useRegistration from '../../hooks/useRegistration';
import useSession from '../../hooks/useSessions';
import Layout from '../../components/Layout';
import Menu from '../../components/Menu';
import NotesSection from '../../components/NoteSection';
import LoadingSpinner from '../../components/LoadingSpinner';
import DeleteModal from '../../components/DeleteModal';

export default function Registration() {
  const [session, sessionLoading] = useSession();
  const router = useRouter();
  const { registrationQuery: rq, deleteRegistration } = useRegistration();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const handleDeleteMenuClick = () => {
    setIsMenuOpen(false);
    setShowDeleteModal(true);
  };

  const deleteCallback = () =>
    deleteRegistration.mutate(`${rq.data?._id}`, {
      onSuccess: () => router.push('/?deleteRegistrationModal=true', '/'),
    });

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <RegistrationStyles>
        <div className="container">
          {rq.isLoading && <RegistrationSpinner isLoading={rq.isLoading} />}
          {rq.isError && rq.error instanceof Error && (
            <div>Error: {rq.error.message}</div>
          )}
          {rq.data && (
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
                      {rq.data.firstName} {rq.data.lastName}
                    </p>
                    <div className="column">
                      <p className="details">
                        Registration <span>#{rq.data.registrationId}</span>
                      </p>
                      <p className="details">
                        {format(
                          new Date(rq.data.createdAt),
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
                  <RegistrationMenu open={isMenuOpen} setOpen={setIsMenuOpen}>
                    <Link href={`/registrations/update?rid=${rq.data._id}`}>
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
                    <button
                      type="button"
                      className="delete-button"
                      onClick={handleDeleteMenuClick}
                    >
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete Registration
                    </button>
                  </RegistrationMenu>
                </div>
              </div>
              <div className="body">
                <div>
                  <div className="vertical-item">
                    <h3>Email</h3>
                    <p>
                      <a href={`mailto:${rq.data.email}`}>{rq.data.email}</a>
                    </p>
                  </div>
                  <div className="vertical-item">
                    <h3>Phone</h3>
                    <p>{formatPhoneNumber(rq.data.phone)}</p>
                  </div>
                  <div className="vertical-item">
                    <h3>Address</h3>
                    <p>
                      {rq.data.address.street} <br />
                      {rq.data.address.street2 && (
                        <>
                          Apt. {rq.data.address.street2} <br />
                        </>
                      )}
                      {rq.data.address.city}
                      {rq.data.address.city &&
                        rq.data.address.state &&
                        ','}{' '}
                      {rq.data.address.state} {rq.data.address.zipcode}
                    </p>
                  </div>
                  <div className="vertical-item">
                    <h3>Food Allergies</h3>
                    <p>
                      {rq.data.foodAllergies
                        ? rq.data.foodAllergies
                        : 'None provided'}{' '}
                    </p>
                  </div>
                  <div className="vertical-item">
                    <h3>Emergency Contact</h3>
                    <p>
                      {rq.data.emergencyContact.name ? (
                        <>
                          {rq.data.emergencyContact.name} <br />
                          {formatPhoneNumber(rq.data.emergencyContact.phone)}
                        </>
                      ) : (
                        'None provided'
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <div className="vertical-item">
                    <h3>Session{rq.data.sessions.length > 1 && 's'}</h3>
                    <div className="list">
                      {rq.data.sessions.map(s => (
                        <p
                          key={s.id}
                          className={
                            s.attending ? 'attending' : 'not-attending'
                          }
                        >
                          <Link href={`/registrations/session?sid=${s.id}`}>
                            {formatSessionName(s)}
                          </Link>
                        </p>
                      ))}
                    </div>
                  </div>
                  <div className="vertical-item">
                    <h3>Crew Members</h3>
                    <div className="list">
                      {rq.data.crewMembers.length > 0 ? (
                        rq.data.crewMembers?.map(m => <p key={m}>{m}</p>)
                      ) : (
                        <p>None</p>
                      )}
                    </div>
                  </div>
                  {rq.data.wiaaClass && (
                    <div className="vertical-item">
                      <h3>WIAA Class</h3>
                      <p>{rq.data.wiaaClass}</p>
                    </div>
                  )}
                  {rq.data.wiaaNumber && (
                    <div className="vertical-item">
                      <h3>WIAA Number</h3>
                      <p>{rq.data.wiaaNumber}</p>
                    </div>
                  )}
                  {rq.data.associations && (
                    <div className="vertical-item">
                      <h3>Associations</h3>
                      <p>{rq.data.associations}</p>
                    </div>
                  )}
                </div>
                <div className="third-column">
                  <div className="payment-section">
                    <div className="horizontal-item">
                      <h3>Status</h3>
                      <p>
                        {rq.data.paymentStatus === 'paid' && (
                          <span className="paid">Paid</span>
                        )}
                        {rq.data.paymentStatus === 'fullyRefunded' && (
                          <span className="refunded">Full refund</span>
                        )}
                        {rq.data.paymentStatus === 'partiallyRefunded' && (
                          <span className="refunded">Partial refund</span>
                        )}
                        {rq.data.paymentStatus === 'unpaid' && (
                          <span className="unpaid">Needs to pay</span>
                        )}
                      </p>
                    </div>
                    <div className="horizontal-item">
                      <h3>Method:</h3>
                      <p className="capitalize">{rq.data.paymentMethod}</p>
                    </div>
                    {rq.data.paymentMethod === 'check' && (
                      <div className="horizontal-item">
                        <h3>Check #</h3>
                        <p>{rq.data.checkNumber}</p>
                      </div>
                    )}
                    {rq.data.refundAmount > 0 && (
                      <div className="horizontal-item">
                        <h3>Refund Amount</h3>
                        <p>{formatToMoney(rq.data.refundAmount, true)}</p>
                      </div>
                    )}
                    {rq.data.paymentMethod === 'card' && (
                      <div className="horizontal-item">
                        <h3>Stripe Id</h3>
                        <p>
                          <a
                            href={`https://dashboard.stripe.com/payments/${rq.data.stripeId}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {rq.data.stripeId}
                          </a>
                        </p>
                      </div>
                    )}
                    <div className="horizontal-item">
                      <h3>Subtotal:</h3>
                      <p>{formatToMoney(rq.data.subtotal, true)}</p>
                    </div>
                    <div className="horizontal-item">
                      <h3>Discount:</h3>
                      <p>{rq.data.discount ? '$10.00' : '$0.00'}</p>
                    </div>
                    <div className="horizontal-item total">
                      <h3>Total:</h3>
                      <p>
                        {formatToMoney(
                          rq.data.total - rq.data.refundAmount,
                          true
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="notes-section">
                    <NotesSection id={rq.data._id} notes={rq.data.notes} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {rq.data?._id && (
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
    grid-template-columns: 1fr 1fr 31rem;
    justify-content: space-between;
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
        }
      }
    }
  }

  .paid,
  .refunded,
  .unpaid {
    margin: 0.375rem 0 0;
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
        color: #10b981;
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

      a:hover {
        text-decoration: underline;
      }
    }
  }

  .notes-section {
    padding: 2rem 1rem 0;
    position: relative;
  }

  .menu {
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

  @media (min-width: 1520px) {
    padding: 5rem 2.5rem;
  }
`;

const RegistrationMenu = styled(Menu)`
  top: 4.25rem;
  right: 3.5rem;

  .delete-button:hover,
  .delete-button:hover svg {
    color: #b91c1c;
    text-decoration: underline;
  }
`;

const RegistrationSpinner = styled(LoadingSpinner)`
  display: flex;
  justify-content: center;
`;
