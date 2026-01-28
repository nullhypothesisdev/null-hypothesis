// ==========================================
// NEW DATA FETCHING UTILITIES
// ==========================================
// Replace old queries with new normalized schema

import { supabase } from './supabase';
import type {
    Lab,
    LabWithContent,
    Project,
    ProjectWithContent,
    Course,
    CourseWithChapters,
    Locale,
    TranslationsByNamespace,
    UITranslations,
} from './types';

// ==========================================
// LABS
// ==========================================

export async function fetchLabs(options: {
    publishedOnly?: boolean;
    featured?: boolean;
    limit?: number;
} = {}) {
    let query = supabase
        .from('labs')
        .select('*')
        .order('published_at', { ascending: false });

    if (options.publishedOnly) {
        query = query.eq('published', true);
    }

    if (options.featured) {
        query = query.eq('is_featured', true);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Lab[];
}

export async function fetchLabBySlug(slug: string, locale: Locale = 'en'): Promise<LabWithContent | null> {
    // 1. Fetch lab metadata
    const { data: lab, error: labError } = await supabase
        .from('labs')
        .select('*')
        .eq('slug', slug)
        .single();

    if (labError || !lab) return null;

    // 2. Fetch content reference
    const { data: contentRef, error: contentError } = await supabase
        .from('lab_content')
        .select('storage_path')
        .eq('lab_id', lab.id)
        .eq('locale', locale)
        .single();

    if (contentError || !contentRef) {
        return lab as LabWithContent;
    }

    // 3. Fetch MDX from Storage
    const { data: mdxData, error: storageError } = await supabase.storage
        .from('content')
        .download(contentRef.storage_path);

    if (storageError || !mdxData) {
        return lab as LabWithContent;
    }

    const mdxContent = await mdxData.text();

    return {
        ...lab,
        [`content_${locale}`]: mdxContent,
    } as LabWithContent;
}

// ==========================================
// PROJECTS
// ==========================================

export async function fetchStudies(options: {
    publishedOnly?: boolean;
    category?: string;
    limit?: number;
} = {}) {
    let query = supabase
        .from('projects')
        .select('*')
        .order('published_at', { ascending: false });

    if (options.publishedOnly) {
        query = query.eq('published', true);
    }

    if (options.category) {
        query = query.eq('category', options.category);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Project[];
}

export async function fetchStudyBySlug(slug: string, locale: Locale = 'en'): Promise<ProjectWithContent | null> {
    // 1. Fetch project metadata
    const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', slug)
        .single();

    if (projectError || !project) return null;

    // 2. Fetch content reference
    const { data: contentRef, error: contentError } = await supabase
        .from('project_content')
        .select('storage_path')
        .eq('project_id', project.id)
        .eq('locale', locale)
        .single();

    if (contentError || !contentRef) {
        return project as ProjectWithContent;
    }

    // 3. Fetch MDX from Storage
    const { data: mdxData, error: storageError } = await supabase.storage
        .from('content')
        .download(contentRef.storage_path);

    if (storageError || !mdxData) {
        return project as ProjectWithContent;
    }

    const mdxContent = await mdxData.text();

    return {
        ...project,
        [`content_${locale}`]: mdxContent,
    } as ProjectWithContent;
}

// ==========================================
// COURSES
// ==========================================

export async function fetchCourses(publishedOnly: boolean = true) {
    let query = supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

    if (publishedOnly) {
        query = query.eq('published', true);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Course[];
}

export async function fetchCourseWithChapters(slug: string): Promise<CourseWithChapters | null> {
    // 1. Fetch course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (courseError || !course) return null;

    // 2. Fetch chapters
    const { data: chapters, error: chaptersError } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('chapter_number', { ascending: true });

    if (chaptersError) {
        return {
            ...course,
            chapters: [],
        } as CourseWithChapters;
    }

    return {
        ...course,
        chapters: chapters || [],
    } as CourseWithChapters;
}

// ==========================================
// UI TRANSLATIONS
// ==========================================

// Cache translations in memory
const translationCache = new Map<string, Record<string, string>>();

export async function fetchTranslations<T extends keyof TranslationsByNamespace>(
    namespace: T,
    locale: Locale = 'en'
): Promise<TranslationsByNamespace[T]> {
    // Check cache first (Key now includes locale to keep consumer API consistent)
    const cacheKey = `${namespace}:${locale}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey) as unknown as TranslationsByNamespace[T];
    }

    // Fetch from database (Single row per namespace)
    const { data, error } = await supabase
        .from('ui_translations')
        .select('translations')
        .eq('namespace', namespace)
        .single();

    if (error || !data) {
        console.warn(`Translation not found: ${namespace}`);
        return {} as TranslationsByNamespace[T];
    }

    // Extract specific locale
    // @ts-ignore
    const localeTranslations = data.translations[locale] || data.translations['en'] || {};

    // Cache and return
    translationCache.set(cacheKey, localeTranslations);
    return localeTranslations as unknown as TranslationsByNamespace[T];
}

// Helper to get a single translation key
export async function t(namespace: keyof TranslationsByNamespace, key: string, locale: Locale = 'en'): Promise<string> {
    const translations = await fetchTranslations(namespace, locale);
    return translations[key as keyof typeof translations] || key;
}

// ==========================================
// SITE CONFIG
// ==========================================

const configCache = new Map<string, any>();

export async function fetchSiteConfig<T = any>(key: string): Promise<T | null> {
    // Check cache
    if (configCache.has(key)) {
        return configCache.get(key) as T;
    }

    // Fetch from database
    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', key)
        .single();

    if (error || !data) return null;

    // Cache and return
    configCache.set(key, data.value);
    return data.value as T;
}

// ==========================================
// MEDIA LIBRARY
// ==========================================

export async function fetchMedia(options: {
    limit?: number;
    mimeType?: string;
} = {}) {
    let query = supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

    if (options.limit) {
        query = query.limit(options.limit);
    }

    if (options.mimeType) {
        query = query.eq('mime_type', options.mimeType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data;
}

export async function uploadMedia(file: File, metadata?: {
    alt_text?: string;
    caption?: string;
}) {
    // 1. Upload to storage
    const fileName = `${Date.now()}-${file.name}`;
    const storagePath = `media/${new Date().getFullYear()}/${String(new Date().getMonth() + 1).padStart(2, '0')}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(storagePath, file);

    if (uploadError) throw uploadError;

    // 2. Create media record
    const { data, error: insertError } = await supabase
        .from('media')
        .insert({
            filename: file.name,
            storage_path: storagePath,
            mime_type: file.type,
            file_size: file.size,
            alt_text: metadata?.alt_text,
            caption: metadata?.caption,
        })
        .select()
        .single();

    if (insertError) throw insertError;

    return data;
}
