import React, { useState, useEffect } from 'react';
import { Book } from '../components/BookCard';
import BookCard from '../components/BookCard';
import LoadingGrid from '../components/LoadingGrid';
import Pagination from '../components/Pagination';
import SEO from '../components/SEO';
import { getPopularBooks } from '../services/api';

interface PopularProps {
    onBookSelect: (book: Book | null) => void;
}

export default function Popular({ onBookSelect }: PopularProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24;

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const results = await getPopularBooks();
            setBooks(results || []);
            setIsLoading(false);
        };
        fetchBooks();
    }, []);

    // Calculate pagination values
    const totalPages = Math.ceil(books.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentBooks = books.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="page-container">
          <SEO title="Popular Fics" description="Browse the most popular fanfictions on myArkived." />
          <div className="page-header-container">
            <h2 className="rakkas-regular page-title">
              Popular
            </h2>
          </div>
    
          {isLoading ? (
            <LoadingGrid count={12} />
          ) : books.length === 0 ? (
            <div className="inter-bold empty-state-message">    
              No fics found.
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
    