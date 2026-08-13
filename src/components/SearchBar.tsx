import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-2 mb-8">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for books by title, author..."
        className="flex-grow w-full md:w-auto px-4 py-2 border border-ao3-border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-ao3-red focus:border-transparent text-ao3-text bg-white"
      />
      <button
        type="submit"
        className="w-full md:w-auto px-6 py-2 bg-gray-200 hover:bg-gray-300 text-ao3-text font-semibold rounded border border-gray-400 shadow-sm transition-colors"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar;
