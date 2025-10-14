import React from "react";
import CareerCard from "@/components/card/CareerCard";
import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";

import styles from './page.module.css'
import {getDegrees} from "@/app/carreras/utils";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
    return (
        <>
            <Banner>
                <Image src={'/LogoBlancoTransparente.webp'} alt="UB" className={styles['hero-logo']}/>
                <h1 id="hero-title" className={styles['hero-title']}>
                    Portal de Ciencias y Tecnologías
                </h1>
            </Banner>
            <Container id={'carreras'} crumb={['Inicio', <Link key={'Carreras'} href={'/#carreras'}>Carreras</Link>]}>
                <div className={styles['cards-2']}>
                    {getDegrees().map((degree, key) => (
                        <CareerCard key={key} title={degree.metadata.title} years={degree.metadata.years + " años"}
                                    description={degree.metadata.description} link={'/carreras/' + degree.slug}
                                    image={degree.metadata.image}/>
                    ))}
                </div>
            </Container>
        </>
    )
}