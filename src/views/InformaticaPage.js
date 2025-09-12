import React from "react";
import Header from "../components/header/header.component";
import Banner from "../components/banner/banner.component";
import Container from "../components/container/container.component";

import "../styles/informaticaPage.css";

export default function InformaticaPage() {
  return (
    <>
      <Header />

      <main className="landing">
        <div className="view-container">
          <Banner>
            <h1 id="hero-title" className="hero-title">
              Ingeniería en Informática
            </h1>
            <h3 className="hero-sub">Dominá la gestión de datos, procesos y automatización en organizaciones</h3>
          </Banner>
          <div className="degree-layout">
                      <nav className="toc" aria-label="Índice de contenidos">
                        <div className="toc-title">Contenidos</div>
                        <ul>
                          <li><a href="#plan">Plan Académico</a></li>
                          <li><a href="#caracter">Características</a></li>
                          <li><a href="#intercambio">Intercambio</a></li>
                          <li><a href="#salida">Salida laboral</a></li>
                        </ul>
                      </nav>
          <Container
            id="informaticacontent"
            crumb={[
              "Inicio",
              "Carreras",
              <a key = "Ingeniería en Informática" href="/carreras/ingenieria-informatica">Ingeniería en Informática</a>
            ]}
          >
            <article className="degree-content">
              <section id="contenidos" className="degree-section">
                <h2>Contenidos</h2>
                <p>
                  Programación (imperativa, OOP), estructuras de datos, algoritmos, arquitectura de
                  computadoras, redes, bases de datos (relacionales y NoSQL), ingeniería de software,
                  sistemas operativos, desarrollo web y móvil, cloud, ciberseguridad e introducción a IA/ML.
                </p>
              </section>

              <section id="plan" className="degree-section">
                <h2>Plan Académico</h2>
                <p>
                  Plan de 5 años con troncales + electivas. Talleres y laboratorios por cuatrimestre,
                  proyecto integrador anual, prácticas profesionales y seminarios optativos de
                  especialización (DevOps, Data, Cloud, Seguridad).
                </p>
              </section>

              <section id="caracter" className="degree-section">
                <h2>Características</h2>
                <ul>
                  <li>Foco práctico con proyectos reales y trabajo en equipo.</li>
                  <li>Buenas prácticas: testing, CI/CD, documentación y control de versiones.</li>
                  <li>Vinculación con la industria y charlas de especialistas.</li>
                </ul>
              </section>

              <section id="intercambio" className="degree-section">
                <h2>Intercambio</h2>
                <p>
                  Convenios con universidades extranjeras, estancias cortas y programas de doble titulación
                  según acuerdos vigentes. Posibilidad de cursado híbrido e inglés técnico.
                </p>
              </section>

              <section id="salida" className="degree-section">
                <h2>Salida laboral</h2>
                <p>
                  Desarrollo de software (frontend/backend/full-stack), DevOps/Cloud, data engineering y
                  analytics, IA/ML, ciberseguridad, QA/testing, consultoría IT y gestión de proyectos.
                </p>
              </section>
            </article>
          </Container>
          </div>
        </div>
      </main>
    </>
  );
}
