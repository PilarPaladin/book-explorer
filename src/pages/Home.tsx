import { useState, useEffect } from 'react';
import LoadingGrid from '../components/LoadingGrid';
import BookCard, { Book } from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { getRecentFanfics } from '../services/dbService';

interface HomeProps {
    isLoading: boolean;
    books: Book[];
    setSelectedBook: (book: Book | null) => void;
}

export default function Home({ isLoading, books, setSelectedBook }: HomeProps) {
    const { username } = useAuth();
    const [recentFics, setRecentFics] = useState<Book[]>([]);

    useEffect(() => {
        const fetchRecent = async () => {
            const recent = await getRecentFanfics(20);
            setRecentFics(recent);
        };
        fetchRecent();
    }, []);

    return (
        <>
            <h2 className="rakkas-regular page-title" style={{ textAlign: 'center' }}>
                Welcome back, {username}. Here's what's been happening...
            </h2>

            {isLoading ? (
                <LoadingGrid count={8} />
            ) : books.length === 0 && recentFics.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No fics found. Try a different search term.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '40px' }}>
                    {/* Section 1: Popular */}
                    {books.length > 0 && (
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
                    )}

                    {/* Section 2: Recently Added */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                            <h3 className="inter-bold" style={{ margin: 0, fontSize: '16px', color: '#374151' }}>Recently Added</h3>
                            <a href="#" className="inter-bold" style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none' }}>More</a>
                        </div>
                        <div style={{ display: 'flex', gap: '15px', overflowX: 'auto', paddingBottom: '15px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                            {recentFics.length === 0 ? (
                                <div className="inter-regular" style={{ color: 'var(--color-gray)' }}>No recently added fics yet.</div>
                            ) : (
                                recentFics.map((book, index) => (
                                    <div key={`recent1-${book.key || index}`} style={{ flex: '0 0 auto', width: '160px' }}>
                                        <BookCard book={book} onClick={setSelectedBook} />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Section 3: All Time Best */}
                    {books.length > 0 && (
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
                    )}
                </div>
            )}
        </>
    );
}
