import React, { useState } from 'react';
import { EyeIcon, HeartIcon, BookmarkIcon, EllipsisHorizontalIcon, ClockIcon } from '@heroicons/react/24/outline';
import { EyeIcon as EyeSolid, HeartIcon as HeartSolid, BookmarkIcon as BookmarkSolid, ClockIcon as ClockSolid } from '@heroicons/react/24/solid';

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
  const [isRead, setIsRead] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [inReadlist, setInReadlist] = useState(false);

  // Open Library API returns cover_i, title, author_name, first_publish_year
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : '/tempCover.png';

  const author = book.author_name ? `by ${book.author_name[0]}` : 'Unknown Author';

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
            <EllipsisHorizontalIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />
          </span>
          <span
            className="action-icon dark-icon eye"
            title="Toggle read"
            onClick={() => setIsRead(!isRead)}
            style={{ color: isRead ? '#3a9d46' : undefined }}
          >
            {isRead ? <EyeSolid style={{ width: '28px', height: '28px' }} /> : <EyeIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
          <span
            className="action-icon dark-icon heart"
            title="Love this book"
            onClick={() => setIsLoved(!isLoved)}
            style={{ color: isLoved ? '#990000' : undefined }}
          >
            {isLoved ? <HeartSolid style={{ width: '28px', height: '28px' }} /> : <HeartIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
          <span
            className="action-icon dark-icon readlist"
            title="Readlist"
            onClick={() => setInReadlist(!inReadlist)}
            style={{ color: inReadlist ? '#3f7dbe' : undefined }}
          >
            {inReadlist ? <ClockSolid style={{ width: '28px', height: '28px' }} /> : <ClockIcon style={{ width: '28px', height: '28px' }} strokeWidth={2} />}
          </span>
        </div>
      </div>
      <div className="book-info">
        <h3 className="book-title inter-bold">{book.title}</h3>
        <p className="book-author inter-regular">{author}</p>
        <p className="book-year inter-regular">{book.first_publish_year}</p>
      </div>
    </div>
  );
}
