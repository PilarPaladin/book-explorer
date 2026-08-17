import { supabase } from './supabase';

export async function scrapeAo3Metadata(url: string) {
  const { data, error } = await supabase.functions.invoke('scrape-ao3', {
    body: { url },
  });

  if (error) {
    throw new Error(`Failed to scrape AO3: ${error.message || 'Unknown error'}`);
  }

  if (data?.error) {
    throw new Error(`Scraper error: ${data.error}`);
  }

  return data;
}

export function getAo3WorkId(url: string): string | null {
  const match = url.match(/works\/(\d+)/);
  return match ? match[1] : null;
}

export async function saveFanficToLibrary(ao3Url: string, metadata: any) {
  const workId = getAo3WorkId(ao3Url);
  
  if (!workId) {
    throw new Error('Invalid AO3 URL. Could not extract Work ID.');
  }

  // 1. Upsert into fanfics table
  const { error: fanficError } = await supabase
    .from('fanfics')
    .upsert({
      id: workId,
      url: ao3Url,
      title: metadata.title,
      authors: metadata.authors,
      synopsis: metadata.synopsis,
      word_count: metadata.word_count,
      relationships: metadata.relationships,
      fandoms: metadata.fandoms,
      archive_warnings: metadata.archive_warnings,
      categories: metadata.category,
      chapters_published: metadata.current_chapters,
      chapters_total: metadata.total_chapters,
      rating: metadata.ao3_rating,
      language: metadata.language,
      kudos: metadata.kudos,
      published_date: metadata.published_date,
      updated_date: metadata.last_updated_date,
      completion_status: metadata.completion_status,
    });

  if (fanficError) {
    console.error('Error upserting fanfic:', fanficError);
    throw fanficError;
  }
}
