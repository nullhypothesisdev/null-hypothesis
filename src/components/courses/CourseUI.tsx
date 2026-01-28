"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, BookOpen, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export function BackToCoursesLink() {
    const { t } = useLanguage();
    return (
        <Link href="/courses" className="inline-flex items-center gap-2 text-ink/50 hover:text-accent mb-8 transition-colors font-mono text-xs uppercase tracking-widest group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
            {t('courses.all_courses') || "All Courses"}
        </Link>
    );
}

export function CurriculumHeader() {
    const { t } = useLanguage();
    return (
        <h2 className="font-serif text-2xl text-ink mb-8 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-accent" />
            {t('courses.curriculum') || "Curriculum"}
        </h2>
    );
}

interface Resource {
    label: string;
    url: string;
    type: 'external_link' | 'download';
}

export function CourseResources({ resources }: { resources: Resource[] }) {
    const { t } = useLanguage();

    if (resources.length === 0) return null;

    // Helper to localize specific known labels without DB change
    const getLabel = (label: string) => {
        if (label === "Official Book Website") return t('courses.website') || label;
        if (label === "Official Datasets (Python)") return t('courses.datasets') || label;
        return label;
    };

    return (
        <div className="bg-paper border border-ink/10 rounded-sm p-6 shadow-sm">
            <h3 className="font-serif text-lg text-ink mb-4 border-b border-ink/10 pb-2">
                {t('courses.resources') || "Course Resources"}
            </h3>
            <ul className="space-y-3">
                {resources.map((res, idx) => (
                    <li key={idx}>
                        <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 text-sm text-ink/70 hover:text-accent transition-colors"
                        >
                            <span className="p-2 bg-ink/5 rounded-full group-hover:bg-accent/10 transition-colors">
                                {res.type === 'download' ? <Download className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
                            </span>
                            <span className="font-medium">{getLabel(res.label)}</span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

// Static scope data for now - in production this would be in the DB
const COURSE_SCOPES: Record<string, {
    what_is: { en: string[], ar: string[] },
    what_is_not: { en: string[], ar: string[] }
}> = {
    // Introduction to Statistical Learning
    "islp": {
        what_is: {
            en: [
                "Supervised Learning (Regression & Classification)",
                "Unsupervised Learning (PCA, Clustering)",
                "Model Selection & Regularization",
                "Tree-based Methods & SVMs"
            ],
            ar: [
                "التعلم تحت الإشراف (الانحدار والتصنيف)",
                "التعلم غير الخاضع للإشراف (PCA، التجميع)",
                "اختيار النموذج والتنظيم (Regularization)",
                "الأساليب القائمة على الأشجار و SVMs"
            ]
        },
        what_is_not: {
            en: [
                "Deep Learning / Neural Networks",
                "MLOps & Deployment",
                "Big Data Frameworks (Spark, etc)",
                "Reinforcement Learning"
            ],
            ar: [
                "التعلم العميق / الشبكات العصبية",
                "MLOps والنشر",
                "أطر البيانات الضخمة (Spark، وما إلى ذلك)",
                "التعلم المعزز"
            ]
        }
    }
    // Add other courses here
};

export function CourseScope({ slug }: { slug: string }) {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const scope = COURSE_SCOPES[slug];

    if (!scope) return null;

    const itemsIs = isAr ? scope.what_is.ar : scope.what_is.en;
    const itemsNot = isAr ? scope.what_is_not.ar : scope.what_is_not.en;

    return (
        <div className="bg-paper border border-ink/10 rounded-sm p-6 shadow-sm mt-8">
            {/* What it is */}
            <div className="mb-6">
                <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2">
                    <span className="text-emerald-600">✓</span> {t('lab.what_you_learn')}
                </h3>
                <ul className="space-y-2">
                    {itemsIs.map((item, i) => (
                        <li key={i} className="text-sm text-ink/70 flex items-start gap-2">
                            <span className="text-emerald-600/50 mt-1">•</span> {item}
                        </li>
                    ))}
                </ul>
            </div>

            {/* What it is NOT */}
            <div>
                <h3 className="font-serif text-lg text-ink mb-4 flex items-center gap-2 border-t border-ink/10 pt-4">
                    <span className="text-rose-600">✕</span> {t('lab.what_is_not')}
                </h3>
                <ul className="space-y-2">
                    {itemsNot.map((item, i) => (
                        <li key={i} className="text-sm text-ink/70 flex items-start gap-2">
                            <span className="text-rose-600/50 mt-1">•</span> {item}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
