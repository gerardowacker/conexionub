import React from "react";
import Container from "@/components/container/Container";
import Link from "next/link";
import {get} from "@/utils/request";
import styles from './page.module.css'
import {Resource} from '@/types/resources'

export default async function Repositorio() {
    const request = await get('/resources?pageSize=5&desc=true')
    const resources = Array.isArray(request.response.data?.resources) ? request.response.data.resources as Resource[] : [];
    const hasMore = !!request.response.data?.hasMore;

    return (
        <>
            <Container id={'ultimas'} crumb={['Repositorio',
                <Link key={'Últimas adiciones'} href={'#ultimas'}>Últimas adiciones</Link>]}>
                <h1 className={styles['title']}>Últimas adiciones</h1>
                {resources.length === 0 && <p>No hay recursos disponibles.</p>}
                {resources.map(resource => {
                    const titleEs = Array.isArray(resource.dc.title) ? resource.dc.title.find(t => t.language === 'es')?.title : resource.dc.title;
                    const authors = resource.dc.contributor?.author?.length ? resource.dc.contributor.author.join(', ') : resource.dc.creator;
                    const issuedDate = resource.dc.date?.issued ? new Date(resource.dc.date.issued) : undefined;
                    let fecha = '';
                    if (issuedDate) {
                        const dia = issuedDate.getDate().toString().padStart(2, '0');
                        const mes = (issuedDate.getMonth() + 1).toString().padStart(2, '0');
                        const anio = issuedDate.getFullYear();
                        fecha = `${dia}/${mes}/${anio}`;
                    }
                    const descriptionEs = Array.isArray(resource.dc.description) ? resource.dc.description?.find(d => d.language === 'es')?.abstract : resource.dc.description;
                    return (
                        <Link href={`/repositorio/recurso/${resource._id}`} className={styles['resource']}
                              key={resource._id}>
                            <h2 className={styles['resource-title']}>{titleEs ?? 'Sin título'}</h2>
                            <p className={styles['resource-author']}>{authors ?? 'Sin autor'}{fecha ? `  (${fecha})` : ''}</p>
                            <p className={styles['resource-description']}>{descriptionEs ?? 'Sin descripción disponible.'}</p>
                        </Link>
                    )
                })}
                {hasMore && (
                    <Link href={'/repositorio'} className={styles['see-more']}>
                        Ver más
                    </Link>
                )}
            </Container>
        </>
    )
}