import { Book } from '../components/BookCard';

export interface RecentActivityItem {
  id: string;
  bookTitle: string;
  bookKey: string;
  actions: string[]; 
  startedDate?: string;
  finishedDate?: string;
  rating?: number;
  review?: string;
  timestamp: number;
}

export function logActivity(book: Book | null, actions: string[], startedDate?: string, finishedDate?: string, rating?: number, review?: string) {
  if (!book || actions.length === 0) return;

  const stored = localStorage.getItem('recentActivity');
  let current: RecentActivityItem[] = stored ? JSON.parse(stored) : [];

  const bookKey = book.key || 'unknown';
  const todayStr = new Date().toDateString();
  const inputDate = startedDate || finishedDate;

  // Find if there's already an activity for this book that we should merge with
  const existingIndex = current.findIndex(item => {
    if (item.bookKey !== bookKey) return false;
    
    const isStartedEvent = !!startedDate;
    const isFinishedEvent = !!finishedDate || (!startedDate && !finishedDate);
    
    const itemIsStarted = !!item.startedDate;
    const itemIsFinished = !!item.finishedDate;
    
    // STRICT RULE: Started and Finished events NEVER merge.
    if (isStartedEvent && itemIsFinished) return false;
    if (isFinishedEvent && itemIsStarted) return false;
    
    const itemDate = item.startedDate || item.finishedDate;
    
    // If both have an inputted date, they must match to merge
    if (inputDate && itemDate) {
      return inputDate === itemDate;
    }
    
    // If neither have inputted dates, merge if they are on the same real-world day
    if (!inputDate && !itemDate) {
      return new Date(item.timestamp).toDateString() === todayStr;
    }
    
    return false;
  });

  if (existingIndex >= 0) {
    const existing = current[existingIndex];
    const combinedActions = Array.from(new Set([...existing.actions, ...actions]));
    
    const updatedItem: RecentActivityItem = {
      ...existing,
      actions: combinedActions,
      startedDate: startedDate || existing.startedDate,
      finishedDate: finishedDate || existing.finishedDate,
      rating: rating || existing.rating,
      review: review || existing.review,
      timestamp: Date.now() // update timestamp so it jumps to top
    };
    
    // Remove the old item and push the updated one to the front
    current.splice(existingIndex, 1);
    current.unshift(updatedItem);
  } else {
    const newItem: RecentActivityItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      bookTitle: book.title,
      bookKey,
      actions,
      startedDate,
      finishedDate,
      rating,
      review,
      timestamp: Date.now()
    };
    current.unshift(newItem);
  }

  localStorage.setItem('recentActivity', JSON.stringify(current));
  window.dispatchEvent(new Event('recent-activity-updated'));
}

export function getRecentActivity(): RecentActivityItem[] {
  const stored = localStorage.getItem('recentActivity');
  return stored ? JSON.parse(stored) : [];
}
