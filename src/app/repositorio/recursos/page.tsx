import React from "react";
import Container from "@/components/container/Container";
import Link from "next/link";
import { get } from "@/utils/request";

import styles from '../page.module.css';
import ResourcesList from './resourcelist';

type Resource = {
    _id: string;
    dc: {
        title: [{ language: string, title: string }],
        creator: string,
        type: string,
        contributor?: { author?: string[], advisor?: string[] },
        date: { available: Date, issued: Date },
        description?: [{ language: string, abstract: string }],
        format: string,
        subject?: string[],
        publisher?: string,
        rights?: string,
    },
    access: {
        collection: string,
        restriction: number,
        hash: string,
        name: string
    }
}


interface Props {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function ResourcesPage({ searchParams }: Props) {
    const authorParam = Array.isArray(searchParams?.author) ? searchParams?.author[0] : (searchParams?.author as string | undefined);
    const authorName = authorParam && String(authorParam).trim().length > 0 ? String(authorParam) : '';

    const pageSize = 10;
    const desc = true;

    const qs = `?pageSize=${pageSize}&desc=${desc}` + (authorName ? `&author=${encodeURIComponent(authorName)}` : '');
    const endpoint = `/resources${qs}`;
    const request = await get(endpoint);

    const raw = request.response.data || {};
    const resourcesRaw: Resource[] = Array.isArray(raw.resources) ? raw.resources as Resource[] : [];
    const hasMore: boolean = !!raw.hasMore;
    const lastResource: string | null = raw.lastResource ?? null;

    const initialResources = resourcesRaw.map(r => {
        const titleEs = r.dc && Array.isArray(r.dc.title) ? r.dc.title.find((t) => t.language === 'es')?.title : r.dc?.title;
        const authors = r.dc?.contributor?.author?.length ? r.dc.contributor.author.join(', ') : r.dc?.creator;
        const issuedDate = r.dc?.date?.issued ? new Date(r.dc.date.issued) : undefined;
        const year = issuedDate ? issuedDate.getFullYear() : undefined;
        const descriptionEs = r.dc && Array.isArray(r.dc.description) ? r.dc.description?.find((d) => d.language === 'es')?.abstract : r.dc?.description;
        return {
            _id: r._id,
            title: titleEs ?? r._id,
            author: authors,
            year,
            description: descriptionEs ?? undefined,
        }
    });

    return (
        <Container id={'recursos'} crumb={[<Link key={'Repositorio'} href={'/repositorio'}>Repositorio</Link>, <Link key={'Recursos'} href={'/repositorio/recursos'}>Recursos</Link>]}>
            <h1 className={styles['title']}>{authorName ? `Recursos de ${authorName}` : 'Recursos'}</h1>

            <ResourcesList
                initialResources={initialResources}
                initialHasMore={hasMore}
                initialLastResource={lastResource}
                authorName={authorName}
                pageSize={pageSize}
                desc={desc}
            />
        </Container>
    )
}

