import React from "react";
import styles from './Header.module.css'
import Link from "next/link";
import Image from "next/image";

export default function Header() {

    return (
        <header className={styles.ubLandingHeader}>
            <div className={styles.ubLandingInner}>

                <nav className={styles.ubLandingNav}>
                    <Link href={"/"} style={{display: 'flex'}}>
                        <Image className={styles.headerLogo} src={'/logo.png'}
                               alt={'Logo de la Universidad de Belgrano'} priority/>
                    </Link>
                    <Link href="/">Inicio</Link>
                    <Link href="/#carreras">Carreras</Link>
                    <Link href="/repositorio">Repositorio Ciencias y Tecnologías</Link>
                    <Link href="https://www.ub.edu.ar">Universidad</Link>
                    <Link href="https://repositorio.ub.edu.ar">Repositorio universitario</Link>
                    <Link href="/contacto">Contacto</Link>
                </nav>
            </div>
        </header>
    );
}