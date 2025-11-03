'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@/components/container/Container';
import {useSession} from '@/context/SessionContext';
import {notFound} from "next/navigation";

export default function AdminIndex() {
    const {user} = useSession();

    if (!user || user.level < 1) {
        return notFound()
    }

    return (
        <Container id={'admin'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
            <Link key={'admin'} href={'#admin'}>Panel de control</Link>]}>
            <h1>Panel de control</h1>
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
