import { useRef } from 'react';
import { Link } from 'react-router-dom';
import BookCard, { Book } from './BookCard';

export interface BookCarouselProps {
    title: string;
    books: Book[];
    onBookClick: (book: Book | null) => void;
    emptyMessage?: string;
    moreLink: string;
    maxCount?: number; 
}

export default function BookCarousel({ 
    title, 
    books, 
    onBookClick, 
    emptyMessage, 
    moreLink,
    maxCount = 20 // Default limit is set here
}: BookCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Apply the maxCount limit to the books array
    const displayBooks = books.slice(0, maxCount);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; 
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (displayBooks.length === 0 && !emptyMessage) return null;

    return (
        <div className="mb-8">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>
                <h3 className="inter-bold" style={{ margin: 0, fontSize: '16px', color: '#374151' }}>{title}</h3>
                <Link to={moreLink} className="inter-bold" style={{ fontSize: '14px', color: '#4b5563', textDecoration: 'none' }}>More</Link>
            </div>
            
            {/* The main wrapper */}
            <div className="carousel-container" style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
                
                {/* Left Button - Absolutely positioned to the left edge */}
                {displayBooks.length > 0 && (
                    <button 
                        onClick={() => scroll('left')}
                        className="carousel-btn"
                        style={{ left: '-15px' }}
                        aria-label="Scroll left"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                )}

                {/* Scroll Container - Restoring the inline styles for flex layout */}
                <div 
                    ref={scrollContainerRef}
                    className="scrollbar-hide" 
                    style={{ 
                        display: 'flex', 
                        gap: '15px', 
                        overflowX: 'auto', 
                        paddingBottom: '15px', 
                        width: '100%', 
                        msOverflowStyle: 'none', 
                        scrollbarWidth: 'none' 
                    }}
                >
                    {displayBooks.length === 0 && emptyMessage ? (
                        <div className="inter-regular" style={{ color: 'var(--color-gray)' }}>{emptyMessage}</div>
                    ) : (
                        displayBooks.map((book, index) => (
                            <div key={`${title.replace(/\s+/g, '')}-${book.key || index}`} style={{ flex: '0 0 auto', width: '160px' }}>
                                <BookCard book={book} onClick={onBookClick} />
                            </div>
                        ))
                    )}
                </div>

                {/* Right Button - Absolutely positioned to the right edge */}
                {displayBooks.length > 0 && (
                    <button 
                        onClick={() => scroll('right')}
                        className="carousel-btn"
                        style={{ right: '-15px' }}
                        aria-label="Scroll right"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                )}
            </div>
        </div>
    );
}
