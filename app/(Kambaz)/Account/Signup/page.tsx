import Link from "next/link";
import { FormControl } from "react-bootstrap";

export default function Signup() {
    return (
        <div className="d-flex min-vh-100">
            <div id="wd-signin-screen" style={{ width: "300px" }}>
                <h1>Sign up</h1>
                <FormControl
                    id="wd-username"
                    placeholder="Username"
                    className="mb-2"
                />
                <FormControl
                    id="wd-password"
                    placeholder="Password"
                    type="password"
                    className="mb-2"
                />
                <FormControl
                    id="wd-confirm-password"
                    placeholder="Confirm Password"
                    type="password"
                    className="mb-2"
                />
                <Link
                    id="wd-signup-btn"
                    href="/Account/Profile"
                    className="btn btn-primary w-100 mb-2">
                    Sign up
                </Link>
                <Link id="wd-signin-link" href="/Account/Signin">Sign in</Link>
            </div>
        </div>
    );
}