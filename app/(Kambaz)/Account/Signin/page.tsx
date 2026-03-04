"use client";
import * as client from "../client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { loadEnrollmentsFromStorage } from "../../Enrollments/reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
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

    const quickLogin = async (username: string, password: string) => {
        const user = await client.signin({ username, password });
        if (!user) return;
        dispatch(setCurrentUser(user));
        dispatch(loadEnrollmentsFromStorage());
        router.push("/Dashboard");
    };

    const testAccounts = [
        {
            username: "iron_man",
            password: "stark123",
            role: "FACULTY",
            name: "Tony Stark",
            description: "Create courses, assignments, and quizzes",
            color: "danger"
        },
        {
            username: "dark_knight",
            password: "wayne123",
            role: "STUDENT",
            name: "Bruce Wayne",
            description: "Enroll in courses and take quizzes",
            color: "primary"
        },
        {
            username: "ada",
            password: "123",
            role: "ADMIN",
            name: "Ada Lovelace",
            description: "Manage users and system settings",
            color: "warning"
        }
    ];

    return (
        <div className="d-flex min-vh-100">
            {/* Original Login Form - Left Side */}
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
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') signin();
                    }}
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

            {/* Demo Accounts - Right Side (No background, simple layout) */}
            <div className="flex-grow-1 p-4">
                <div style={{ maxWidth: "500px" }}>
                    <h5 className="mb-3">
                        <span className="badge bg-success me-2">Demo</span>
                        Quick Login - Test Accounts
                    </h5>
                    <p className="text-muted small mb-4">
                        Click any account below to explore different user roles
                    </p>

                    <div className="d-grid gap-3">
                        {testAccounts.map((account) => (
                            <div
                                key={account.username}
                                className="p-3 border rounded"
                                style={{ cursor: 'pointer' }}
                                onClick={() => quickLogin(account.username, account.password)}
                            >
                                <div className="d-flex align-items-start">
                                    <div className="flex-grow-1">
                                        <div className="d-flex align-items-center mb-1">
                                            <h6 className="mb-0 me-2">{account.name}</h6>
                                            <span className={`badge bg-${account.color}`}>
                                                {account.role}
                                            </span>
                                        </div>
                                        <p className="text-muted small mb-2">
                                            {account.description}
                                        </p>
                                        <div className="d-flex gap-3 small">
                                            <span className="text-muted">
                                                <strong>Username:</strong> <code>{account.username}</code>
                                            </span>
                                            <span className="text-muted">
                                                <strong>Password:</strong> <code>{account.password}</code>
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant={`outline-${account.color}`}
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            quickLogin(account.username, account.password);
                                        }}
                                    >
                                        Login
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="alert alert-info mt-4 mb-0 small">
                        <strong>💡 Tip:</strong> Try the Faculty account to create courses and quizzes,
                        then switch to Student to experience the learning side!
                    </div>
                </div>
            </div>
        </div>
    );
}