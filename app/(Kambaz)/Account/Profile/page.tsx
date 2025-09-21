
import Link from "next/link";
export default function Profile() {
    return (
        <div id="wd-profile-screen">
            <h3>Profile</h3>
            <input suppressHydrationWarning={true} defaultValue="alice" placeholder="username" className="wd-username" /><br />
            <input suppressHydrationWarning={true} defaultValue="123" placeholder="password" type="password"
                className="wd-password" /><br />
            <input suppressHydrationWarning={true} defaultValue="Alice" placeholder="First Name" id="wd-firstname" /><br />
            <input suppressHydrationWarning={true} defaultValue="Wonderland" placeholder="Last Name" id="wd-lastname" /><br />
            <input suppressHydrationWarning={true} defaultValue="2000-01-01" type="date" id="wd-dob" /><br />
            <input suppressHydrationWarning={true} defaultValue="alice@wonderland" type="email" id="wd-email" /><br />
            <select suppressHydrationWarning={true} defaultValue="FACULTY" id="wd-role">
                <option value="USER">User</option>       <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option> <option value="STUDENT">Student</option>
            </select><br />
            <Link href="Signin" > Sign out </Link>
        </div>
    );
}
