"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import CourseCard from "./CourseCard";

interface Course {
    id: string;
    slug: string;
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    difficulty: string;
    estimated_hours: number;
    published: boolean;
    cover_image_url?: string;
}

interface CoursesGridProps {
    courses: Course[];
}

export default function CoursesGrid({ courses }: CoursesGridProps) {
    return (
        <>
            {/* Grid */}
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.length > 0 ? (
                    courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-32 text-center border border-dashed border-ink/10 rounded-sm flex flex-col items-center justify-center bg-paper">
                        <div className="w-16 h-16 bg-ink/5 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-6 h-6 text-ink/30" />
                        </div>
                        <p className="font-serif text-ink/40 text-xl italic">
                            Courses coming soon...
                        </p>
                    </div>
                )}
            </motion.div>
        </>
    );
}
