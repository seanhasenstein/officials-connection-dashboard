import React from 'react';
import { Registration } from '../interfaces';

export default function useRegistrationSearch(registrations: Registration[]) {
  const [search, setSearch] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Registration[]>();

  React.useEffect(() => {
    if (search.length > 2) {
      const filteredResults = registrations?.filter(r => {
        const name = `${r.firstName} ${r.lastName}`;
        return name.toLowerCase().includes(search.toLowerCase());
      });
      setSearchResults(filteredResults || []);
    } else {
      setSearchResults(registrations || []);
    }
  }, [search, registrations]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return {
    search,
    setSearch,
    searchResults,
    handleSearchChange,
  };
}
