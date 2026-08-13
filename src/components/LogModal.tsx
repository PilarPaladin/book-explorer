import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { searchBooks } from '../services/api';
import { Book } from './BookCard';

interface LogModalProps {
  onClose: () => void;
}

export default function LogModal({ onClose }: LogModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }
    const fetchResults = async () => {
      setIsSearching(true);
      try {
        const data = await searchBooks(query);
        setResults(data || []);
      } catch (e) {
        setResults([]);
      }
      setIsSearching(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex',
      justifyContent: 'center', alignItems: 'center', zIndex: 2000
    }} onClick={onClose}>
      <div style={{
        backgroundColor: 'var(--color-white)', borderRadius: '6px', width: '600px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--color-gray)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f3f4f6', borderTopLeftRadius: '6px', borderTopRightRadius: '6px' }}>
          <h3 className="inter-bold" style={{ margin: 0, color: 'var(--color-dark)', fontSize: '16px' }}>Add to your books...</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <XMarkIcon style={{ width: '20px', color: 'var(--color-dark)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-white)', borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for book..."
              className="inter-regular"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ boxSizing: 'border-box', width: '100%', padding: '12px 15px', fontSize: '16px', borderRadius: '4px', border: '1px solid var(--color-gray)', outline: 'none' }}
            />
            {/* Dropdown Results */}
            {(results.length > 0 || isSearching) && query.trim() !== '' && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: 'var(--color-white)', border: '1px solid var(--color-gray)',
                borderTop: 'none', borderRadius: '0 0 4px 4px', zIndex: 10,
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                maxHeight: '300px', overflowY: 'auto'
              }}>
                {isSearching && results.length === 0 ? (
                  <div style={{ padding: '10px 15px', color: 'var(--color-gray)', fontSize: '14px' }}>Searching...</div>
                ) : (
                  results.map((book) => (
                    <div key={book.key} className="log-search-item inter-regular" onClick={() => onClose()}>
                      <strong>{book.title}</strong>
                      {book.first_publish_year && <span style={{ opacity: 0.8, marginLeft: '6px' }}>({book.first_publish_year})</span>}
                      {book.author_name && <span style={{ opacity: 0.6, marginLeft: '6px' }}>by {book.author_name[0]}</span>}
                    </div>
                  ))
                )}
                {!isSearching && results.length === 0 && (
                  <div style={{ padding: '10px 15px', color: 'var(--color-gray)', fontSize: '14px' }}>No matches found.</div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
