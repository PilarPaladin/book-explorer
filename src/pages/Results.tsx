import { useState, useEffect } from 'react';
import LoadingGrid from '../components/LoadingGrid';
import BookCard, { Book } from '../components/BookCard';
import Pagination from '../components/Pagination';
import { searchBooks } from '../services/api';
import SEO from '../components/SEO';

interface ResultsProps {
    searchQuery: string;
    onBookSelect: (book: Book) => void;
}

export default function Results({ searchQuery, onBookSelect }: ResultsProps) {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);
    const itemsPerPage = 24;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            try {
                const { docs, numFound } = await searchBooks(searchQuery, currentPage, itemsPerPage);
                setBooks(docs || []);
                setTotalResults(numFound || 0);
            } catch (err) {
                console.error("Search failed", err);
                setBooks([]);
                setTotalResults(0);
            }
            setIsLoading(false);
        };

        if (searchQuery) {
            fetchResults();
        }
    }, [searchQuery, currentPage]);

    const totalPages = Math.ceil(totalResults / itemsPerPage);

    return (
        <div className="page-container">
            <SEO title={`Search: ${searchQuery}`} description={`Search results for ${searchQuery} on myArkived.`} />
            <div className="page-header-container">
                <h2 className="rakkas-regular page-title">
                    Results for: {searchQuery}
                </h2>
            </div>

            {isLoading ? (
                <LoadingGrid count={itemsPerPage} />
            ) : books.length === 0 ? (
                <div className="inter-regular" style={{ textAlign: 'center', padding: '60px 20px', fontSize: '18px', color: 'var(--color-dark)' }}>
                    No results found. Try a different search term.
                </div>
            ) : (
                <>
                    <div className="book-grid results-grid">
                        {books.map((book, index) => (
                            <div key={book.key || index}>
                                <BookCard book={book} onClick={() => onBookSelect(book)} />
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
