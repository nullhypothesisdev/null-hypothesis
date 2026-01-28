// lib/types.ts

// --- NEW DATA STRUCTURES FOR LAB & PLATFORM ---

export interface PageRow {
  id: string; // generated ID (e.g. EXP-01)
  slug: string;
  title: string;
  titleAr?: string;
  category: string;
  categoryAr?: string;
  year: string;
  status: string;
  icon_name: string;
}

export interface SupabasePage {
  slug: string;
  title: string;
  category_label: string;
  icon_name: string;
  published_at: string;
  meta?: any;
}

export interface LabContext {
  [key: string]: any;
}

// ==========================================
// NEW DATABASE TYPES (Post-Migration)
// ==========================================

export interface Lab {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  tagline?: string;
  category?: string;
  icon_name?: string;
  difficulty?: string;
  reading_time?: number;
  is_featured: boolean;
  published: boolean;
  published_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LabContent {
  id: string;
  lab_id: string;
  locale: 'en' | 'ar';
  storage_path: string;  // Path to MDX in Supabase Storage
  last_edited_by?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  icon_name?: string;
  theme_color?: string;
  pdf_url?: string;
  source_url?: string;
  demo_url?: string;
  model_config?: Record<string, any>;  // JSONB
  title_ar?: string;
  tagline_ar?: string;
  category_ar?: string;
  metadata?: any; // JSONB
  is_featured: boolean;
  published: boolean;
  published_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectContent {
  id: string;
  project_id: string;
  locale: 'en' | 'ar';
  storage_path: string;
  last_edited_by?: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  title_ar?: string; // Confirmed by DB inspection
  description?: string;
  description_ar?: string; // Confirmed by DB inspection
  difficulty?: string;
  estimated_hours?: number;
  cover_image_url?: string;
  published: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  resources?: Record<string, any>; // Confirmed array of resources
}

export interface CourseChapter {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  chapter_number: number;
  estimated_minutes?: number;
  is_free: boolean;
  published: boolean;
  created_at: string;
  content_en?: string;
  content_ar?: string;
}


export interface Media {
  id: string;
  filename: string;
  storage_path: string;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  alt_text?: string;
  caption?: string;
  uploaded_by?: string;
  created_at: string;
}

export interface UITranslations {
  id: string;
  namespace: 'common' | 'nav' | 'footer' | 'lab' | 'projects' | 'courses' | 'header' | 'home' | 'exp' | 'sampling' | 'alpha' | 'bp';
  translations: Record<string, Record<string, string>>;  // JSONB: { en: {...}, ar: {...} }
  updated_at: string;
}

export interface SiteConfig {
  key: string;
  value: Record<string, any>;  // JSONB
  description?: string;
  updated_at: string;
}

// ==========================================
// COMBINED TYPES (with content)
// ==========================================

export interface LabWithContent extends Lab {
  content_en?: string;  // MDX string fetched from storage
  content_ar?: string;
}

export interface ProjectWithContent extends Project {
  content_en?: string;
  content_ar?: string;
}

export interface ChapterWithContent extends CourseChapter {
  content_en?: string;
  content_ar?: string;
}

export interface CourseWithChapters extends Course {
  chapters: ChapterWithContent[];
}

// ==========================================
// DATABASE QUERY HELPERS
// ==========================================

export type Locale = 'en' | 'ar';

export interface FetchLabOptions {
  locale?: Locale;
  includeContent?: boolean;
  publishedOnly?: boolean;
}

export interface FetchProjectOptions {
  locale?: Locale;
  includeContent?: boolean;
  publishedOnly?: boolean;
}

// ==========================================
// UI TRANSLATION TYPES
// ==========================================

// Type-safe translation keys per namespace
export interface CommonTranslations {
  back: string;
  next: string;
  start: string;
  reset: string;
  running: string;
  pause: string;
  download: string;
  view: string;
  send: string;
  sending: string;
  source: string;
  read_article: string;
  pdf: string;
}

export interface NavTranslations {
  home: string;
  laboratory: string;
  projects: string;
  courses: string;
  commission: string;
  academy: string;
  dossier: string;
  back_to_lab: string;
  back_to_archive: string;
}

export interface FooterTranslations {
  signal: string;
  research: string;
  laboratory: string;
  archive: string;
  showcase: string;
  open_commission: string;
  connect_email: string;
  github: string;
  resume: string;
}

export interface LabTranslations {
  status_calibrated: string;
  status_dormant: string;
  cta: string;
  badge: string;
  header_title: string;
  header_description: string;
}

export interface ProjectsTranslations {
  title: string;
  badge: string;
  description: string;
  status: string;
  status_live: string;
  empty: string;
  filter_all: string;
  filter_showcase: string;
  filter_design: string;
  filter_analysis: string;
}

// Namespace to type mapping
export type TranslationsByNamespace = {
  common: CommonTranslations;
  nav: NavTranslations;
  footer: FooterTranslations;
  lab: LabTranslations;
  projects: ProjectsTranslations;
};