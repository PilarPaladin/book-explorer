import { useState, useEffect } from 'react';
import BookCard, { Book } from '../components/BookCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { getUserReadlist } from '../services/dbService';

interface ReadlistProps {
  onBookSelect?: (book: Book) => void;
}

export default function Readlist({ onBookSelect }: ReadlistProps) {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    if (!user) return;
    const fetchList = async () => {
      const list = await getUserReadlist(user.id);
      setBooks(list);
    };
    fetchList();
  }, [user]);

  const totalPages = Math.ceil(books.length / itemsPerPage);
  const currentBooks = books.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
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
              You want to read {books.length} fic{books.length === 1 ? '' : 's'}
            </p>
          )}
        </h2>
      </div>

      {books.length === 0 ? (
        <div className="inter-bold empty-state-message">
          No activity yet. Start adding fics to your readlist!
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
