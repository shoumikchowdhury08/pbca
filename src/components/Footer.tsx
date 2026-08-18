import React from "react";
import Link from "next/link";
import { NavigationProps } from "@/types/types";

function Footer({ nav }: NavigationProps) {
  return (
    <footer>
      <div className="footer-top">
        <Link className="brand footer-brand" href="/">
          <span className="brand-mark">✦</span>
          <span>
            <b>PBCA</b>
            <em>Poorva Bangalore Cultural Association</em>
          </span>
        </Link>
        <p>
          Keeping culture close.
          <br />
          Making room for everyone.
        </p>
        <div className="socials">
          <a href="https://instagram.com" aria-label="Instagram">
            ig
          </a>
          <a href="https://facebook.com" aria-label="Facebook">
            f
          </a>
          <a href="https://youtube.com" aria-label="YouTube">
            yt
          </a>
        </div>
      </div>
      <div className="footer-links">
        <div>
          <b>Explore</b>
          {nav.slice(1, 5).map((item) => (
            <Link href={`/${item.toLowerCase().replace(/\s+/g, "-")}`} key={item}>
              {item}
            </Link>
          ))}
        </div>
        <div>
          <b>Recent notes</b>
          <a href="#blogs">Why we return, every year</a>
          <a href="#blogs">A recipe for belonging</a>
          <a href="#blogs">Meet the makers</a>
        </div>
        <div>
          <b>Visit</b>
          <span>
            PBCA Cultural Hall
            <br />
            Mumbai, India
          </span>
          <a href="mailto:hello@pbca.org">hello@pbca.org</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 PBCA. Made with devotion.</span>
        <span>Privacy · Terms</span>
      </div>
    </footer>
  );
}

export default Footer;
