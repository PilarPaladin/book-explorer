import React from 'react';

const BookCard = ({ book, onClick }) => {
  // Use Medium size cover if available
  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` 
    : null;

  return (
    <div 
      className="group cursor-pointer flex flex-col relative rounded overflow-hidden bg-gray-100 shadow-sm border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200 h-full"
      onClick={() => onClick(book)}
    >
      <div className="relative aspect-[2/3] w-full bg-gray-300 flex items-center justify-center overflow-hidden">
        {coverUrl ? (
          <img 
            src={coverUrl} 
            alt={`Cover of ${book.title}`} 
            className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
            loading="lazy"
          />
        ) : (
          <div className="text-center p-4 text-gray-500 font-semibold flex flex-col items-center justify-center h-full w-full">
            <span className="text-2xl block mb-2">📖</span>
            <span className="text-sm">No Cover Available</span>
          </div>
        )}
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between bg-white border-t border-gray-200">
        <div>
          <h3 className="font-bold text-sm leading-tight text-ao3-red group-hover:underline line-clamp-2" title={book.title}>
            {book.title}
          </h3>
          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
            by {book.author_name ? book.author_name.join(', ') : 'Unknown Author'}
          </p>
        </div>
        {book.first_publish_year && (
          <span className="text-xs text-gray-400 mt-2 block">
            {book.first_publish_year}
          </span>
        )}
      </div>
    </div>
  );
};

export default BookCard;
