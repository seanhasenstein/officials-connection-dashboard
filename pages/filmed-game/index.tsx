import { GetServerSideProps } from 'next';
import { connectToDb, film } from '../../db';
import { FilmedGame as FilmedGameInterface } from '../../interfaces';
import Layout from '../../components/Layout';

type Props = {
  game: FilmedGameInterface;
  error: string;
};

export default function FilmedGame({ game, error }: Props) {
  if (error) {
    <Layout>
      <p>Error: {error}</p>
    </Layout>;
  }

  return (
    <Layout>
      <pre>{JSON.stringify(game, null, 2)}</pre>
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
    const response = await film.getFilmedGame(db, { _id: context.query.id });

    return {
      props: {
        game: { ...response },
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
