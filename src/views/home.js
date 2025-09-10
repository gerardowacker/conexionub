import React from "react";
import Header from "../components/header/header-landing.component";
import "../styles/home-landing.css";
import '../styles/index.css'
import imgInf from '../assets/descarga.jpg';
import imgLic from '../assets/compu.jpg';

export default function HomeView()
{
    return (
        <>
            <Header
                variant="landing"
                breadcrumb={[
                    {label: "Inicio", href: "/"},
                    {label: "Carreras", href: "/carreras"},
                ]}
            />

            <main className="landing">
                <div className="container">
                    <section className="hero-card" aria-labelledby="hero-title">
                        <img src="UBLogo.png" alt="UB" className="hero-logo"/>
                        <div className="hero-chip">Universidad de Belgrano</div>
                        <h1 id="hero-title" className="hero-title">
                            Carreras de Ciencias &amp; Tecnología
                        </h1>
                        <p className="hero-sub">
                            Elegí tu camino académico y descubrí los planes de estudio.
                        </p>
                    </section>

                    <section className="catalog">
                        <div className="catalog-head">
                            <span className="crumb-inline">Inicio &gt; Carreras</span>
                        </div>

                        <div className={'catalog-content'}>
                            <div className="cards-2">
                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgInf})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Ingeniería en Informática</h3>
                                    <span className="years"> 5 años</span>
                                    <p>Dominá la gestión de datos, procesos y automatización en organizaciones
                                        modernas.</p>
                                    <a className="btn" href="/carreras/ingenieria-informatica">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Licenciatura en Sistemas</h3>
                                    <span className="years"> 4½ años</span>
                                    <p>Dominá la gestión de datos, procesos y automatización en organizaciones
                                        modernas.</p>
                                    <a className="btn" href="/carreras/lic-sistemas">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Tecnicatura en programación</h3>
                                    <span className="years"> 2 años</span>
                                    <p>Aprendé a programar desde cero y creá software ágil y funcional para multiples
                                        entornos.</p>
                                    <a className="btn" href="/carreras/tec-programacion">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Licenciatura en nutrición</h3>
                                    <span className="years"> 4 años</span>
                                    <p>Conocé el impacto de la alimentación en la salud y ayudá a transformar hábitos de
                                        vida.</p>
                                    <a className="btn" href="/carreras/lic-nutricion">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Licenciatura en biología</h3>
                                    <span className="years"> 4 años</span>
                                    <p>Explorá el mundo natural desde la genética hasta la ecología con enfoque
                                        científico y
                                        aplicado.</p>
                                    <a className="btn" href="/carreras/lic-biologia">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Licenciatura en farmacia</h3>
                                    <span className="years"> 4 años</span>
                                    <p>Especializate en medicamentos, control de calidad y contribución al cuidado de la
                                        salud.</p>
                                    <a className="btn" href="/carreras/lic-farmacia">Ver más</a>
                                </article>

                                <article className="career-card">
                                    <div className="thumb"
                                         style={{
                                             backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${imgLic})`,
                                             backgroundSize: "cover",
                                             backgroundPosition: "center",
                                         }}/>
                                    <h3>Tecnicatura en diseño y animacion digital</h3>
                                    <span className="years"> 2½ años</span>
                                    <p>Uni creatividad y tecnología para dar vida a experiencias visuales
                                        interactivas.</p>
                                    <a className="btn" href="/carreras/tec-dis">Ver más</a>
                                </article>
                            </div>
                        </div>
                    </section>

                </div>
            </main>
        </>
    );
}
