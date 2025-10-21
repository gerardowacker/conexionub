import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import {getDegrees} from "@/app/carreras/utils";
import {notFound} from "next/navigation";
import {CustomMDX, getHeadingsFromMDX} from "@/components/mdx/Mdx";
import React from "react";

import styles from './page.module.css'
import bannerStyles from "@/components/banner/Banner.module.css";
import Toc from "@/components/toc/Toc";
import MetadataTags from "@/components/MetadataTags";
import Link from "next/link";
import {getBaseUrl} from "@/app/vercel";

export async function generateStaticParams() {
    const degrees = getDegrees()

    return degrees.map((degree) => ({
        slug: degree.slug,
    }))
}

export function generateMetadata({params}: { params: { slug: string } }) {
    const { slug } = params;
    const degree = getDegrees().find((degree) => degree.slug === slug)
    if (!degree) {
        return
    }

    const {
        title,
        image,
        description
    } = degree.metadata
    const ogImage = image
        ? image
        : `${getBaseUrl()}/og?title=${encodeURIComponent(title)}`

    return {
        title: title + ' | Universidad de Belgrano - Ciencias y Tecnologías',
        description,
        openGraph: {
            title: title + ' | Universidad de Belgrano - Ciencias y Tecnologías',
            description,
            type: 'article',
            url: `${getBaseUrl()}/carreras/${degree.slug}`,
            images: [
                {
                    url: ogImage,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: title + ' | Universidad de Belgrano - Ciencias y Tecnologías',
            description,
            images: [ogImage],
        },
    }
}

export default async function DegreePage({params}: { params: { slug: string } }) {
    const {slug} = params

    const degree = getDegrees().find((degree) => degree.slug === slug)

    if (!degree) {
        notFound()
    }

    const headings = getHeadingsFromMDX(degree.content)

    return (
        <>
            <MetadataTags meta={degree.metadata}/>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>{degree.metadata.title}</h1>
                <h3 className={bannerStyles["hero-sub"]}>{degree.metadata.description}</h3>
            </Banner>
            <div className={styles['degree-layout']}>
                <Toc headings={headings}/>
                <Container
                    id="informaticacontent"
                    crumb={[<Link key={'inicio'} href={'/'}>Inicio</Link>,
                        <Link key={'Carreras'} href={'/#carreras'}>Carreras</Link>,
                        <Link key={degree.slug}
                              href={"/carreras/" + degree.slug}>{degree.metadata.title}</Link>,
                        'Contenido'
                    ]}>
                    <CustomMDX source={degree.content}/>
                </Container>
                <div />
                <Container id={'contacto'} crumb={[<Link key={'inicio'} href={'/'}>Inicio</Link>,
                    <Link key={'Carreras'} href={'/#carreras'}>Carreras</Link>,
                    <Link key="Ingeniería en Informática"
                          href={"/carreras/" + degree.slug}>{degree.metadata.title}</Link>,
                    'Inscripción'
                ]}>
                    <h2>Requisitos de ingreso</h2>
                    <ul>
                        <li>Contar con título secundario.</li>
                        <li>Concurrir a una Jornada Informativa introductoria de la Universidad.</li>
                        <li>Asistir a una entrevista de admisión con un directivo de la carrera.</li>
                    </ul>
                    <Link className={styles['button']} href={'https://ub.edu.ar/ingreso/ingreso-ub'}>Saber más</Link>
                </Container>
            </div>
        </>
    )
        ;
}