import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import LoadingGrid from '../components/LoadingGrid';
import BookCard, { Book } from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { getRecentFanfics } from '../services/dbService';

import BookCarousel from '../components/BookCarousel';
import SEO from '../components/SEO';

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
            <SEO title="Home" description="Discover popular and recently added fanfictions on myArkived." />
            <h2 className="rakkas-regular page-title">
                Welcome back, {username}. Here's what's been happening...
            </h2>

            {isLoading ? (
                <LoadingGrid count={8} />
            ) : books.length === 0 && recentFics.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No fics found.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', paddingBottom: '40px' }}>
                    <BookCarousel 
                        title="Popular" 
                        books={books} 
                        onBookClick={setSelectedBook} 
                        moreLink="/popular"
                    />
                    
                    <BookCarousel 
                        title="Recently Added" 
                        books={recentFics} 
                        onBookClick={setSelectedBook} 
                        emptyMessage="No recently added fics yet." 
                        moreLink="/recently-added"
                    />
                    
                    <BookCarousel 
                        title="All Time Best" 
                        books={books} 
                        onBookClick={setSelectedBook} 
                        moreLink="/all-time-best"
                    />
                </div>
            )}
        </>
    );
}