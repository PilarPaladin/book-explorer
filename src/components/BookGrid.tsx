
import BookCard, { Book } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBookClick: (book: Book) => void;
  title?: string;
}

const BookGrid = ({ books, onBookClick, title }: BookGridProps) => {
  if (!books || books.length === 0) return null;

  return (
    <div className="mb-8">
      {title && (
        <div className="border-b border-gray-300 mb-4 pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-700">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {books.map((book, index) => (
          <BookCard key={book.key || index} book={book} onClick={onBookClick} />
        ))}
      </div>
    </div>
  );
};

export default BookGrid;
