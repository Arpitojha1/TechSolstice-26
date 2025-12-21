"use client";

import NavBar from "./ui/tubelight-navbar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Home, Calendar, Ticket, Mail } from "lucide-react"

const navItems = [
  { name: "Home", url: "#home", icon: Home },
  { name: "Events", url: "events", icon: Calendar },
  { name: "Passes", url: "passes", icon: Ticket },
  { name: "Contact", url: "contact", icon: Mail },
]

export function TechSolsticeNavbar() {
  // Show navbar only on tablet and larger (>=768px)
  const isTabletOrLarger = useMediaQuery("(min-width: 768px)")

  if (!isTabletOrLarger) return null

  return <NavBar items={navItems} />
}

export default TechSolsticeNavbar