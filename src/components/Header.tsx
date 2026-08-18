import React from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";
import { NavigationProps } from "@/types/types";

function Header({ nav }: NavigationProps) {
  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span className="brand-mark">✦</span>
        <span>
          <b>PBCA</b>
          <em>Poorva Bangalore Cultural Association</em>
        </span>
      </Link>
      <nav>
        {nav.map((item) => (
          <Link href={item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
            {item}
          </Link>
        ))}
      </nav>
      <button className="menu-button" aria-label="Open menu">
        <Menu size={20} />
      </button>
      <Link className="header-cta" href="/membership">
        Join us <ArrowUpRight size={15} />
      </Link>
    </header>
  );
}

export default Header;
