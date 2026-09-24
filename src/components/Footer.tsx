import React from "react";
import Link from "next/link";
import { NavigationProps } from "@/types/types";
import Image from "next/image";
import SocialIcons from "@/components/ui/socialIcons";

function Footer({ nav }: NavigationProps) {
  return (
    <footer>
      <div className="footer-top">
        <Link className="brand footer-brand" href="/">
          <span>
            <b>PBCA</b>
            <em>Poorva Bangalore Cultural Association</em>
          </span>
        </Link>
        <p>
          Celebrating Culture,
          <br />
          Welcoming All.
        </p>
        <div className="socials">
          <SocialIcons />
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
