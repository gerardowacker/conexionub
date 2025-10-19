import React from "react";
import Container from "@/components/container/Container";
import Link from "next/link";

import styles from './page.module.css'

export default function Repositorio() {
    return (
        <>
            <Container id={'colecciones'}
                       crumb={['Repositorio', <Link key={'Colecciones'} href={'#colecciones'}>Colecciones</Link>]}>
                <h1 className={styles['title']}>Colecciones del repositorio</h1>
                <ul className={styles['collections']}>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        1</Link></li>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        2</Link></li>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        3</Link></li>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        4</Link></li>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        5</Link></li>
                    <li><Link href={'/repositorio/coleccion/ejemplo'} className={styles['collection']}>Colección de
                        ejemplo
                        6</Link></li>
                </ul>
            </Container>
            <div className={styles['container']}/>
            <Container id={'ultimas'} crumb={['Repositorio',
                <Link key={'Últimas adiciones'} href={'#ultimas'}>Últimas adiciones</Link>]}>
                <h1 className={styles['title']}>Últimas adiciones</h1>
                <Link href={'/repositorio/recurso/ejemplo'} className={styles['resource']}>
                    <h2 className={styles['resource-title']}>Recurso de ejemplo</h2>
                    <p className={styles['resource-author']}>De Ejemplo, Autor (Universidad de Belgrano - Facultad
                        de Ejemplo, 2025)</p>
                    <p className={styles['resource-description']}>Esta es una descripción de ejemplo para un recurso
                        añadido recientemente al repositorio. Proporciona información sobre el contenido y la
                        utilidad del recurso.</p>
                </Link>
                <Link href={'/repositorio/recurso/ejemplo'} className={styles['resource']}>
                    <h2 className={styles['resource-title']}>Recurso de ejemplo</h2>
                    <p className={styles['resource-author']}>De Ejemplo, Autor (Universidad de Belgrano - Facultad
                        de Ejemplo, 2025)</p>
                    <p className={styles['resource-description']}>Esta es una descripción de ejemplo para un recurso
                        añadido recientemente al repositorio. Proporciona información sobre el contenido y la
                        utilidad del recurso.</p>
                </Link>
                <Link href={'/repositorio/recurso/ejemplo'} className={styles['resource']}>
                    <h2 className={styles['resource-title']}>Recurso de ejemplo</h2>
                    <p className={styles['resource-author']}>De Ejemplo, Autor (Universidad de Belgrano - Facultad
                        de Ejemplo, 2025)</p>
                    <p className={styles['resource-description']}>Esta es una descripción de ejemplo para un recurso
                        añadido recientemente al repositorio. Proporciona información sobre el contenido y la
                        utilidad del recurso.</p>
                </Link>
                <Link href={'/repositorio/recurso/ejemplo'} className={styles['resource']}>
                    <h2 className={styles['resource-title']}>Recurso de ejemplo</h2>
                    <p className={styles['resource-author']}>De Ejemplo, Autor (Universidad de Belgrano - Facultad
                        de Ejemplo, 2025)</p>
                    <p className={styles['resource-description']}>Esta es una descripción de ejemplo para un recurso
                        añadido recientemente al repositorio. Proporciona información sobre el contenido y la
                        utilidad del recurso.</p>
                </Link>
                <Link href={'/repositorio'} className={styles['see-more']}>
                    Ver más
                </Link>
            </Container>
        </>
    )
}