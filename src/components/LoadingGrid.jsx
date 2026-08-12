import React from 'react';

export default function LoadingGrid({ count = 8 }) {
  return (
    <div className="book-grid">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="book-card" style={{ opacity: 0.6 }}>
          <img src="/tempCover.png" alt="Loading..." className="book-cover" />
          <div className="book-info">
            <h3 className="book-title inter-bold" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '80%' }}>Loading</h3>
            <p className="book-author inter-regular" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '60%', marginTop: '5px' }}>Author</p>
            <p className="book-year inter-regular" style={{ backgroundColor: '#e5e7eb', color: 'transparent', borderRadius: '4px', width: '30%', marginTop: 'auto' }}>Year</p>
          </div>
        </div>
      ))}
    </div>
  );
}
