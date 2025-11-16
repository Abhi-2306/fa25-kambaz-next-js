/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
    const [user, setUser] = useState<any>({
        username: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT"
    });
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

    const signup = async () => {
        if (user.password !== user.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { confirmPassword, ...signupData } = user;
            const currentUser = await client.signup(signupData);
            dispatch(setCurrentUser(currentUser));
            router.push("/Account/Profile");
        } catch (error: any) {
            setError(error.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="d-flex min-vh-100">
            <div id="wd-signin-screen" style={{ width: "300px" }}>
                <h1>Sign up</h1>

                {error && (
                    <div className="alert alert-danger mb-2">
                        {error}
                    </div>
                )}

                <FormControl
                    id="wd-username"
                    placeholder="Username"
                    className="mb-2"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />

                <FormControl
                    id="wd-password"
                    placeholder="Password"
                    type="password"
                    className="mb-2"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />

                <FormControl
                    id="wd-confirm-password"
                    placeholder="Confirm Password"
                    type="password"
                    className="mb-2"
                    value={user.confirmPassword}
                    onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
                />

                <button
                    id="wd-signup-btn"
                    onClick={signup}
                    className="btn btn-primary w-100 mb-2">
                    Sign up
                </button>

                <Link id="wd-signin-link" href="/Account/Signin">
                    Sign in
                </Link>
            </div>
        </div>
    );
}