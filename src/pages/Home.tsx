import React from 'react';
import LoadingGrid from '../components/LoadingGrid';
import BookCard, { Book } from '../components/BookCard';

interface HomeProps {
    displayedQuery: string;
    isLoading: boolean;
    books: Book[];
    setSelectedBook: (book: Book | null) => void;
}

export default function Home({ displayedQuery, isLoading, books, setSelectedBook }: HomeProps) {
    return (
        <>
            <h2 className="rakkas-regular" style={{ fontSize: '42px', color: '#990000', margin: '0 0 30px 0' }}>
                {displayedQuery ? `Showing matches for "${displayedQuery}"` : "Welcome back, PilarPaladin. Here's what's been happening..."}
            </h2>

            {isLoading ? (
                <LoadingGrid count={8} />
            ) : books.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No books found. Try a different search term.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '40px' }}>
                    {/* Section 1 */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                            <h3 className="inter-bold" style={{ margin: 0, fontSize: '16px', color: '#374151' }}>Popular</h3>
                            <a href="#" className="inter-bold" style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none' }}>More</a>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {books.map((book, index) => (
                                <div key={`popular-${book.key || index}`} style={{ flex: '0 0 auto', width: '160px' }}>
                                    <BookCard book={book} onClick={setSelectedBook} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 2 */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                            <h3 className="inter-bold" style={{ margin: 0, fontSize: '16px', color: '#374151' }}>Recently Added</h3>
                            <a href="#" className="inter-bold" style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none' }}>More</a>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {books.map((book, index) => (
                                <div key={`recent1-${book.key || index}`} style={{ flex: '0 0 auto', width: '160px' }}>
                                    <BookCard book={book} onClick={setSelectedBook} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3 */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                            <h3 className="inter-bold" style={{ margin: 0, fontSize: '16px', color: '#374151' }}>All Time Best</h3>
                            <a href="#" className="inter-bold" style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none' }}>More</a>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {books.map((book, index) => (
                                <div key={`recent2-${book.key || index}`} style={{ flex: '0 0 auto', width: '160px' }}>
                                    <BookCard book={book} onClick={setSelectedBook} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
