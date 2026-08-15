import { useState, useEffect } from 'react';
import BookCard, { Book } from '../components/BookCard';
import { BookmarkDetails, BookActivity } from '../hooks/useBookActivity';
import ViewBookmarkModal from '../components/ViewBookmarkModal';

interface BookmarksProps {
  onBookSelect?: (book: Book) => void;
}

export default function Bookmarks({ onBookSelect }: BookmarksProps) {
  const [selectedBookKey, setSelectedBookKey] = useState<string | null>(null);
  const [groupedBookmarks, setGroupedBookmarks] = useState<Record<string, { book: Book; bookmarks: BookmarkDetails[] }>>({});

  useEffect(() => {
    const loadBookmarks = () => {
      const stored = localStorage.getItem('userActivity');
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Record<string, BookActivity>;
          const grouped = Object.values(parsed).reduce((acc, activity) => {
            if (activity.bookData && activity.bookmarks && activity.bookmarks.length > 0) {
              const key = activity.bookData.key || activity.bookData.title || 'unknown';
              acc[key] = {
                book: activity.bookData,
                bookmarks: activity.bookmarks,
              };
            }
            return acc;
          }, {} as Record<string, { book: Book; bookmarks: BookmarkDetails[] }>);
          setGroupedBookmarks(grouped);
        } catch (e) {
          console.error('Error parsing userActivity', e);
        }
      }
    };

    loadBookmarks();
    window.addEventListener('activity-updated', loadBookmarks);
    return () => window.removeEventListener('activity-updated', loadBookmarks);
  }, []);

  const groupedArray = Object.values(groupedBookmarks);
  const selectedGroup = selectedBookKey ? groupedBookmarks[selectedBookKey] : null;

  return (
    <div className="page-container">
      <div className="page-header-container">
        <h2 className="rakkas-regular page-title">
          My Bookmarks
        </h2>
      </div>

      {groupedArray.length === 0 ? (
        <div className="inter-bold empty-state-message">
          No activity yet. Start interacting with books!
        </div>
      ) : (
        <div className="book-grid results-grid">
          {groupedArray.map((group) => (
            <div key={group.book.key || group.book.title}>
              <BookCard
                book={group.book}
                badgeCount={group.bookmarks.length}
                onClick={(b) => setSelectedBookKey(b.key || b.title)}
                onOpenFic={onBookSelect}
              />
            </div>
          ))}
        </div>
      )}

      {selectedGroup && (
        <ViewBookmarkModal
          book={selectedGroup.book}
          bookmarks={selectedGroup.bookmarks}
          onClose={() => setSelectedBookKey(null)}
        />
      )}
    </div>
  );
}
