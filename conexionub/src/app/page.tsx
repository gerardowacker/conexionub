import React from "react";
import CareerCard from "@/components/card/CareerCard";
import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";

import styles from './page.module.css'

export default function Home() {
    return (
        <>
            <Banner>
                <img src={'/LogoBlancoTransparente.webp'} alt="UB" className={styles['hero-logo']}/>
                <h1 id="hero-title" className={styles['hero-title']}>
                    Portal de Ciencias y Tecnologías
                </h1>
            </Banner>
            <Container id={'carreras'} crumb={['Inicio', <a href={'#carreras'}>Carreras</a>]}>
                <div className={styles['cards-2']}>
                    <CareerCard
                        image="/descarga.jpg"
                        title="Ingeniería en Informática"
                        years="5 años"
                        description="Dominá la gestión de datos, procesos y automatización en organizaciones modernas."
                        link="/carreras/ingenieria-informatica"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Licenciatura en Sistemas"
                        years="4½ años"
                        description="Dominá la gestión de datos, procesos y automatización en organizaciones modernas."
                        link="/carreras/lic-sistemas"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Tecnicatura en programación"
                        years="2 años"
                        description="Aprendé a programar desde cero y creá software ágil y funcional para multiples entornos."
                        link="/carreras/tec-programacion"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Licenciatura en nutrición"
                        years="4 años"
                        description="Conocé el impacto de la alimentación en la salud y ayudá a transformar hábitos de vida."
                        link="/carreras/lic-nutricion"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Licenciatura en biología"
                        years="4 años"
                        description="Explorá el mundo natural desde la genética hasta la ecología con enfoque científico y aplicado."
                        link="/carreras/lic-biologia"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Licenciatura en farmacia"
                        years="4 años"
                        description="Especializate en medicamentos, control de calidad y contribución al cuidado de la salud."
                        link="/carreras/lic-farmacia"
                    />
                    <CareerCard
                        image="/compu.jpg"
                        title="Tecnicatura en diseño y animacion digital"
                        years="2½ años"
                        description="Uni creatividad y tecnología para dar vida a experiencias visuales interactivas."
                        link="/carreras/tec-dis"
                    />
                </div>
            </Container>
        </>
    )
}