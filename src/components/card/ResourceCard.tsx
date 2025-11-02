"use client"

import React from 'react'
import Link from 'next/link'
import styles from './ResourceCard.module.css'
import {Resource} from '@/types/resources'

type Props = {
    resource: Resource
}

export default function ResourceCard({resource}: Props) {
    const id = resource._id
    const dc = resource.dc

    let title = ''
    if (Array.isArray(dc.title)) {
        title = dc.title.find((t) => t.language === 'es')?.title ?? dc.title[0]?.title ?? ''
    } else if (typeof dc.title === 'string') {
        title = dc.title
    }

    const author = dc.contributor?.author?.length ? dc.contributor.author.join(', ') : dc.creator ?? 'Sin autor'
    const issued = dc.date?.issued ? new Date(dc.date.issued) : undefined
    const year = issued ? issued.getFullYear() : undefined

    let description = ''
    if (Array.isArray(dc.description)) {
        description = dc.description.find(d => d.language === 'es')?.abstract ?? dc.description[0]?.abstract ?? ''
    } else if (typeof dc.description === 'string') {
        description = dc.description
    }

    if (!title) title = id
    if (!description) description = 'Sin descripción disponible.'

    return (
        <Link href={`/repositorio/recurso/${id}`} className={styles['resource']}>
            <h2 className={styles['resource-title']}>{title}</h2>
            <p className={styles['resource-author']}>{author}{year ? `  (${year})` : ''}</p>
            <p className={styles['resource-description']}>{description}</p>
        </Link>
    )
}
