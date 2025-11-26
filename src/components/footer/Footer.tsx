import React from "react";
import Image from "next/image";
import Link from "next/link";
import {Facebook, Twitter, Instagram, Linkedin, Youtube} from "lucide-react"
import styles from "./Footer.module.css";
import {getDeploymentInfo} from "@/app/vercel";

export default async function Footer() {
    const commit = await getDeploymentInfo()

    return (
        <footer className={styles.footer}>
            <div className={styles.separator}/>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <div className={styles.brandRow}>
                        <Image
                            src="/UBLogo.png"
                            alt="Universidad de Belgrano"
                            width={65}
                            height={55}
                            className={styles.logo}
                            priority
                        />
                    </div>
                    <div className={styles.socialIcons}>
                        <a href="https://www.facebook.com/universidaddebelgrano" target="_blank"
                           rel="noopener noreferrer" aria-label="Facebook" className={styles.socialLink}>
                            <Facebook className={styles.socialIcon}/>
                        </a>
                        <a href="https://www.instagram.com/universidadbelgrano" target="_blank"
                           rel="noopener noreferrer" aria-label="Instagram" className={styles.socialLink}>
                            <Instagram className={styles.socialIcon}/>
                        </a>
                        <Link href="https://x.com/ubeduar?lang=es" target="_blank" rel="noopener noreferrer"
                              aria-label="X (Twitter)">
                            <Twitter className={styles.socialIcon}/>
                        </Link>
                        <a href="https://www.linkedin.com/school/universidad-de-belgrano/posts/?feedView=all"
                           target="_blank" rel="noopener noreferrer" aria-label="Linkedin"
                           className={styles.socialLink}>
                            <Linkedin className={styles.socialIcon}/>
                        </a>
                        <a href="https://www.youtube.com/user/UniversidadBelgrano" target="_blank"
                           rel="noopener noreferrer" aria-label="Youtube" className={styles.socialLink}>
                            <Youtube className={styles.socialIcon}/>
                        </a>
                    </div>
                </div>

                <nav className={styles.columns} aria-label="Footer">
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Carreras</h4>
                        <ul className={styles.list}>
                            <li><Link href="/carreras/ingenieria-informatica">Ing. Informática</Link></li>
                            <li><Link href="/carreras/farmacia">Farmacia</Link></li>
                            <li><Link href="/carreras/programacion-en-computadoras">Prog. de computadoras</Link></li>
                        </ul>
                    </div>
                    <div className={styles.col}>
                        <h4 className={styles.colTitle} aria-hidden="true">
                            &nbsp;
                        </h4>
                        <ul className={styles.list}>
                            <li><Link href="/carreras/ciencias-biologicas">Cs. biológicas</Link></li>
                            <li><Link href="/carreras/nutricion">Nutrición</Link></li>
                            <li><Link href="/carreras/diseno-animacion-digital">Dis. y animación digital</Link></li>
                        </ul>
                    </div>
                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Repositorio</h4>
                        <ul className={styles.list}>
                            <li><Link href="/repositorio">Últimas entradas</Link></li>
                            <li><Link href="/repositorio/colecciones">Colecciones</Link></li>
                            <li><Link href="/repositorio/recursos">Recursos</Link></li>
                            <li><Link href="/repositorio/iniciar-sesion">Iniciar sesión</Link></li>
                        </ul>
                    </div>

                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Contacto</h4>
                        <ul className={styles.list}>
                            <li><Link href="/contacto">Contacto</Link></li>
                            <li><Link href="/contacto#ubicacion">Ubicación</Link></li>
                        </ul>
                    </div>

                    <div className={styles.col}>
                        <h4 className={styles.colTitle}>Acerca de</h4>
                        <ul className={styles.list}>
                            <li><Link href="/creditos">Créditos</Link></li>
                            <li><Link href="https://github.com/gerardowacker/conexionub" target="_blank">Código
                                fuente</Link></li>
                            <Link href={"https://github.com/gerardowacker/conexionub/commit/" + commit.commitId}
                                  className={styles.buildTag} title="Versión del sitio">
                                {commit.commitId} — {commit.environment}
                            </Link>
                            <p><strong>{'</>'} Hecho por estudiantes </strong></p>
                            <li className={styles.note}>
                                © Los logotipos y las siglas UB son propiedad de la Fundación Universidad de Belgrano
                                Dr. Avelino Porto
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

        </footer>
    );
}
