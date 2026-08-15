
import { EyeIcon, EllipsisHorizontalIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid';
import { useBookActivity } from '../hooks/useBookActivity';

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
  onClick: (book: Book) => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  const { activity, updateActivity } = useBookActivity(book);
  const { isRead, inReadlist } = activity;

  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/tempCover.png';

  return (
    <div className="book-card" onClick={() => onClick(book)} style={{ cursor: 'pointer' }}>
      <div className="book-cover-container">
        <img
          src={coverUrl}
          alt={book.title}
          className="book-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/tempCover.png'; }}
        />

        <div className="book-ribbon" onClick={(e) => e.stopPropagation()}>
          <span className="action-icon dark-icon" title="More options" onClick={() => onClick(book)} style={{ marginBottom: '-7px' }} >
            <EllipsisHorizontalIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />
          </span>
          <span
            className="action-icon dark-icon eye"
            title="Toggle read"
            onClick={() => updateActivity({ isRead: !isRead })}
            style={{ color: isRead ? '#3a9d46' : undefined }}
          >
            {isRead ? <EyeSolid style={{ width: '20px', height: '20px' }} /> : <EyeIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />}
          </span>
          <span
            className="action-icon dark-icon readlist"
            title="Readlist"
            onClick={() => updateActivity({ inReadlist: !inReadlist })}
            style={{ color: inReadlist ? '#3f7dbe' : undefined }}
          >
            {inReadlist ? <ClockSolid style={{ width: '20px', height: '20px' }} /> : <ClockIcon style={{ width: '20px', height: '20px' }} strokeWidth={2} />}
          </span>
        </div>
      </div>
    </div>
  );
}
