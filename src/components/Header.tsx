"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationProps } from "@/types/types";
import Image from "next/image";

/** Matches the easing the rest of the site's motion work uses. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Width at which the header swaps the inline nav for the menu button. */
const MENU_BREAKPOINT = 800;

function Header({ nav }: NavigationProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const links = nav.map((item) => {
    const href =
      item === "Home" ? "/" : `/${item.toLowerCase().replace(/\s+/g, "-")}`;
    return {
      label: item,
      href,
      isActive: href === "/" ? pathname === "/" : pathname.startsWith(href),
    };
  });

  // Escape dismisses the dropdown and hands focus back to the button; a tap
  // outside the panel (including on the scrim) dismisses it as well.
  useEffect(() => {
    if (!menuOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (menuRef.current?.contains(target)) return;
      if (menuButtonRef.current?.contains(target)) return;
      setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [menuOpen]);

  // Rotating past the breakpoint brings the inline nav back, so drop the panel
  // rather than leave it stranded over the desktop layout.
  useEffect(() => {
    const query = window.matchMedia(`(min-width: ${MENU_BREAKPOINT + 1}px)`);
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setMenuOpen(false);
    }
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  const panelVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -14, scaleY: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: {
        duration: 0.34,
        ease: EASE,
        delayChildren: 0.06,
        staggerChildren: 0.045,
      },
    },
    exit: reduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          y: -10,
          scaleY: 0.97,
          transition: { duration: 0.2, ease: EASE },
        },
  };

  const itemVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
  };

  return (
    <header className="site-header">
      <Link className="brand" href="/">
        <span>
          <Image
            src="/PBCA-logo.png"
            alt="PBCA Logo"
            loading="lazy"
            width={65}
            height={65}
          />
        </span>
        <span>
          <b>PBCA</b>
          <em>Poorva Bangalore Cultural Association</em>
        </span>
      </Link>
      <nav>
        {links.map((link) => (
          <Link
            href={link.href}
            key={link.href}
            className={link.isActive ? "active" : undefined}
            aria-current={link.isActive ? "page" : undefined}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <button
        ref={menuButtonRef}
        type="button"
        className="menu-button"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={menuOpen ? "close" : "open"}
            className="menu-button-icon"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: -60, scale: 0.7 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : { opacity: 1, rotate: 0, scale: 1 }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, rotate: 60, scale: 0.7 }
            }
            transition={{ duration: 0.2, ease: EASE }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.span>
        </AnimatePresence>
      </button>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="scrim"
            className="mobile-nav-scrim"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26, ease: EASE }}
          />
        )}
        {menuOpen && (
          <motion.div
            ref={menuRef}
            key="panel"
            id="mobile-nav"
            className="mobile-nav"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {links.map((link) => (
              <motion.div key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  className={link.isActive ? "active" : undefined}
                  aria-current={link.isActive ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={15} />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      {/* <Link className="header-cta" href="/admin">
        Admin Portal <ArrowUpRight size={15} />
      </Link> */}
    </header>
  );
}

export default Header;
