import { useState, useEffect } from 'react';
import BookCard, { Book } from '../components/BookCard';
import Pagination from '../components/Pagination';

interface ReadlistProps {
  onBookSelect?: (book: Book) => void;
}

export default function Readlist({ onBookSelect }: ReadlistProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    const loadReadlist = () => {
      const stored = localStorage.getItem('userActivity');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          const readlistBooks = Object.values(parsed)
            .filter((activity: any) => activity.inReadlist && activity.bookData)
            .map((activity: any) => activity.bookData);

          // Reverse so newest additions appear first
          setBooks(readlistBooks.reverse());
        } catch (e) {
          console.error('Error parsing userActivity', e);
        }
      }
    };

    loadReadlist();
    window.addEventListener('activity-updated', loadReadlist);
    return () => window.removeEventListener('activity-updated', loadReadlist);
  }, []);

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const currentBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    // Reset to page 1 if the number of items drastically changes and we are out of bounds
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [books.length, totalPages, currentPage]);

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h2 className="rakkas-regular page-title">
          My Readlist
          {books.length > 0 && (
            <p className="inter-regular readlist-count-text">
              You want to read {books.length} book{books.length === 1 ? '' : 's'}
            </p>
          )}
        </h2>
      </div>



      {books.length === 0 ? (
        <div className="inter-bold empty-state-message">
          No activity yet. Start interacting with books!
        </div>
      ) : (
        <>
          <div className="book-grid results-grid">
            {currentBooks.map((book, index) => (
              <div key={book.key || index}>
                <BookCard book={book} onClick={(b) => onBookSelect?.(b)} />
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
