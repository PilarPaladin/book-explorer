import React from 'react';
import LoadingGrid from '../components/LoadingGrid';
import BookCard, { Book } from '../components/BookCard';

interface ResultsProps {
    books: Book[];
    isLoading: boolean;
    searchQuery: string;
    onBookSelect: (book: Book) => void;
}

export default function Results({ books, isLoading, searchQuery, onBookSelect }: ResultsProps) {
    return (
        <div style={{ width: '100%' }}>
            <h2 className="rakkas-regular" style={{ fontSize: 'clamp(28px, 6vw, 42px)', color: '#990000', margin: '0 0 25px 0', paddingBottom: '10px', borderBottom: '2px solid var(--color-red)' }}>
                Results for "{searchQuery}"
            </h2>

            {isLoading ? (
                <LoadingGrid count={8} />
            ) : books.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No results found. Try a different search term.
                </div>
            ) : (
                <div className="book-grid results-grid">
                    {books.map((book, index) => (
                        <div key={book.key || index}>
                            <BookCard book={book} onClick={() => onBookSelect(book)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
