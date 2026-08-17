import { Book } from '../components/BookCard';
import { supabase } from './supabase';
import { mapFanficToBook } from './dbService';

export const searchBooks = async (query: string, page: number = 1, limit: number = 24): Promise<{docs: Book[], numFound: number}> => {
  const { data, error, count } = await supabase
    .from('fanfics')
    .select('*', { count: 'exact' })
    .ilike('title', `%${query}%`)
    .range((page - 1) * limit, page * limit - 1);

  if (error) {
    throw new Error('Failed to fetch books: ' + error.message);
  }

  return { docs: (data || []).map(mapFanficToBook), numFound: count || 0 };
};

export const getPopularBooks = async (): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('fanfics')
    .select('*')
    .order('kudos', { ascending: false, nullsFirst: false })
    .limit(24);
  
  if (error) {
    return [];
  }
  return (data || []).map(mapFanficToBook);
};

export const getBookDetails = async (key: string): Promise<any> => {
  const id = key.replace('/works/', '');
  const { data, error } = await supabase
    .from('fanfics')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error('Failed to fetch book details: ' + error.message);
  }
  return data;
};