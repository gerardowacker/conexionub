import Container from "@/components/container/Container";
import Link from "next/link";
import styles from './page.module.css';

export default function Collections()
{
    return (
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
    )
}