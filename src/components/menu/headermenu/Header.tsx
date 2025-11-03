import React from "react";
import styles from './Header.module.css'
import Link from "next/link";
import Image from "next/image";

export default function Header() {

    return (
        <header className={styles['ub-landing-header']}>
            <div className={styles['ub-landing-inner']}>

                <nav className={styles['ub-landing-nav']}>
                    <div className={styles.leftLinks}>
                        <Link href={"/"} style={{display: 'flex'}}>
                            <Image className={styles['header-logo']} src={'/UBLogo.png'} height={40} width={50}
                                   alt={'Logo de la Universidad de Belgrano'} priority/>
                        </Link>
                        <Link href="/">Inicio</Link>
                        <Link href="/#carreras">Carreras</Link>
                        <Link href="/repositorio">Repositorio FITI</Link>
                        <Link href="/contacto">Contacto</Link>
                    </div>
                    <div className={styles.rightLinks}>
                        <Link href="https://www.ub.edu.ar">Universidad ↗</Link>
                        <Link href="https://repositorio.ub.edu.ar">Repositorio universitario ↗</Link>
                    </div>
                </nav>
            </div>
        </header>
    );
}