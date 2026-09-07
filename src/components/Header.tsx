"use client";

import React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationProps } from "@/types/types";
import Image from "next/image";

function Header({ nav }: NavigationProps) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span>
          <Image
            src="/PBCA-logo.png"
            alt="PBCA Logo"
            loading="lazy"
            width={40}
            height={40}
          />
        </span>
        <span>
          <b>PBCA</b>
          <em>Poorva Bangalore Cultural Association</em>
        </span>
      </Link>
      <nav>
        {nav.map((item) => {
          const href =
            item === "Home"
              ? "/"
              : `/${item.toLowerCase().replace(/\s+/g, "-")}`;
          const isActive =
            href === "/" ? pathname === "/" : pathname.startsWith(href);

          return (
            <Link
              href={href}
              key={item}
              className={isActive ? "active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              {item}
            </Link>
          );
        })}
      </nav>
      <button className="menu-button" aria-label="Open menu">
        <Menu size={20} />
      </button>
      {/* <Link className="header-cta" href="/membership">
        Join us <ArrowUpRight size={15} />
      </Link> */}
    </header>
  );
}

export default Header;
