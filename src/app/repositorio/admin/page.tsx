'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Container from '@/components/container/Container';
import {useSession} from '@/context/SessionContext';
import {notFound} from "next/navigation";
import styles from './page.module.css'
import {get} from '@/utils/request'


export default function AdminIndex() {
    const {user} = useSession();
    const [data, setData] = useState<{name?: string; version?: string; homepage?: string; motd?: string} | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        const fetchRoot = async () => {
            setLoading(true)
            setError(null)
            try {
                const res = await get('/status')
                if (!mounted) return
                if (res.response.status >= 200 && res.response.status < 300) {
                    setData(res.response.data)
                } else {
                    setError(`Status ${res.response.status}`)
                }
            } catch (e: unknown) {
                if (!mounted) return
                if (e instanceof Error) setError(e.message)
                else setError(String(e))
            } finally {
                if (mounted) setLoading(false)
            }
        }
        fetchRoot()
        return () => { mounted = false }
    }, [])

    if (!user || user.level < 1) {
        return notFound()
    }

    return (
        <Container id={'admin'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
            <Link key={'admin'} href={'#admin'}>Panel de control</Link>]}>
            <h1 className={styles['title']}>Panel de control</h1>
            <section className={styles.box} aria-live="polite">
                <h2 className={styles.boxHeader}>Información del repositorio</h2>
                {loading && <div>Cargando...</div>}
                {error && <div style={{color: 'red'}}>Error: {error}</div>}
                {!loading && !error && (
                    <div>
                        {data ? (
                            <div>
                                <p>Se está ejecutando un servidor {data.homepage ? (
                                    <a href={data.homepage} target="_blank" rel="noopener noreferrer">
                                        {data.name ?? '—'} {data.version ?? ''}
                                    </a>
                                ) : (
                                    <span>{data.name ?? '—'} {data.version ?? ''}</span>
                                )}</p>

                                <details style={{marginTop: 8}}>
                                    <summary>Ver respuesta completa</summary>
                                    <pre className={styles.pre}>{JSON.stringify(data, null, 2)}</pre>
                                </details>
                            </div>
                        ) : (
                            <div>No hay datos</div>
                        )}
                    </div>
                )}
            </section>
            <h2>Áreas de administración</h2>
            <div style={{display: 'flex', gap: 16, marginTop: 20}}>
                <Link href={'/repositorio/admin/usuarios'} style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    textDecoration: 'none'
                }}>Usuarios</Link>
                <Link href={'/repositorio/admin/colecciones'} style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    textDecoration: 'none'
                }}>Colecciones</Link>
                <Link href={'/repositorio/admin/recursos'} style={{
                    padding: 12,
                    border: '1px solid #ddd',
                    borderRadius: 6,
                    textDecoration: 'none'
                }}>Recursos</Link>
            </div>
        </Container>
    );
}
