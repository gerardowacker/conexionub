import React from "react";
import Link from "next/link";
import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";

import {FaLinkedin, FaGithub, FaEnvelope} from "react-icons/fa";

import styles from "./page.module.css";
import bannerStyles from "@/components/banner/Banner.module.css";

export default function Creditos() {
    return (
        <>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>
                    Créditos
                </h1>
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
                                        Project lead, desarrollo y despliegue
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://www.linkedin.com/in/gerardowacker/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <FaLinkedin/>
                                    </a>
                                    <a
                                        href="https://github.com/gerardowacker"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub/>
                                    </a>
                                    <a
                                        href="mailto:gerardo@wacker.com.ar"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope/>
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
                                        Diseño y desarrollo frontend
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://www.linkedin.com/in/chiara-brunella-tanzi-2656852b6/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="LinkedIn"
                                    >
                                        <FaLinkedin/>
                                    </a>
                                    <a
                                        href="https://github.com/TheLampT"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub/>
                                    </a>
                                    <a
                                        href="mailto:tanzichia@yahoo.com.ar"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope/>
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
                                        Diseño de contenido y testing
                                    </span>
                                </div>

                                <div className={styles["credits-icons"]}>
                                    <a
                                        href="https://github.com/jtiviroli"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="GitHub"
                                    >
                                        <FaGithub/>
                                    </a>
                                    <a
                                        href="mailto:joaquintiviroli@gmail.com"
                                        aria-label="Email"
                                    >
                                        <FaEnvelope/>
                                    </a>
                                </div>
                            </div>
                        </li>
                    </ul>
                    <section className={styles["project-info"]}>
                        <h3 className={styles["project-title"]}>Créditos y licencias del proyecto</h3>
                        <p className={styles["project-text"]}>
                            El presente sitio fue desarrollado dentro del marco de un proyecto
                            de la Universidad. El contenido y logotipos mostrados son propiedad
                            de la Fundación Universidad de Belgrano Dr. Avelino Porto, y es utilizado
                            con permiso previo.
                        </p>

                        <p className={styles["project-text"]}>
                            Los datos de los recursos y colecciones son propiedad de sus respectivos autores
                            y la Universidad de Belgrano.
                        </p>

                        <p className={styles["project-text"]}>
                            El Portal de Ciencias y Tecnologías se encuentra protegido bajo la licencia
                            GNU Affero General Public Licence 3.0.
                        </p>
                        <p className={styles["project-text"]}>
                            La arquitectura de repositorio LORE y todos sus artefactos son desarrollados
                            por Gerardo Wacker. Su código fuente se encuentra protegido bajo la licencia
                            GNU General Public Licence 3.0.
                        </p>

                        <p className={styles["project-text"]}>
                            Se puede acceder a los códigos fuente a través de los siguientes enlaces:
                        </p>

                        <ul className={styles["project-links"]}>
                            <li>
                                Portal de Ciencias y Tecnologías ConexionUB: &nbsp;
                                <a
                                    href="https://github.com/gerardowacker/conexionub"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    https://github.com/gerardowacker/conexionub
                                </a>
                            </li>
                            <li>
                                Repositorio LORE: &nbsp;
                                <a
                                    href="https://github.com/gerardowacker/lore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    https://github.com/gerardowacker/lore
                                </a>
                            </li>
                        </ul>
                    </section>
                </div>
            </Container>
        </>
    );
}
