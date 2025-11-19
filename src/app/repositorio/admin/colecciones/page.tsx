'use client';

import React from 'react';
import Container from '@/components/container/Container';
import Link from 'next/link';
import {useSession} from '@/context/SessionContext';
import CollectionAdminSelector from '@/components/admin/CollectionAdminSelector';
import {notFound} from "next/navigation";

import styles from './page.module.css';
import {ToastProvider} from '@/components/toast/ToastProvider';

export default function AdminCollections() {
    const {user} = useSession();

    if (!user || user.level < 1) {
        return notFound()
    }

    return (
        <ToastProvider>
            <Container id={'admin-users'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
                <Link key={'admin'} href={'/repositorio/admin'}>Panel de control</Link>,
                <Link key={'collections'} href={'#collections'}>Colecciones</Link>]}>
                <h1 className={styles['title']}>Administración de colecciones</h1>

                <div style={{marginTop: 16}}>
                    <CollectionAdminSelector/>
                </div>
            </Container>
        </ToastProvider>
    );
}
