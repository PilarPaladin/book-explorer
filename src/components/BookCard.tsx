import { useBookActivity } from '../hooks/useBookActivity';
import BookRibbon from './BookRibbon';

export interface Book {
  cover_i?: number;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  key?: string;
  [key: string]: any;
}

interface BookCardProps {
  book: Book;
  onClick?: (book: Book) => void;
  onOpenFic?: (book: Book) => void;
  badgeCount?: number;
}

export default function BookCard({ book, onClick, onOpenFic, badgeCount }: BookCardProps) {
  const { activity, updateActivity } = useBookActivity(book);
  const { isRead, inReadlist } = activity;

  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/tempCover.png';

  return (
    <div className="book-card" onClick={onClick ? () => onClick(book) : undefined} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div className="book-cover-container">
        {badgeCount && badgeCount > 0 && (
          <div className="bookmark-badge-count">{badgeCount}</div>
        )}
        <img
          src={coverUrl}
          alt={book.title}
          className="book-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }}
        />

        <BookRibbon
          book={book}
          isRead={!!isRead}
          isStarted={!!activity.startedOnDate}
          inReadlist={!!inReadlist}
          onToggleRead={() => updateActivity({ isRead: !isRead })}
          onToggleReadlist={() => updateActivity({ inReadlist: !inReadlist })}
          onOptionsClick={() => {
            if (onOpenFic) onOpenFic(book);
            else onClick?.(book);
          }}
        />
      </div>
      <div className="book-info">
        <h3 className="book-title inter-bold">{book.title}</h3>
        {book.author_name && book.author_name.length > 0 && (
          <p className="book-author inter-regular">{book.author_name.join(', ')}</p>
        )}
        {book.first_publish_year && (
          <p className="book-year inter-regular">{book.first_publish_year}</p>
        )}
      </div>
    </div>
  );
}
