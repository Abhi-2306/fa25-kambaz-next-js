// import Link from "next/link";
// export default function TOC() {
//     return (
//         <ul>
//             <li>
//                 <Link href="/Labs" id="wd-lab1-link">
//                     Home </Link>
//             </li>
//             <li>
//                 <Link href="/Labs/Lab1" id="wd-lab1-link">
//                     Lab 1 </Link>
//             </li>
//             <li>
//                 <Link href="/Labs/Lab2" id="wd-lab2-link">
//                     Lab 2 </Link>
//             </li>
//             <li>
//                 <Link href="/Labs/Lab3" id="wd-lab3-link">
//                     Lab 3 </Link>
//             </li>
//             <li>
//                 <Link href="/" id="wd-lab3-link">
//                     Kambaz </Link>
//             </li>
//         </ul>
//     );
// }

import { Nav, NavItem, NavLink } from "react-bootstrap";
import Link from "next/link";
export default function TOC() {
    return (
        <Nav variant="pills">
            <NavItem>
                <NavLink href="/Labs" as={Link}>Labs</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/Labs/Lab1" as={Link}>Lab 1</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/Labs/Lab2" as={Link}>Lab 2</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/Labs/Lab3" as={Link}>Lab 3</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="/" as={Link}>Kambaz</NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="https://github.com/Abhi-2306">My GitHub</NavLink>
            </NavItem>
        </Nav>
    );
}
