import { useState, useEffect } from 'react';
import BookCard, { Book } from '../components/BookCard';

interface ReadlistProps {
  onBookSelect?: (book: Book) => void;
}

export default function Readlist({ onBookSelect }: ReadlistProps) {
  const [books, setBooks] = useState<Book[]>([]);

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

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h2 className="rakkas-regular page-title">
          My Readlist
        </h2>
      </div>

      {books.length > 0 && (
        <p className="inter-regular readlist-count-text">
          You want to read {books.length} book{books.length === 1 ? '' : 's'}
        </p>
      )}

      {books.length === 0 ? (
        <div className="inter-bold empty-state-message">
          No activity yet. Start interacting with books!
        </div>
      ) : (
        <div className="book-grid results-grid">
          {books.map((book, index) => (
            <div key={book.key || index}>
              <BookCard book={book} onClick={(b) => onBookSelect?.(b)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
