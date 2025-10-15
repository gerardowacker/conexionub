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
    const degree = getDegrees().find((degree) => degree.slug === params.slug)
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
        title,
        description,
        openGraph: {
            title,
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
            title,
            description,
            images: [ogImage],
        },
    }
}

export default async function DegreePage({params}: { params: { slug: string } }) {
    const {slug} = await params

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
                    crumb={["Inicio",
                        <Link key={'Carreras'} href={'/#carreras'}>Carreras</Link>,
                        <Link key="Ingeniería en Informática"
                              href={"/carreras/" + degree.slug}>{degree.metadata.title}</Link>
                    ]}>
                    <CustomMDX source={degree.content}/>
                </Container>
            </div>
        </>
    )
        ;
}