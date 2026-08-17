import { useState, useEffect } from 'react';
import { Book } from '../components/BookCard';
import { useAuth } from '../context/AuthContext';
import { getUserFicActivity, toggleFicLove, setFicStatus, updateFicRating, addReadingLog, addReview, addBookmark, ensureFanficExists } from '../services/dbService';

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
  const { user } = useAuth();
  const key = book?.key ? book.key.replace('/works/', '') : 'unknown';
  
  const [activity, setActivity] = useState<BookActivity>(defaultActivity(book));

  useEffect(() => {
    if (!user || !book || key === 'unknown') return;

    let mounted = true;

    const fetchActivity = async () => {
      try {
        const { userFic, readingLogs, bookmarks, reviews } = await getUserFicActivity(user.id, key);
        
        if (!mounted) return;

        const newActivity = defaultActivity(book);
        if (userFic) {
          newActivity.inReadlist = userFic.reading_status === 'readlist';
          newActivity.isRead = userFic.reading_status === 'finished';
          newActivity.isLoved = userFic.is_loved || false;
          newActivity.startedOnDate = userFic.date_started || undefined;
          newActivity.rating = userFic.user_rating || 0;
        }
        if (reviews && reviews.length > 0) {
          newActivity.review = reviews[0].review_text || '';
        }
        if (readingLogs && readingLogs.length > 0) {
          newActivity.readOnDate = readingLogs[0].date_finished || undefined;
          newActivity.readBefore = readingLogs[0].is_reread || false;
        }
        if (bookmarks && bookmarks.length > 0) {
          newActivity.isBookmarked = true;
          newActivity.bookmarks = bookmarks.map(b => ({
            id: b.id,
            chapter: b.chapter_number?.toString() || '',
            page: '',
            notes: b.note || '',
            date: ''
          }));
        }
        setActivity(newActivity);
      } catch (err) {
        console.error('Failed to fetch activity', err);
      }
    };

    fetchActivity();

    return () => { mounted = false; };
  }, [user, book, key]);

  const updateActivity = async (updates: Partial<BookActivity>) => {
    if (!user || key === 'unknown') return;

    let finalIsRead = activity.isRead;

    setActivity(prev => {
      const next = { ...prev, ...updates, timestamp: Date.now() };
      
      // Auto-remove from readlist if the book is newly marked as read
      if ((updates.isRead === true && !prev.isRead) || (updates.readOnDate && !prev.readOnDate)) {
        next.inReadlist = false;
        next.isRead = true;
      }

      finalIsRead = next.isRead;

      return next;
    });

    try {
      if (book) {
        await ensureFanficExists(book);
      }

      // Rule 1: Loves
      if (updates.isLoved !== undefined && updates.isLoved !== activity.isLoved) {
        await toggleFicLove(user.id, key, updates.isLoved);
      }

      // Rule 1: Bookmarks
      if (updates.isBookmarked !== undefined && updates.bookmarks && updates.bookmarks.length > activity.bookmarks.length) {
         const latestBookmark = updates.bookmarks[updates.bookmarks.length - 1];
         if (latestBookmark) {
            await addBookmark(user.id, key, parseInt(latestBookmark.chapter) || 1, latestBookmark.notes || '');
         }
      }

      // Rule 2: Readlist
      if (updates.inReadlist !== undefined && updates.inReadlist !== activity.inReadlist) {
         if (updates.inReadlist) {
            if (!activity.isRead && !activity.startedOnDate) {
              await setFicStatus(user.id, key, 'readlist');
            }
         } else if (!finalIsRead) {
            await setFicStatus(user.id, key, null);
         }
      }

      const isFinishing = (updates.isRead === true && !activity.isRead) || (updates.readOnDate !== undefined);

      // Explicit Start (If they set a start date but aren't finishing the book)
      if (updates.startedOnDate !== undefined && updates.startedOnDate !== activity.startedOnDate && !isFinishing) {
         await setFicStatus(user.id, key, 'reading', updates.startedOnDate);
      }

      // Rule 3: Finished / Ghost Reads
      if (isFinishing) {
         await setFicStatus(user.id, key, 'finished', updates.startedOnDate);
      }
      
      const hasLogUpdates = updates.readBefore === true;
      
      let newLogId: string | null = null;
      if (isFinishing || hasLogUpdates) {
        const currentReadOnDate = updates.readOnDate !== undefined ? updates.readOnDate : activity.readOnDate;
        const currentStartedDate = updates.startedOnDate !== undefined ? updates.startedOnDate : activity.startedOnDate;
        const isReread = updates.readBefore !== undefined ? updates.readBefore : (activity.readBefore || activity.isRead);
        
        const logData = await addReadingLog(user.id, key, currentReadOnDate === null ? undefined : currentReadOnDate, currentStartedDate === null ? undefined : currentStartedDate, isReread);
        newLogId = logData?.id || null;
      }

      // Review / Rating
      if (updates.rating !== undefined || updates.review !== undefined) {
         const currentRating = updates.rating !== undefined ? updates.rating : activity.rating;
         const currentReview = updates.review !== undefined ? updates.review : activity.review;
         
         await updateFicRating(user.id, key, currentRating || null);
         
         if (currentReview || currentRating) {
            await addReview(user.id, key, currentReview || '', currentRating || null, newLogId);
         }
      }
    } catch (err) {
      console.error('Failed to sync activity to Supabase', err);
    }
  };

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
