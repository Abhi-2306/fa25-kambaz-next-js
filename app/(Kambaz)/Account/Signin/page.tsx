"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { loadEnrollmentsFromStorage } from "../../Enrollments/reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../Database";
import { FormControl, Button } from "react-bootstrap";

export default function Signin() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [credentials, setCredentials] = useState<any>({});
    const dispatch = useDispatch();
    const router = useRouter();

    const signin = async () => {
        const user = await client.signin(credentials);
        if (!user) return;
        dispatch(setCurrentUser(user));
        dispatch(loadEnrollmentsFromStorage());
        router.push("/Dashboard");
    };

    return (
        <div className="d-flex min-vh-100">
            <div id="wd-signin-screen" style={{ width: "300px" }}>
                <h1>Sign in</h1>
                <FormControl
                    value={credentials.username || ""}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    className="mb-2"
                    placeholder="username"
                    id="wd-username"
                />
                <FormControl
                    value={credentials.password || ""}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    className="mb-2"
                    placeholder="password"
                    type="password"
                    id="wd-password"
                />
                <Button
                    onClick={signin}
                    id="wd-signin-btn"
                    className="w-100 mb-2"
                >
                    Sign in
                </Button>
                <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
            </div>
        </div>
    );
}