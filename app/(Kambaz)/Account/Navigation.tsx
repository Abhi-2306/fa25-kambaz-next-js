"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Nav, NavItem, NavLink } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
    const { currentUser } = useSelector((state: RootState) => state.accountReducer);
    const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
    const pathname = usePathname();

    return (
        <Nav className="flex-column">
            {links.map((link) => (
                <NavItem key={link} className="position-relative d-flex">
                    {pathname.toLowerCase().includes(link.toLowerCase()) && (
                        <div
                            className="bg-black"
                            style={{
                                width: "5px",
                                height: "40px",
                                position: "absolute",
                                left: "-20px",
                                top: "50%",
                                transform: "translateY(-50%)"
                            }}
                        />
                    )}
                    <NavLink
                        as={Link}
                        href={`/Account/${link}`}
                        className="text-danger text-decoration-none border-0"
                        style={{
                            backgroundColor: "transparent",
                            borderRadius: 0
                        }}
                    >
                        {link}
                    </NavLink>
                </NavItem>
            ))}
        </Nav>
    );
}