export interface Profile {
  id: string; // uuid
  username: string | null;
  words_per_minute: number | null;
  created_at: string;
}

export interface Fanfic {
  id: string; // text - AO3 Work ID
  title: string | null;
  authors: string[] | null;
  synopsis: string | null;
  url: string | null;
  published_date: string | null;
  updated_date: string | null;
  word_count: number | null;
  chapters_published: number | null;
  chapters_total: number | null;
  kudos: number | null;
  rating: string | null;
  archive_warnings: string[] | null;
  categories: string[] | null;
  fandoms: string[] | null;
  relationships: string[] | null;
  additional_tags: string[] | null;
  language: string | null;
  completion_status: string | null;
}

export interface UserFic {
  id: string; // uuid
  user_id: string; // uuid
  fic_id: string; // text
  reading_status: string | null;
  custom_cover_url: string | null;
  is_loved: boolean | null;
  date_started: string | null;
  user_rating: number | null;
}

export interface Review {
  id: string; // uuid
  reading_log_id: string; // uuid
  user_id: string; // uuid
  fic_id: string; // text
  review_text: string | null;
  session_rating: number | null; // float4
  created_at: string; // timestamptz
}

export interface ReadingLog {
  id: string; // uuid
  user_id: string; // uuid
  fic_id: string; // text
  date_started: string | null; // date
  date_finished: string | null; // date
  is_reread: boolean | null;
}

export interface Bookmark {
  id: string; // uuid
  user_id: string; // uuid
  fic_id: string; // text
  chapter_number: number | null; // int
  note: string | null; // text
}
