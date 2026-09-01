import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { getPopularBooks } from './services/api';
import toast, { Toaster } from 'react-hot-toast';
import Bookmarks from './pages/Bookmarks';
import Readlist from './pages/Readlist';
import Journal from './pages/Journal';
import Welcome from './pages/Welcome';
import Home from './pages/Home';
import Activity from './pages/ActivityFeed';
import Profile from './pages/Profile';
import Sidebar from './components/Sidebar';
import { Book } from './components/BookCard';
import SearchModal from './components/SearchModal';
import Header from './components/Header';
import Fic from './pages/Fic';
import Results from './pages/Results';
import Popular from './pages/Popular';
import RecentlyAdded from './pages/RecentlyAdded';
import AllTimeBest from './pages/AllTimeBest';
import AddReviewModal from './components/AddReviewModal';
import { useBookActivity } from './hooks/useBookActivity';
import SignUpModal from './components/SignUpModal';
import LogInModal from './components/LogInModal';
import { useAuth } from './context/AuthContext';
import LogActionModal from './components/LogActionModal';
import AddFicModal from './components/AddFicModal';

function LogModalWrapper({ book, onClose }: { book: Book, onClose: () => void }) {
  const { activity, updateActivity } = useBookActivity(book);
  return (
    <AddReviewModal
      book={book}
      activity={activity}
      onClose={onClose}
      onSave={updateActivity}
    />
  );
}

function App() {
  const { user, isLoading: authLoading } = useAuth();
  const isLoggedIn = !!user;
  const routerNavigate = useNavigate();
  const location = useLocation();
  
  // Custom navigation wrapper to support legacy 'home' string passed by Header/Sidebar
  const navigate = (page: string) => {
    if (page === 'home') {
      routerNavigate('/');
    } else {
      routerNavigate(`/${page}`);
    }
  };
  const [isLogActionModalOpen, setIsLogActionModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAddFicModalOpen, setIsAddFicModalOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedQuery, setDisplayedQuery] = useState('');
  const [selectedBookToLog, setSelectedBookToLog] = useState<Book | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'register' | 'login'>('register');

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const results = await getPopularBooks();
        setBooks(results || []);
      } catch (err) {
        console.error("Failed to fetch initial books", err);
        toast.error("Failed to fetch initial books");
      }
      setIsLoading(false);
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setDisplayedQuery(searchQuery);
    navigate('results');
  };

  const handleBookSelect = (book: Book) => {
    const id = book.key ? book.key.replace('/works/', '') : book.id;
    routerNavigate(`/fic/${id}`, { state: { book } });
  };

  const renderPage = () => {
    return (
      <Routes>
        <Route path="/" element={<Home isLoading={isLoading} books={books} setSelectedBook={handleBookSelect} />} />
        <Route path="/results" element={<Results searchQuery={displayedQuery} onBookSelect={handleBookSelect} />} />
        <Route path="/bookmarks" element={<Bookmarks onBookSelect={handleBookSelect} />} />
        <Route path="/readlist" element={<Readlist onBookSelect={handleBookSelect} />} />
        <Route path="/journal" element={<Journal onBookSelect={handleBookSelect} />} />
        <Route path="/activity" element={<Activity onBookSelect={handleBookSelect} />} />
        <Route path="/profile/:username" element={<Profile onBookSelect={handleBookSelect} />} />
        
        <Route path="/popular" element={<Popular onBookSelect={handleBookSelect} />} />
        <Route path="/recently-added" element={<RecentlyAdded onBookSelect={handleBookSelect} />} />
        <Route path="/all-time-best" element={<AllTimeBest onBookSelect={handleBookSelect} />} />
        
        <Route path="/fic/:id" element={<Fic />} />
      </Routes>
    );
  };

  if (authLoading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white', backgroundColor: 'var(--color-dark)' }}>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#990000',
            color: '#ffffff',
            fontFamily: 'Inter, sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#990000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ffffff',
              secondary: '#990000',
            },
          },
        }}
      />
      <Header
        isLoggedIn={isLoggedIn}
        onLoginClick={() => { setAuthModalType('login'); setIsAuthModalOpen(true); }}
        onRegisterClick={() => { setAuthModalType('register'); setIsAuthModalOpen(true); }}
        setCurrentPage={navigate}
        handleSearch={handleSearch}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsLogModalOpen={setIsLogActionModalOpen}
      />

      {!isLoggedIn ? (
        <Welcome 
          onGetStarted={() => { setAuthModalType('register'); setIsAuthModalOpen(true); }} 
        />
      ) : (
        <main className="main-content">
          <div className="left-column">
            {renderPage()}
          </div>

          <Sidebar isLoading={isLoading} setCurrentPage={navigate} onBookSelect={handleBookSelect} />
        </main>
      )}

      {isLogActionModalOpen && (
        <LogActionModal
          onClose={() => setIsLogActionModalOpen(false)}
          onSelectSearch={() => {
            setIsLogActionModalOpen(false);
            setIsSearchModalOpen(true);
          }}
          onSelectAddFic={() => {
            setIsLogActionModalOpen(false);
            setIsAddFicModalOpen(true);
          }}
        />
      )}

      {isSearchModalOpen && (
        <SearchModal 
          onClose={() => setIsSearchModalOpen(false)} 
          onSelectBook={(book) => setSelectedBookToLog(book)}
        />
      )}

      {isAddFicModalOpen && user && (
        <AddFicModal
          onClose={() => setIsAddFicModalOpen(false)}
          onSuccess={(book) => {
            const id = book.key ? book.key.replace('/works/', '') : book.id;
            routerNavigate(`/fic/${id}`, { state: { book } });
          }}
        />
      )}
      
      {selectedBookToLog && (
        <LogModalWrapper 
          book={selectedBookToLog} 
          onClose={() => setSelectedBookToLog(null)} 
        />
      )}

      {isAuthModalOpen && authModalType === 'register' && (
        <SignUpModal
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchToLogin={() => setAuthModalType('login')}
        />
      )}
      
      {isAuthModalOpen && authModalType === 'login' && (
        <LogInModal
          onClose={() => setIsAuthModalOpen(false)}
          onSwitchToRegister={() => setAuthModalType('register')}
        />
      )}
    </div>
  );
}

export default App;
