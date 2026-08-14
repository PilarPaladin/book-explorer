import React from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  setCurrentPage: (page: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setIsLogModalOpen: (isOpen: boolean) => void;
}

export default function Header({
  setCurrentPage,
  handleSearch,
  searchQuery,
  setSearchQuery,
  setIsLogModalOpen
}: HeaderProps) {
  return (
    <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 40px' }}>
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div onClick={() => setCurrentPage('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Logo" className="logo" />
          <h1 className="brand-name rakkas-regular">myArkived</h1>
        </div>
      </div>
      <nav className="header-nav inter-bold" style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('bookmarks'); }}>Bookmarks</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('readlist'); }}>Readlist</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('journal'); }}>Journal</a>
          <a href="#" className="nav-link" onClick={(e) => { e.preventDefault(); setCurrentPage('activity'); }}>Activity</a>
        </div>

        <form className="search-container" onSubmit={handleSearch} style={{ margin: 0, height: '36px', display: 'flex', position: 'relative', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search myArkived"
            className="search-input inter-regular"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0 35px 0 15px', height: '100%', fontSize: '14px', width: '240px', borderRadius: '4px', border: 'none', outline: 'none' }}
          />
          <button type="submit" style={{ position: 'absolute', right: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <MagnifyingGlassIcon style={{ width: '18px' }} />
          </button>
        </form>
        <button className="inter-bold" onClick={() => setIsLogModalOpen(true)} style={{
          backgroundColor: 'var(--color-red)', color: 'white', border: '2px solid var(--color-white)',
          borderRadius: '4px', padding: '8px 16px', fontSize: '15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '5px'
        }}>
          + LOG
        </button>
      </nav>
    </header>
  );
} 