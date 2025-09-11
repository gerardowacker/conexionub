import React from "react";
import Header from "../components/header/header.component";
import "../styles/home-landing.css";
import '../styles/index.css'
import logo from '../assets/LogoBlancoTransparente.webp';
import imgInf from '../assets/descarga.jpg';
import imgLic from '../assets/compu.jpg';
import edificio from '../assets/edificionub.png'
import Banner from "../components/banner/banner.component";

export default function HomeView()
{
    return (
        <>
            <Header landing={true}/>

            <main className="landing">
                <div className="container">
                    <Banner>
                        <img src={logo} alt="UB" className="hero-logo"/>
                        <h1 id="hero-title" className="hero-title">
                            Portal de Ciencias y Tecnologías
                        </h1>
                    </Banner>
                    <section className="catalog" id={'carreras'}>
                        <div className="catalog-head">
                            <span className="crumb-inline">
                                <span className={'crumb-item'}>Inicio</span>
                                <span className={'crumb-item'}><b>&gt;</b></span>
                                <span className={'crumb-item'}>
                                    <a href={'#carreras'}>Carreras</a>
                                </span>
                            </span>
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
