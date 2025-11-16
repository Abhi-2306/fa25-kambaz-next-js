"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";

export default function Breadcrumb({ course }: { course: { name: string } | undefined }) {
    const pathname = usePathname();
    const { cid } = useParams();

    const coursePattern = `/Courses/${cid}`;
    const pathIndex = pathname.indexOf(coursePattern);

    if (pathIndex === -1) {
        return <span>{course?.name || "Course"}</span>;
    }

    const pathAfterCourse = pathname.substring(pathIndex + coursePattern.length);

    const cleanPath = pathAfterCourse.startsWith('/')
        ? pathAfterCourse.substring(1)
        : pathAfterCourse;

    const parts = cleanPath ? cleanPath.split('/').filter(part => part.length > 0) : [];

    const formattedParts = parts.map(part => {
        if (part === 'Home') return 'Home';
        if (part === 'Modules') return 'Modules';
        if (part === 'Assignments') return 'Assignments';
        if (part === 'Grades') return 'Grades';
        if (part === 'People') return 'People';

        return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    });

    return (
        <span>
            {course?.name || "Course"}
            {formattedParts.length > 0 && (
                <>
                    {formattedParts.map((part, index) => (
                        <span key={index}> &gt; {part}</span>
                    ))}
                </>
            )}
        </span>
    );
}