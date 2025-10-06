import Link from "next/link";
import { FormControl, Form } from "react-bootstrap";

export default function Profile() {
    return (
        <div className="d-flex min-vh-100">
            <div id="wd-profile-screen" style={{ width: "300px" }}>
                <h1>Profile</h1>
                <FormControl
                    id="wd-username"
                    placeholder="Username"
                    defaultValue="alice"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <FormControl
                    id="wd-password"
                    placeholder="Password"
                    type="password"
                    defaultValue="123"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <FormControl
                    id="wd-firstname"
                    placeholder="First Name"
                    defaultValue="Alice"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <FormControl
                    id="wd-lastname"
                    placeholder="Last Name"
                    defaultValue="Wonderland"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <FormControl
                    id="wd-dob"
                    type="date"
                    defaultValue="mm/dd/yyyy"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <FormControl
                    id="wd-email"
                    type="email"
                    placeholder="Email"
                    defaultValue="alice@wonderland"
                    className="mb-2"
                    suppressHydrationWarning={true}
                />
                <Form.Select
                    id="wd-role"
                    defaultValue="USER"
                    className="mb-2"
                    suppressHydrationWarning={true}
                >
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="FACULTY">Faculty</option>
                    <option value="STUDENT">Student</option>
                </Form.Select>
                <Link
                    href="/Account/Signin"
                    className="btn btn-danger w-100">
                    Sign out
                </Link>
            </div>
        </div>
    );
}