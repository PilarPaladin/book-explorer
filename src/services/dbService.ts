import { supabase } from './supabase';
import { Fanfic, UserFic, ReadingLog, Bookmark } from '../types/database';
import { Book } from '../components/BookCard'; // Reusing Book type for now since components expect it

// Helper to map Fanfic to Book format for UI compatibility
export const mapFanficToBook = (fic: Fanfic): Book => ({
  ...fic,
  key: `/works/${fic.id}`,
  title: fic.title || 'Unknown Title',
  author_name: fic.authors || [],
  first_publish_year: fic.published_date ? new Date(fic.published_date).getFullYear() : undefined,
  cover_i: undefined, // AO3 doesn't have covers like OpenLibrary
});

export const ensureFanficExists = async (book: Book) => {
  const ficId = book.key?.replace('/works/', '');
  if (!ficId || ficId === 'unknown') return;

  await supabase.from('fanfics').upsert({
    id: ficId,
    title: book.title,
    authors: book.author_name || book.authors || [],
    published_date: book.published_date || (book.first_publish_year ? `${book.first_publish_year}-01-01` : null),
    word_count: book.word_count,
    kudos: book.kudos,
    chapters_published: book.chapters_published,
    chapters_total: book.chapters_total,
    rating: book.rating,
    categories: book.categories,
    fandoms: book.fandoms,
    relationships: book.relationships,
    additional_tags: book.additional_tags,
    synopsis: book.synopsis,
    url: book.url || `https://archiveofourown.org/works/${ficId}`,
  }, { onConflict: 'id' });
};

export const getUserFicActivity = async (userId: string, ficId: string) => {
  const { data: userFic } = await supabase
    .from('user_fics')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .maybeSingle();

  const { data: readingLogs } = await supabase
    .from('reading_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .order('date_finished', { ascending: false });

  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .order('created_at', { ascending: false });

  return {
    userFic: userFic as UserFic | null,
    readingLogs: readingLogs as ReadingLog[] | null,
    bookmarks: bookmarks as Bookmark[] | null,
    reviews: reviews as any[] | null
  };
};

export const toggleFicLove = async (userId: string, ficId: string, isLoved: boolean) => {
  const { data: existing } = await supabase
    .from('user_fics')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .maybeSingle();

  const payload: any = { is_loved: isLoved };

  // Cleanup: if unloving and status is null and no rating exists
  if (!isLoved && existing && existing.reading_status === null && existing.user_rating === null) {
    await supabase.from('user_fics').delete().eq('id', existing.id);
    return;
  }

  if (existing) {
    await supabase.from('user_fics').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('user_fics').insert({ user_id: userId, fic_id: ficId, ...payload });
  }
};

export const setFicStatus = async (userId: string, ficId: string, status: string | null, explicitDateStarted?: string) => {
  const { data: existing } = await supabase
    .from('user_fics')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .maybeSingle();

  const payload: any = { reading_status: status };

  if (explicitDateStarted !== undefined) {
    payload.date_started = explicitDateStarted;
  }

  // Cleanup if no status, not loved, and no rating exists
  if (status === null && existing && (existing.is_loved === false || existing.is_loved === null) && existing.user_rating === null) {
     await supabase.from('user_fics').delete().eq('id', existing.id);
     return;
  }

  if (existing) {
    await supabase.from('user_fics').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('user_fics').insert({ user_id: userId, fic_id: ficId, ...payload });
  }
};

export const updateFicRating = async (userId: string, ficId: string, rating: number | null) => {
  const { data: existing } = await supabase
    .from('user_fics')
    .select('*')
    .eq('user_id', userId)
    .eq('fic_id', ficId)
    .maybeSingle();

  const payload: any = { user_rating: rating };

  if (existing) {
    await supabase.from('user_fics').update(payload).eq('id', existing.id);
  } else {
    await supabase.from('user_fics').insert({ user_id: userId, fic_id: ficId, ...payload });
  }
};

export const addReadingLog = async (userId: string, ficId: string, dateFinished?: string, dateStarted?: string | null, isReread?: boolean) => {
  const { data, error } = await supabase.from('reading_logs').insert({
    user_id: userId,
    fic_id: ficId,
    date_finished: dateFinished || new Date().toISOString(),
    date_started: dateStarted || null,
    is_reread: isReread || false
  }).select('id').single();
  
  if (error) throw error;
  return data;
};

export const addReview = async (userId: string, ficId: string, reviewText: string, sessionRating: number | null, readingLogId: string | null = null) => {
  return supabase.from('reviews').insert({
    user_id: userId,
    fic_id: ficId,
    review_text: reviewText,
    session_rating: sessionRating,
    reading_log_id: readingLogId
  });
};

export const updateReadingSession = async (
  logId: string, 
  userId: string, 
  ficId: string, 
  updates: { 
    readOnDate?: string; 
    startedOnDate?: string; 
    readBefore: boolean; 
    review: string; 
    rating: number; 
  }
) => {
  // Update reading_log
  await supabase.from('reading_logs').update({
    date_finished: updates.readOnDate || null,
    date_started: updates.startedOnDate || null,
    is_reread: updates.readBefore
  }).eq('id', logId);

  // Check if review exists for this log
  const { data: existingReview } = await supabase.from('reviews').select('id').eq('reading_log_id', logId).maybeSingle();
  
  if (existingReview) {
    await supabase.from('reviews').update({
      review_text: updates.review || null,
      session_rating: updates.rating || null
    }).eq('id', existingReview.id);
  } else if (updates.review || updates.rating) {
    await supabase.from('reviews').insert({
      user_id: userId,
      fic_id: ficId,
      reading_log_id: logId,
      review_text: updates.review || null,
      session_rating: updates.rating || null
    });
  }

  // Update global rating if there is a rating provided or changed
  if (updates.rating) {
     await updateFicRating(userId, ficId, updates.rating);
  }
};

export const deleteReadingSession = async (logId: string) => {
  // First delete any associated reviews
  await supabase.from('reviews').delete().eq('reading_log_id', logId);
  // Then delete the reading log itself
  await supabase.from('reading_logs').delete().eq('id', logId);
};

export const addBookmark = async (userId: string, ficId: string, chapterNumber: number, note: string) => {
  const { error } = await supabase.from('bookmarks').insert({
    user_id: userId,
    fic_id: ficId,
    chapter_number: chapterNumber,
    note: note
  });

  if (error) throw error;
};

export const removeBookmark = async (id: string) => {
  return supabase.from('bookmarks').delete().eq('id', id);
};

export const getUserReadlist = async (userId: string): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('user_fics')
    .select('fic_id, fanfics(*)')
    .eq('user_id', userId)
    .eq('reading_status', 'readlist');
    
  if (error || !data) return [];
  
  return data.map((row: any) => mapFanficToBook(row.fanfics));
};

export const getFicStats = async (ficId: string) => {
  const { data, error } = await supabase
    .from('fic_statistics')
    .select('*')
    .eq('fic_id', ficId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching fic stats:", error);
    return null;
  }
  return data;
};

export const getUserActivityFeed = async (userId: string) => {
  const [logsRes, ficsRes, bookmarksRes, reviewsRes] = await Promise.all([
    supabase.from('reading_logs').select('*, fanfics(*)').eq('user_id', userId),
    supabase.from('user_fics').select('*, fanfics(*)').eq('user_id', userId),
    supabase.from('bookmarks').select('*, fanfics(*)').eq('user_id', userId),
    supabase.from('reviews').select('*, fanfics(*)').eq('user_id', userId)
  ]);

  const activities: any[] = [];
  
  const reviewMapByLog = new Map((reviewsRes.data || []).filter((r: any) => r.reading_log_id).map((r: any) => [r.reading_log_id, r]));
  const standaloneReviews = (reviewsRes.data || []).filter((r: any) => !r.reading_log_id);

  if (logsRes.data) {
    logsRes.data.forEach((log: any) => {
      const review = reviewMapByLog.get(log.id);
      
      if (log.date_started) {
        activities.push({
          id: `log-start-${log.id}`,
          bookTitle: log.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${log.fic_id}`,
          actions: ['Started'],
          startedDate: log.date_started,
          finishedDate: log.date_finished,
          timestamp: new Date(log.date_started).getTime(),
          isReread: log.is_reread,
          bookData: log.fanfics ? mapFanficToBook(log.fanfics) : null
        });
      }

      if (log.date_finished) {
        const actions = ['Finished'];
        if (review?.review_text) actions.push('Reviewed');
        if (review?.session_rating) actions.push('Rated');
        
        activities.push({
          id: `log-${log.id}`,
          bookTitle: log.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${log.fic_id}`,
          actions,
          finishedDate: log.date_finished,
          startedDate: log.date_started,
          rating: review?.session_rating,
          review: review?.review_text,
          timestamp: new Date(log.date_finished).getTime(),
          isReread: log.is_reread,
          bookData: log.fanfics ? mapFanficToBook(log.fanfics) : null
        });
      }
    });
  }
  
  standaloneReviews.forEach((review: any) => {
      const actions = [];
      if (review.review_text) actions.push('Reviewed');
      if (review.session_rating) actions.push('Rated');
      
      if (actions.length > 0) {
        activities.push({
          id: `review-${review.id}`,
          bookTitle: review.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${review.fic_id}`,
          actions,
          rating: review.session_rating,
          review: review.review_text,
          timestamp: new Date(review.created_at).getTime(),
          bookData: review.fanfics ? mapFanficToBook(review.fanfics) : null
        });
      }
  });

  if (bookmarksRes.data) {
    bookmarksRes.data.forEach((bm: any) => {
      activities.push({
        id: `bm-${bm.id}`,
        bookTitle: bm.fanfics?.title || 'Unknown Fic',
        bookKey: `/works/${bm.fic_id}`,
        actions: ['Bookmarked'],
        timestamp: new Date(bm.created_at).getTime(),
        bookData: bm.fanfics ? mapFanficToBook(bm.fanfics) : null
      });
    });
  }

  if (ficsRes.data) {
    ficsRes.data.forEach((fic: any) => {
      if (fic.date_started) {
        activities.push({
          id: `start-${fic.id}`,
          bookTitle: fic.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${fic.fic_id}`,
          actions: ['Started'],
          startedDate: fic.date_started,
          timestamp: new Date(fic.date_started).getTime(),
          bookData: fic.fanfics ? mapFanficToBook(fic.fanfics) : null
        });
      }
      
      if (fic.reading_status === 'readlist') {
        activities.push({
          id: `readlist-${fic.id}`,
          bookTitle: fic.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${fic.fic_id}`,
          actions: ['Added to Readlist'],
          timestamp: new Date(fic.created_at).getTime(),
          bookData: fic.fanfics ? mapFanficToBook(fic.fanfics) : null
        });
      }

      if (fic.is_loved) {
        activities.push({
          id: `love-${fic.id}`,
          bookTitle: fic.fanfics?.title || 'Unknown Fic',
          bookKey: `/works/${fic.fic_id}`,
          actions: ['Loved'],
          timestamp: new Date(fic.created_at).getTime(),
          bookData: fic.fanfics ? mapFanficToBook(fic.fanfics) : null
        });
      }
    });
  }

  activities.sort((a, b) => b.timestamp - a.timestamp);
  return activities;
};

export const getUserBookmarks = async (userId: string): Promise<{ book: Book, count: number }[]> => {
  const { data, error } = await supabase
    .from('bookmarks')
    .select('fic_id, fanfics(*)')
    .eq('user_id', userId);
    
  if (error || !data) return [];
  
  const grouped = data.reduce((acc: any, row: any) => {
    const ficId = row.fic_id;
    if (!acc[ficId]) {
      acc[ficId] = { book: mapFanficToBook(row.fanfics), count: 0 };
    }
    acc[ficId].count += 1;
    return acc;
  }, {});
  
  return Object.values(grouped);
};

export const getUserJournal = async (userId: string): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('user_fics')
    .select('fic_id, fanfics(*)')
    .eq('user_id', userId)
    .eq('reading_status', 'finished');
    
  if (error || !data) return [];
  
  return data.map((row: any) => mapFanficToBook(row.fanfics));
};

export const getRecentFanfics = async (limit = 20): Promise<Book[]> => {
  const { data, error } = await supabase
    .from('fanfics')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent fics:", error);
  }
  if (error || !data) return [];
  return data.map(mapFanficToBook);
};
