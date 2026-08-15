import { useState, useEffect } from 'react';
import { Book } from '../components/BookCard';
import { logActivity } from '../services/activityLogger';

export interface BookmarkDetails {
  id: string;
  chapter: string;
  page: string;
  notes: string;
  date: string;
}

export interface BookActivity {
  isRead: boolean;
  isLoved: boolean;
  isBookmarked: boolean;
  bookmarks: BookmarkDetails[];
  inReadlist: boolean;
  rating: number;
  readOnDate?: string;
  startedOnDate?: string;
  readBefore?: boolean;
  review?: string;
  bookData: Book | null;
  timestamp: number;
}

export function useBookActivity(book: Book | null) {
  const key = book?.key || book?.title || 'unknown';
  
  const [activity, setActivity] = useState<BookActivity>(() => {
    if (!book) return defaultActivity(null);
    const stored = localStorage.getItem('userActivity');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed[key]) {
            // Ensure bookData is stored if it's missing or old
            return { ...parsed[key], bookData: book };
        }
      } catch (e) {
        console.error('Error parsing userActivity from localStorage', e);
      }
    }
    return defaultActivity(book);
  });

  const updateActivity = (updates: Partial<BookActivity>) => {
    setActivity(prev => {
      const next = { ...prev, ...updates, timestamp: Date.now() };
      
      // Auto-remove from readlist if the book is newly marked as read
      if ((updates.isRead === true && !prev.isRead) || (updates.readOnDate && !prev.readOnDate)) {
        next.inReadlist = false;
      }

      const miscActions: string[] = [];
      if (updates.isLoved && !prev.isLoved) miscActions.push('Loved');
      
      if (
        (updates.isBookmarked && !prev.isBookmarked) || 
        (updates.bookmarks && updates.bookmarks.length > (prev.bookmarks?.length || 0))
      ) {
        miscActions.push('Bookmarked');
      }
      
      if (updates.inReadlist && !prev.inReadlist) miscActions.push('Added to Readlist');
      
      let startedDate: string | undefined;
      if (updates.startedOnDate && updates.startedOnDate !== prev.startedOnDate) {
          startedDate = updates.startedOnDate;
      }

      let readDate: string | undefined;
      if (updates.readOnDate && updates.readOnDate !== prev.readOnDate) {
          readDate = updates.readOnDate;
      }

      let ratedVal: number | undefined;
      if (updates.rating !== undefined && updates.rating !== prev.rating && updates.rating > 0) {
        miscActions.push('Rated');
        ratedVal = updates.rating;
      }

      let reviewText: string | undefined;
      if (updates.review !== undefined && updates.review !== prev.review && updates.review.trim() !== '') {
        miscActions.push('Reviewed');
        reviewText = updates.review;
      }

      if (startedDate) {
        logActivity(book, ['Started'], startedDate, undefined, ratedVal, readDate ? undefined : reviewText);
      }

      if (readDate) {
        logActivity(book, ['Finished', ...miscActions], undefined, readDate, ratedVal, reviewText);
      } else if (miscActions.length > 0) {
        logActivity(book, miscActions, undefined, prev.readOnDate, ratedVal, reviewText);
      }
      
      const stored = localStorage.getItem('userActivity');
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[key] = next;
      localStorage.setItem('userActivity', JSON.stringify(parsed));
      
      window.dispatchEvent(new CustomEvent('activity-updated', { detail: { key, activity: next } }));
      
      return next;
    });
  };

  useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail && customEvent.detail.key === key) {
        setActivity(customEvent.detail.activity);
      }
    };
    
    window.addEventListener('activity-updated', handleUpdate);
    return () => window.removeEventListener('activity-updated', handleUpdate);
  }, [key]);

  return { activity, updateActivity };
}

function defaultActivity(book: Book | null): BookActivity {
  return {
    isRead: false,
    isLoved: false,
    isBookmarked: false,
    bookmarks: [],
    inReadlist: false,
    rating: 0,
    bookData: book,
    timestamp: Date.now()
  };
}
