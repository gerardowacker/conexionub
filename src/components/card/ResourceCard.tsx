"use client"

import React, {useEffect, useState} from 'react'
import Link from 'next/link'
import styles from './ResourceCard.module.css'
import {Resource} from '@/types/resources'

type Props = {
    resource: Resource
    onSelectAction?: (resource: Resource) => void
}

export default function ResourceCard({resource, onSelectAction}: Props) {
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

    const [needsFallback, setNeedsFallback] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined' && typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
            const supportsClamp = CSS.supports('-webkit-line-clamp', '4') || CSS.supports('line-clamp', '4')
            setNeedsFallback(!supportsClamp)
        } else if (typeof window !== 'undefined') {
            setNeedsFallback(true)
        } else {
            setNeedsFallback(true)
        }
    }, [])

    const CHAR_FALLBACK = 500
    const displayedDescription = needsFallback && description.length > CHAR_FALLBACK
        ? description.slice(0, CHAR_FALLBACK).trimEnd() + '...'
        : description

    if (!title) title = id
    if (!description) description = 'Sin descripción disponible.'

    const handleClick = (e: React.MouseEvent) => {
        if (onSelectAction) {
            e.preventDefault()
            onSelectAction(resource)
        }
    }

    if (onSelectAction) {
        return (
            <a className={styles['resource']} onClick={handleClick} href="#">
                <h2 className={styles['resource-title']}>{title}</h2>
                <p className={styles['resource-author']}>{author}{year ? `  (${year})` : ''}</p>
                <p className={styles['resource-description']} title={description} aria-label={description}>{displayedDescription}</p>
            </a>
        )
    }

    return (
        <Link href={`/repositorio/recurso/${id}`} className={styles['resource']}>
            <h2 className={styles['resource-title']}>{title}</h2>
            <p className={styles['resource-author']}>{author}{year ? `  (${year})` : ''}</p>
            <p className={styles['resource-description']} title={description} aria-label={description}>{displayedDescription}</p>
        </Link>
    )
}
