"use client";
import React from "react";
import { usePathname, useParams } from "next/navigation";

export default function Breadcrumb({ course }: { course: { name: string } | undefined; }) {
    const pathname = usePathname();
    const { cid } = useParams();
    const pathAfterCourse = pathname.split(`/Courses/${cid}/`)[1] || "";
    const parts = pathAfterCourse ? pathAfterCourse.split("/") : [];

    return (
        <span>
            {course?.name} {parts.map(part => ` > ${part}`).join("")}
        </span>
    );
}