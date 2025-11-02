'use client';

import React, { useContext } from "react";
import styles from "./Sidebar.module.css";
import Link from "next/link";
import { SessionContext } from "@/context/SessionContext";

export default function Sidebar() {
  const session = useContext(SessionContext);
  const user = session?.user;
  const logout = session?.logout;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.block}>
        <h3 className={styles.title}>Mi cuenta</h3>
        {user ? (
          <>
            <p className={styles.email}>{user.email}</p>

              <div className={styles.buttonGroup}>
              <Link href="/perfil" className={styles.button}>
                Perfil
              </Link>
              {user.level >= 1 && (
              <Link href="/repositorio/admin" className={styles.button}>
                Panel de control
              </Link>
              )}
              <button onClick={() => logout?.()} className={styles.button}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <div className={styles.buttonGroup}>
            <Link href="/repositorio/iniciar-sesion" className={styles.button}>
              Iniciar sesión
            </Link>
            <Link href="/repositorio/crear-cuenta" className={styles.button}>
              Crear cuenta
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
