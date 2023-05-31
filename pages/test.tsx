import React from 'react';
import Layout from '../components/Layout';
import useYearQuery from '../hooks/queries/useYearQuery';
import useAuthSession from '../hooks/useAuthSession';
import { Registration } from '../types';

export default function TestPage() {
  const [discounts, setDiscounts] = React.useState<Registration[]>([]);
  const [session, sessionLoading] = useAuthSession();
  const { year } = useYearQuery();

  const handleYearQueryClick = async () => {
    const response = await fetch(`/api/temp/update-to-discounts-api`);

    if (!response.ok) {
      throw new Error('An error occurred while fetching the year.');
    }

    const data = await response.json();
    console.log(data);
  };

  React.useEffect(() => {
    if (year?.registrations) {
      const discountRegistrations: Registration[] = [];
      const discountsRegistrations: Registration[] = [];

      year.registrations.forEach(r => {
        if (r.discount) {
          discountRegistrations.push(r);
        }
        if (r.discounts) {
          discountsRegistrations.push(r);
        }
      });

      const convertedDiscountRegistrations = discountRegistrations.map(dr => {
        const { discount, ...rest } = dr;

        const convertToDiscounts =
          discount?.active === true
            ? [{ amount: discount?.amount, name: discount?.name }]
            : [];

        return {
          ...rest,
          discounts: convertToDiscounts,
        };
      });

      setDiscounts([
        ...convertedDiscountRegistrations,
        ...discountsRegistrations,
      ]);
    }
  }, [year?.registrations]);

  if (sessionLoading || !session) return <div />;

  return (
    <Layout>
      <h1>Test Page</h1>
      <button type="button" onClick={handleYearQueryClick}>
        Query for the year
      </button>
      <div>
        <div>
          <h3>Registrations with discounts array:</h3>
          <div>
            {discounts.map((r, i) => (
              <div key={r.id}>
                <p>
                  ({i + 1}) {r.id} - {r.firstName} {r.lastName}
                </p>
                <div>{JSON.stringify(r.discounts, null, 2)}</div>
                <hr />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
