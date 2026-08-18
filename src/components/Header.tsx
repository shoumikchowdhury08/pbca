import React from "react";
import { ArrowUpRight, Menu } from "lucide-react";
import { NavigationProps } from "@/types/types";

function Header({ nav }: NavigationProps) {
  return (
    <header className="site-header">
      <a className="brand" href="#home">
        <span className="brand-mark">✦</span>
        <span>
          <b>PBCA</b>
          <em>Parsi Bay Cultural Association</em>
        </span>
      </a>
      <nav>
        {nav.map((item) => (
          <a href={`#${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <button className="menu-button" aria-label="Open menu">
        <Menu size={20} />
      </button>
      <a className="header-cta" href="#contact">
        Join us <ArrowUpRight size={15} />
      </a>
    </header>
  );
}

export default Header;
