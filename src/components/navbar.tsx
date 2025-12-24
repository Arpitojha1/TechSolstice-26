"use client";

import NavBar from "./ui/tubelight-navbar";
import { Home, Calendar, Ticket, Mail, User } from "lucide-react";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Events", url: "/events", icon: Calendar },
  { name: "Passes", url: "/passes", icon: Ticket },
  { name: "Contact", url: "/contact", icon: Mail },
  { name: "Profile", url: "/profile", icon: User },
];

// Always render the navbar; the visual is fixed/sticky in `NavBar` itself.
export function TechSolsticeNavbar() {
  return <NavBar items={navItems} />;
}

export default TechSolsticeNavbar;
