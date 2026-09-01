import React, { useState, useEffect } from 'react';
import { Book } from '../components/BookCard';
import BookCard from '../components/BookCard';
import LoadingGrid from '../components/LoadingGrid';
import SEO from '../components/SEO';
import { getPopularBooks } from '../services/api';

interface AllTimeBestProps {
    onBookSelect: (book: Book | null) => void;
}

export default function AllTimeBest({ onBookSelect }: AllTimeBestProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            const results = await getPopularBooks();
            setBooks(results || []);
            setIsLoading(false);
        };
        fetchBooks();
    }, []);

    return (
        <div style={{ paddingBottom: '40px' }}>
            <SEO title="All Time Best" description="Explore the highest-rated all-time best fanfictions on myArkived." />
            <h2 className="rakkas-regular page-title" style={{ textAlign: 'center', marginBottom: '30px' }}>
                All Time Best
            </h2>
            
            {isLoading ? (
                <LoadingGrid count={12} />
            ) : books.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No fics found.
                </div>
            ) : (
                <div className="book-grid">
                    {books.map((book, index) => (
                        <BookCard key={`best-${book.key || index}`} book={book} onClick={onBookSelect} />
                    ))}
                </div>
            )}
        </div>
    );
}
