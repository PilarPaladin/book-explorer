import { useState, useEffect } from 'react';
import BookCard, { Book } from '../components/BookCard';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { getUserBookmarks } from '../services/dbService';

interface BookmarksProps {
  onBookSelect?: (book: Book) => void;
}

export default function Bookmarks({ onBookSelect }: BookmarksProps) {
  const { user } = useAuth();
  const [items, setItems] = useState<{ book: Book, count: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    if (!user) return;
    const fetchList = async () => {
      const list = await getUserBookmarks(user.id);
      setItems(list);
    };
    fetchList();
  }, [user]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [items.length, totalPages, currentPage]);

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h2 className="rakkas-regular page-title">
          My Bookmarks
          {items.length > 0 && (
            <p className="inter-regular readlist-count-text">
              You have bookmarked {items.length} fic{items.length === 1 ? '' : 's'}
            </p>
          )}
        </h2>
      </div>

      {items.length === 0 ? (
        <div className="inter-bold empty-state-message">
          No bookmarks yet.
        </div>
      ) : (
        <>
          <div className="book-grid results-grid">
            {currentItems.map((item, index) => (
              <div key={item.book.key || index}>
                <BookCard book={item.book} onClick={(b) => onBookSelect?.(b)} badgeCount={item.count} />
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
