'use client';

import React from 'react';
import Container from '@/components/container/Container';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import CollectionAdminSelector from '@/components/admin/CollectionAdminSelector';
import {notFound} from "next/navigation";

export default function AdminCollections() {
    const { user } = useSession();

    if (!user || user.level < 1) {
        return notFound()
    }

    return (
        <Container id={'admin-collections'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>, <Link key={'admin'} href={'/repositorio/admin'}>Admin</Link>]}>
            <h1>Administración de colecciones</h1>
            <p>Puedes crear y editar colecciones desde aquí.</p>

            <div style={{marginTop: 16}}>
                <CollectionAdminSelector />
            </div>
        </Container>
    );
}

