import { Book } from '../components/BookCard';

export const searchBooks = async (query: string, page: number = 1, limit: number = 24): Promise<{ docs: Book[], numFound: number }> => {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  const data = await response.json();
  return { docs: data.docs, numFound: data.numFound };
};

export const getPopularBooks = async (): Promise<Book[]> => {
  //predefined search to simulate "popular" books for the initial view
  const res = await searchBooks('computer', 1, 24);
  return res.docs;
};

export const getBookDetails = async (key: string): Promise<any> => {
  const url = `https://openlibrary.org${key}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch book details');
  }
  return response.json();
};