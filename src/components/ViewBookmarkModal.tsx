import { XMarkIcon } from '@heroicons/react/24/outline';
import { BookmarkDetails } from '../hooks/useBookActivity';
import { Book } from '../components/BookCard';
import { useScrollLock } from '../hooks/useScrollLock';

interface ViewBookmarkModalProps {
  book: Book;
  bookmarks: BookmarkDetails[];
  onClose: () => void;
}

export default function ViewBookmarkModal({ book, bookmarks, onClose }: ViewBookmarkModalProps) {
  useScrollLock();

  return (
    <div className="bookmark-list-modal-overlay" onClick={onClose}>
      <div className="bookmark-list-modal" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="modal-close-btn"
        >
          <XMarkIcon />
        </button>

        <h3 className="rakkas-regular bookmark-modal-title" style={{ marginBottom: '20px', paddingRight: '30px' }}>
          {book.title}
        </h3>

        <div className="bookmark-list-items-container">
          {bookmarks.map((bm, index) => (
            <div key={bm.id || index} className="bookmark-list-item">
              <div className="bookmark-list-item-header">
                <span className="inter-bold bookmark-item-chapter">{bm.chapter}</span>
                <span className="inter-regular bookmark-item-date">{bm.date}</span>
              </div>
              <div className="inter-bold bookmark-item-page">Page {bm.page}</div>
              <p className="inter-regular bookmark-item-notes">
                "{bm.notes}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
