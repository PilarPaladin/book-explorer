import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import BookGrid from './components/BookGrid';
import BookModal from './components/BookModal';
import { searchBooks, getPopularBooks } from './services/api';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTitle, setSearchTitle] = useState('Popular Right Now');

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        setLoading(true);
        const popular = await getPopularBooks();
        setBooks(popular);
        setError(null);
      } catch (err) {
        setError('Failed to load initial books. Please try searching.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const handleSearch = async (query) => {
    try {
      setIsSearching(true);
      setLoading(true);
      setError(null);
      setSearchTitle(`Search Results for "${query}"`);
      const results = await searchBooks(query);
      setBooks(results);
    } catch (err) {
      setError('An error occurred while searching. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-8">
        {/* Letterboxd Profile-like Header Section */}
        <div className="flex flex-col md:flex-row items-end border-b border-gray-300 pb-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-2xl border-2 border-ao3-red">
              👤
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Guest User <span className="text-xs bg-ao3-red text-white px-1 py-0.5 rounded ml-2 align-middle">PRO</span></h2>
            </div>
          </div>
          <div className="ml-auto flex gap-6 text-center mt-4 md:mt-0 text-sm">
            <div><span className="block font-bold text-xl text-gray-800">0</span> <span className="text-gray-500 uppercase tracking-wide">Books</span></div>
            <div><span className="block font-bold text-xl text-gray-800">0</span> <span className="text-gray-500 uppercase tracking-wide">Lists</span></div>
          </div>
        </div>

        <SearchBar onSearch={handleSearch} />

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ao3-red"></div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded mb-8 text-center">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <span className="text-4xl block mb-4">📭</span>
            <p className="text-xl">No books found.</p>
            <p className="text-sm mt-2">Try adjusting your search terms.</p>
          </div>
        )}

        {/* Results State */}
        {!loading && !error && books.length > 0 && (
          <BookGrid books={books} onBookClick={setSelectedBook} title={searchTitle} />
        )}
      </main>

      <footer className="bg-gray-100 py-6 border-t border-gray-200 mt-auto text-center text-sm text-gray-600">
        <p>myArkived — A book discovery app blending AO3 aesthetics with Letterboxd layout.</p>
        <p className="mt-1">Powered by Open Library API.</p>
      </footer>

      <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
    </div>
  );
}

export default App;
