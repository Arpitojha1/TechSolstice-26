"use client";

import NavBar from "@/components/navigation/tubelight-navbar";
import { Home, Calendar, Ticket, Mail, User, Linkedin } from "lucide-react";

const navItems = [
  { name: "Home", url: "/", icon: Home },
  { name: "Events", url: "/events", icon: Calendar },
  { name: "Passes", url: "/passes", icon: Ticket },
  { name: "Socials", url: "/socials", icon: Linkedin },
  //{ name: "Profile", url: "/profile", icon: User },
  //{ name: "Help", url: "/help", icon: Mail },
];

// Always render the navbar; the visual is fixed/sticky in `NavBar` itself.
export function TechSolsticeNavbar() {
  return <NavBar items={navItems} />;
}

export default TechSolsticeNavbar;
