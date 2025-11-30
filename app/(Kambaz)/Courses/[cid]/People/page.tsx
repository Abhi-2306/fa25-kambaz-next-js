/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PeopleTable from "./Table";
import * as client from "../../client";

export default function People() {
    const { cid } = useParams();
    const [users, setUsers] = useState<any[]>([]);

    const fetchUsersForCourse = async () => {
        try {
            const users = await client.findUsersForCourse(cid as string);
            setUsers(users);
        } catch (error) {
            console.error("Error fetching users for course:", error);
        }
    };

    useEffect(() => {
        fetchUsersForCourse();
    }, [cid]);

    return (
        <div className="p-4">
            <h3>People</h3>
            <PeopleTable users={users} fetchUsers={fetchUsersForCourse} />
        </div>
    );
}