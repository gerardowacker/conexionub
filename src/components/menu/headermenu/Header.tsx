"use client";

import React, { useState } from "react";
import styles from "./Header.module.css";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={styles["ub-landing-header"]}>
      <div className={styles["ub-landing-inner"]}>
        <nav className={styles["ub-landing-nav"]}>
          <div className={styles.brandRow}>
            <Link href="/" className={styles.logoLink} onClick={closeMenu}>
              <Image
                className={styles["header-logo"]}
                src="/UBLogo.png"
                height={40}
                width={50}
                alt="Logo de la Universidad de Belgrano"
                priority
              />
            </Link>

            <button
              type="button"
              className={styles.burger}
              onClick={toggleMenu}
              aria-label="Abrir menú de navegación"
              aria-expanded={isOpen}
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
          </div>

          <div
            className={`${styles.linksRow} ${
              isOpen ? styles.linksRowOpen : ""
            }`}
          >
            <div className={styles.leftLinks}>
              <Link href="/" onClick={closeMenu}>
                Inicio
              </Link>
              <Link href="/#carreras" onClick={closeMenu}>
                Carreras
              </Link>
              <Link href="/repositorio" onClick={closeMenu}>
                Repositorio FITI
              </Link>
              <Link href="/contacto" onClick={closeMenu}>
                Contacto
              </Link>
            </div>

            <div className={styles.rightLinks}>
              <Link href="https://www.ub.edu.ar" target="_blank">
                Universidad ↗
              </Link>
              <Link href="https://repositorio.ub.edu.ar" target="_blank">
                Repositorio universitario ↗
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}