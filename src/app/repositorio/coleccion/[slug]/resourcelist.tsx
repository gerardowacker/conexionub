"use client"

import React, {useState} from 'react'
import Link from 'next/link'
import styles from './page.module.css'
import {get} from '@/utils/request'

type Resource = {
    _id: string
    title?: string
    author?: string
    year?: string | number
    description?: string
}

type Props = {
    initialResources?: Resource[]
    initialHasMore?: boolean
    initialLastResource?: string | null
    slug: string
    pageSize: number
    desc: boolean
}

export default function ResourcesList({
                                          initialResources = [],
                                          initialHasMore = false,
                                          initialLastResource = null,
                                          slug,
                                          pageSize,
                                          desc,
                                      }: Props) {
    const [resources, setResources] = useState<Resource[]>(initialResources)
    const [hasMore, setHasMore] = useState<boolean>(initialHasMore)
    const [lastResource, setLastResource] = useState<string | null>(initialLastResource)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadMore = async () => {
        if (loading) return
        setLoading(true)
        setError(null)
        try {
            // Usar el id del último recurso mostrado como cursor (lastResource)
            const lastShown = resources.length > 0 ? resources[resources.length - 1]._id : lastResource
            const qs = `?pageSize=${pageSize}&desc=${desc}` + (lastShown ? `&lastResource=${encodeURIComponent(lastShown)}` : '')
            const res = await get(`/collection/${slug}${qs}`)
            const data = res.response.data || {}
            const newResources: Resource[] = data.resources ?? []
            const newHasMore: boolean = data.hasMore ?? false
            const newLast: string | null = data.lastResource ?? null

            setResources(prev => [...prev, ...newResources])
            setHasMore(newHasMore)
            setLastResource(newLast)
        } catch (err) {
            console.error('Error cargando más recursos', err)
            setError('No se pudieron cargar más recursos')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {resources.length === 0 && <p>No hay recursos para esta colección.</p>}
            {resources.map(r => (
                <Link key={r._id} href={`/repositorio/recurso/${r._id}`} className={styles['resource']}>
                    <h2 className={styles['resource-title']}>{r.title ?? r._id}</h2>

                    {(r.author || r.year) && (
                        <p className={styles['resource-meta']}>
                            {r.author && <span className={styles['resource-author']}>{r.author}</span>}
                            {r.author && r.year && <span style={{margin: '0 0.5rem', color: 'var(--muted)'}}>·</span>}
                            {r.year && <span className={styles['resource-year']}>{r.year}</span>}
                        </p>
                    )}

                    {r.description && <p className={styles['resource-description']}>{r.description}</p>}
                </Link>
            ))}

            {error && <p style={{color: 'var(--error, #b00020)'}}>{error}</p>}

            {hasMore ? (
                <div style={{marginTop: '1rem'}}>
                    <button onClick={loadMore} disabled={loading} className={styles['see-more']}>
                        {loading ? 'Cargando...' : 'Ver más'}
                    </button>
                </div>
            ) : (
                <></>
            )}
        </div>
    )
}
