import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Game } from '../../interfaces';
import Layout from '../../components/Layout';

const FilmedGameScheduleStyles = styled.div`
  padding: 0 1.5rem;
  width: 100%;

  .wrapper {
    padding: 3rem 0;
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1rem;
    color: #111827;
  }

  h3 {
    margin: 0 0 1.25rem;
    font-size: 1.125rem;
    color: #1f2937;
  }

  h4 {
    margin: 2rem 0 1.25rem;
    font-size: 0.875rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    color: #1f2937;
  }

  p {
    margin: 0 0 2.5rem;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .section {
    margin: 0 0 4rem;
  }

  .grid-col-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 1rem;
  }

  .item {
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
  }

  .checkbox-item {
    margin: 0 0 0.75rem;

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  .radio-group {
    margin: 0 0 3.5rem;
  }

  .radio-item {
    margin: 0 0 0.75rem;

    label {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      line-height: 1;
    }

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  label {
    margin: 0 0 0.375rem;
  }
`;

export default function FilmedGameSchedule() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    async (game: Game) => {
      const response = await fetch(`/api/games/add`, {
        method: 'POST',
        body: JSON.stringify(game),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to add the game.');
      }

      const data = await response.json();
      return data;
    },
    {
      onSuccess: data => {
        queryClient.invalidateQueries(['games', data.game.camp]);
        router.push(`/games/${data.game._id}`);
      },
    }
  );

  return (
    <Layout>
      <FilmedGameScheduleStyles>
        <div className="wrapper">
          <h2>Add a game to the film schedule</h2>
          <p>
            This game will be available when adding games to the campers game
            film schedule.
          </p>
          <Formik
            initialValues={{
              camp: 'kaukauna',
              session: 'hs',
              day: 'friday',
              name: '',
              abbreviation: '',
              url: '',
            }}
            onSubmit={async values => {
              await mutation.mutate(values);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="radio-group">
                  <h4>Select camp</h4>
                  <div className="radio-item">
                    <label htmlFor="kaukauna">
                      <Field
                        type="radio"
                        name="camp"
                        id="kaukauna"
                        value="kaukauna"
                      />
                      Kaukauna
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="plymouth">
                      <Field
                        type="radio"
                        name="camp"
                        id="plymouth"
                        value="plymouth"
                      />
                      Plymouth
                    </label>
                  </div>
                </div>
                <div className="radio-group">
                  <h4>Select session</h4>
                  <div className="radio-item">
                    <label htmlFor="hs">
                      <Field type="radio" name="session" id="hs" value="hs" />
                      High School
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="wc">
                      <Field type="radio" name="session" id="wc" value="wc" />
                      Women&apos;s College
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="mc">
                      <Field type="radio" name="session" id="mc" value="mc" />
                      Men&apos;s College
                    </label>
                  </div>
                </div>
                <div className="radio-group">
                  <h4>Select day</h4>
                  <div className="radio-item">
                    <label htmlFor="friday">
                      <Field
                        type="radio"
                        name="day"
                        id="friday"
                        value="friday"
                      />
                      Friday
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="saturday">
                      <Field
                        type="radio"
                        name="day"
                        id="saturday"
                        value="saturday"
                      />
                      Saturday
                    </label>
                  </div>
                  <div className="radio-item">
                    <label htmlFor="sunday">
                      <Field
                        type="radio"
                        name="day"
                        id="sunday"
                        value="sunday"
                      />
                      Sunday
                    </label>
                  </div>
                </div>
                <div className="item">
                  <label htmlFor="name">Game Title</label>
                  <Field
                    name="name"
                    id="name"
                    placeholder="e.g. Kaukauna Friday Session - Main Court @ 12pm"
                  />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="validation-error"
                  />
                </div>
                <div className="item">
                  <label htmlFor="abbreviation">Game Abbreviation</label>
                  <Field
                    name="abbreviation"
                    id="abbreviation"
                    placeholder="e.g. Fri MC @ 12pm"
                  />
                  <ErrorMessage
                    name="abbreviation"
                    component="div"
                    className="validation-error"
                  />
                </div>
                <div className="item">
                  <label htmlFor="url">YouTube URL</label>
                  <Field name="url" id="url" />
                </div>
                <button type="submit">
                  {isSubmitting ? 'Loading...' : 'Add Game'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </FilmedGameScheduleStyles>
    </Layout>
  );
}