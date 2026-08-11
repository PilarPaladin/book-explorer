import React, { useEffect, useRef } from 'react';

const BookModal = ({ book, onClose }) => {
  const modalRef = useRef();

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Close on outside click
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  if (!book) return null;

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` 
    : null;

  // AO3 style tags for subjects
  const subjects = book.subject ? book.subject.slice(0, 15) : [];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleOutsideClick}
    >
      <div 
        ref={modalRef}
        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded shadow-2xl flex flex-col md:flex-row relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-red-600 hover:text-white rounded-full font-bold text-gray-700 transition-colors z-10"
        >
          ✕
        </button>
        
        {/* Cover side */}
        <div className="w-full md:w-1/3 bg-gray-100 p-6 flex flex-col items-center justify-start border-r border-gray-200">
          <div className="w-full max-w-[200px] aspect-[2/3] bg-gray-200 rounded shadow-md overflow-hidden mb-4">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
            ) : (
               <div className="text-center p-4 text-gray-500 font-semibold flex flex-col items-center justify-center h-full w-full">
                <span className="text-4xl block mb-2">📖</span>
                <span>No Cover</span>
              </div>
            )}
          </div>
          <button className="w-full py-2 bg-ao3-link hover:bg-blue-700 text-white font-semibold rounded shadow transition-colors">
            + Log Book
          </button>
        </div>

        {/* Details side (AO3 styling) */}
        <div className="w-full md:w-2/3 p-6 md:p-8">
          <h2 className="text-3xl font-bold text-ao3-red mb-1 font-serif">
            {book.title}
          </h2>
          <p className="text-lg text-gray-700 font-semibold border-b border-gray-200 pb-4 mb-4">
            by <a href="#" className="text-ao3-red hover:underline">{book.author_name ? book.author_name.join(', ') : 'Unknown'}</a>
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-ao3-tagbg p-4 border border-ao3-border rounded text-sm">
              <span className="font-bold block mb-1">First Published:</span>
              {book.first_publish_year || 'Unknown'}
            </div>
            <div className="bg-ao3-tagbg p-4 border border-ao3-border rounded text-sm">
              <span className="font-bold block mb-1">Editions:</span>
              {book.edition_count || '1'}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-bold text-gray-800 mb-2">Tags / Subjects:</h3>
            {subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject, idx) => (
                  <span 
                    key={idx}
                    className="inline-block px-2 py-1 text-sm bg-gray-100 border border-gray-300 text-ao3-link hover:underline cursor-pointer rounded"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No tags available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookModal;
