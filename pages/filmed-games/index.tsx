import React from 'react';
import styled from 'styled-components';
import useYearQuery from '../../hooks/queries/useYearQuery';
import useRegistrationsQuery from '../../hooks/queries/useRegistrationsQuery';
import Layout from '../../components/Layout';
import SendGameFilmEmails from '../../components/filmedGames/SendGameFilmEmails';
import FilmedGames from '../../components/filmedGames/FilmedGames';

export default function FilmedGamesPage() {
  const { data: registrations } = useRegistrationsQuery();
  const yearQuery = useYearQuery();

  return (
    <Layout>
      <FilmedGamePageStyles>
        <div className="container">
          {yearQuery.isLoading ? (
            'Loading...'
          ) : (
            <>
              <FilmedGames
                year={yearQuery.year}
                isSuccess={yearQuery.isSuccess}
                kaukaunaCamp={yearQuery.kaukaunaCamp}
                plymouthCamp={yearQuery.plymouthCamp}
                registrations={registrations || []}
                sessions={yearQuery.sessions || []}
              />
              <SendGameFilmEmails
                registrations={registrations || []}
                sessions={yearQuery.sessions}
                filmedGames={yearQuery.year?.filmedGames || []}
              />
            </>
          )}
        </div>
      </FilmedGamePageStyles>
    </Layout>
  );
}

const FilmedGamePageStyles = styled.div`
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
`;
