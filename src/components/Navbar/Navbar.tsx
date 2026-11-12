"use client";

import { useState } from "react";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeContext";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <Link href="/" className={styles.navbarBrand}>
          Portfolio
        </Link>

        <button
          type="button"
          className={styles.navbarToggle}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>

        <div
          className={`${styles.navbarLinks} ${
            isOpen ? styles.open : ""
          }`}
        >
          <Link href="/" className={styles.navbarLink} onClick={closeMenu}>
            Home
          </Link>

          <button
            type="button"
            className={styles.navbarThemeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className={styles.themeIcon} />
            ) : (
              <Sun className={styles.themeIcon} />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
