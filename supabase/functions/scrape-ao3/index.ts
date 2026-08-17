import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url || !url.includes('archiveofourown.org/works/')) {
      throw new Error('Invalid AO3 URL');
    }

    // Append ?view_adult=true to bypass adult content warning if not present
    let fetchUrl = url;
    if (!fetchUrl.includes('view_adult=true')) {
      fetchUrl += fetchUrl.includes('?') ? '&view_adult=true' : '?view_adult=true';
    }

    const response = await fetch(fetchUrl, {
      headers: {
        'Cookie': 'view_adult=true',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch AO3 page: ${response.statusText}`);
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');

    if (!doc) {
      throw new Error('Failed to parse HTML');
    }

    // Extraction helpers
    const getText = (selector: string) => doc.querySelector(selector)?.textContent?.trim() || '';
    const getList = (selector: string) => {
      const nodes = doc.querySelectorAll(selector);
      const list: string[] = [];
      for (const node of nodes) {
        if (node.textContent) list.push(node.textContent.trim());
      }
      return list;
    };

    // Scrape fields
    const title = getText('.title.heading');
    const authors = getList('a[rel="author"]');
    const fandoms = getList('.fandom.tags a.tag');
    const relationships = getList('.relationship.tags a.tag');
    const warnings = getList('.warning.tags a.tag');
    const categories = getList('.category.tags a.tag');
    
    // Synopsis/Summary
    const summaryNode = doc.querySelector('.summary blockquote.userstuff');
    const synopsis = summaryNode ? summaryNode.innerHTML.trim() : '';

    // Stats
    const wordCountStr = getText('dd.words');
    const wordCount = wordCountStr ? parseInt(wordCountStr.replace(/,/g, ''), 10) : 0;
    
    const chaptersStr = getText('dd.chapters');
    let currentChapters = 0;
    let totalChapters = 0;
    if (chaptersStr) {
      const parts = chaptersStr.split('/');
      currentChapters = parseInt(parts[0], 10) || 0;
      totalChapters = parts[1] === '?' ? 0 : (parseInt(parts[1], 10) || 0);
    }

    const rating = getText('dd.rating a');
    const language = getText('dd.language');
    const kudosStr = getText('dd.kudos');
    const kudos = kudosStr ? parseInt(kudosStr.replace(/,/g, ''), 10) : 0;
    
    const publishedDate = getText('dd.published');
    const lastUpdatedDate = getText('dd.status'); // "Updated:" field

    const completionStatus = (totalChapters > 0 && currentChapters === totalChapters) || getText('dt.completed') ? 'completed' : 'ongoing';

    const metadata = {
      title,
      authors,
      fandoms,
      relationships,
      archive_warnings: warnings,
      category: categories,
      synopsis,
      word_count: wordCount,
      current_chapters: currentChapters,
      total_chapters: totalChapters,
      ao3_rating: rating,
      language,
      kudos,
      published_date: publishedDate || null,
      last_updated_date: lastUpdatedDate || null,
      completion_status: completionStatus
    };

    return new Response(JSON.stringify(metadata), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
