"use client"

import React from 'react'
import Link from 'next/link'
import styles from './ResourceCard.module.css'

type DcResource = {
    _id: string;
    dc?: any;
    title?: string;
    author?: string;
    year?: string | number;
    description?: string;
}

type Props = {
    resource: DcResource
}

export default function ResourceCard({ resource }: Props) {
    // Si viene en formato DC, extraer campos preferentemente en español
    let id = resource._id
    let title = resource.title ?? ''
    let author = resource.author ?? ''
    let year = resource.year ?? ''
    let description = resource.description ?? ''

    if (resource.dc) {
        const dc = resource.dc
        const titleEs = Array.isArray(dc.title) ? dc.title.find((t: any) => t.language === 'es')?.title : dc.title
        title = titleEs ?? title ?? id
        author = dc.contributor?.author?.length ? dc.contributor.author.join(', ') : dc.creator ?? author
        const issued = dc.date?.issued ? new Date(dc.date.issued) : undefined
        year = issued ? issued.getFullYear() : year
        const descEs = Array.isArray(dc.description) ? dc.description.find((d: any) => d.language === 'es')?.abstract : dc.description
        description = descEs ?? description
    }

    // Fallbacks
    if (!title) title = id
    if (!author) author = 'Sin autor'
    if (!description) description = 'Sin descripción disponible.'

    return (
        <Link href={`/repositorio/recurso/${id}`} className={styles['resource']}>
            <h2 className={styles['resource-title']}>{title}</h2>
            <p className={styles['resource-author']}>{author}{year ? `  (${year})` : ''}</p>
            <p className={styles['resource-description']}>{description}</p>
        </Link>
    )
}

