import { Book } from '../components/BookCard';

export const searchBooks = async (query: string): Promise<Book[]> => {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=100`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  const data = await response.json();
  return data.docs;
};

export const getPopularBooks = async (): Promise<Book[]> => {
  // A simple predefined search to simulate "popular" books for the initial view
  return searchBooks('lord of the rings');
};