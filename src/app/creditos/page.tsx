import React from "react";
import Link from "next/link";
import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";

import { FaLinkedin, FaGithub, FaEnvelope } from "react-icons/fa";

import styles from "./page.module.css";
import bannerStyles from "@/components/banner/Banner.module.css";

export default function Creditos() {
    return (
        <>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>
                    Créditos
                </h1>
                <h3 className={bannerStyles["hero-sub"]}>
                    Conocé a las personas detrás de este proyecto
                </h3>
            </Banner>

            <Container
                id="credits-info"
                crumb={[
                    "Créditos",
                    <Link key={"Equipo"} id="equipo" href="#creditos">
                        Equipo
                    </Link>,
                ]}
            >
                <div id="creditos" className={styles["credits-main"]}>
                    <h2 className={styles["credits-title"]}>
                        Equipo de desarrollo
                    </h2>

                    <ul className={styles["credits-list"]}>
                        <li className={styles["credits-item"]}>
                            <div className={styles["credits-header"]}>
                                <div className={styles["credits-text"]}>
                                    <span className={styles["credits-name"]}>
                                        Gerardo Wacker
                                    </span>
                                    <span className={styles["credits-role"]}>
                                        Desarrollador Frontend
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://www.linkedin.com/in/gerardowacker/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <FaLinkedin />
                                    </a>
                                    <a
                                        href="https://github.com/gerardowacker"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="mailto:gerardo@wacker.com.ar"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope />
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className={styles["credits-item"]}>
                            <div className={styles["credits-header"]}>
                                <div className={styles["credits-text"]}>
                                    <span className={styles["credits-name"]}>
                                        Chiara Brunella Tanzi
                                    </span>
                                    <span className={styles["credits-role"]}>
                                        Desarrollador Frontend
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://www.linkedin.com/in/chiara-brunella-tanzi-2656852b6/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <FaLinkedin />
                                    </a>
                                    <a
                                        href="https://github.com/TheLampT"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="mailto:tanzichia@yahoo.com.ar"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope />
                                    </a>
                                </div>
                            </div>
                        </li>
                        <li className={styles["credits-item"]}>
                            <div className={styles["credits-header"]}>
                                <div className={styles["credits-text"]}>
                                    <span className={styles["credits-name"]}>
                                        Joaquin Tiviroli
                                    </span>
                                    <span className={styles["credits-role"]}>
                                        Desarrollador Frontend
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://github.com/jtiviroli"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub />
                                    </a>
                                    <a
                                        href="mailto:joaquintiviroli@gmail.com"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope />
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <section className={styles["project-info"]}>
                        <h3 className={styles["project-title"]}>Sobre el proyecto</h3>
                        <p className={styles["project-text"]}>
                            Este sitio fue desarrollado como parte de un proyecto académico
                            de la facultad. El código fuente se encuentra disponible en el 
                            siguiente repositorio:
                        </p>

                        <ul className={styles["project-links"]}>
                            <li>
                                Frontend y Backend:&nbsp;
                                <a
                                    href="https://github.com/gerardowacker/conexionub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    https://github.com/gerardowacker/conexionub
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </Container>
        </>
    );
}
