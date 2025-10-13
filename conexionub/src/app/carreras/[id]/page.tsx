import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import {getDegrees} from "@/app/carreras/utils";
import {notFound} from "next/navigation";
import {CustomMDX, getHeadingsFromMDX} from "@/components/mdx/Mdx";
import React from "react";

import styles from './page.module.css'
import bannerStyles from "@/components/banner/Banner.module.css";
import Toc from "@/components/toc/Toc";

export async function generateStaticParams() {
    let degrees = getDegrees()

    return degrees.map((degree) => ({
        slug: degree.slug,
    }))
}

export default async function DegreePage({params}: { params: { id: string } }) {
    const {id} = params

    let degree = getDegrees().find((degree) => degree.slug === id)

    if (!degree) {
        notFound()
    }

    let headings = getHeadingsFromMDX(degree.content)

    return (
        <>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>{degree.metadata.title}</h1>
                <h3 className={bannerStyles["hero-sub"]}>{degree.metadata.description}</h3>
            </Banner>
            <div className={styles['degree-layout']}>
               <Toc headings={headings}/>
                <Container
                    id="informaticacontent"
                    crumb={["Inicio",
                        "Carreras",
                        <a key="Ingeniería en Informática" href="/carreras/ingenieria-informatica">Ingeniería en Informática</a>
                    ]}>
                    <CustomMDX source={degree.content}/>
                </Container>
            </div>
        </>
    )
        ;
}