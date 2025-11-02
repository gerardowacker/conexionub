'use client';

import React, {useEffect, useState} from 'react';
import Container from '@/components/container/Container';
import Link from 'next/link';
import { useSession } from '@/context/SessionContext';
import ResourceForm from '@/components/admin/ResourceForm';
import { get } from '@/utils/request';
import { Resource } from '@/types/resources';

export default function AdminResources() {
    const {user} = useSession();
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<Resource | null>(null);

    useEffect(() => {
        if (!user) return;
        if (user.level < 1) return;
        load();
    }, [user]);

    async function load() {
        setLoading(true);
        // pedir explicitamente pageSize y desc como en la vista pública
        const pageSize = 100;
        const desc = true;
        const res = await get(`/resources?pageSize=${pageSize}&desc=${desc}`);
        console.log('[admin resources] response', res.response);
        // manejar distintas formas de respuesta: array directo o objeto con `resources` / `data` / `result`
        let data: Resource[] = [];
        try {
            const body = res.response.data;
            console.log('[admin resources] body', body);
            if (Array.isArray(body)) data = body as Resource[];
            else if (body && Array.isArray(body.resources)) data = body.resources as Resource[];
            else if (body && Array.isArray(body.data)) data = body.data as Resource[];
            else if (body && Array.isArray(body.result)) data = body.result as Resource[];
            else data = [];
        } catch (err) {
            console.error('Error parsing /resources response', err);
            data = [];
        }

        setResources(data);
        setLoading(false);
    }

    if (!user || user.level < 1) {
        return (
            <Container id={'admin-resources'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>, <Link key={'admin'} href={'/repositorio/admin'}>Admin</Link>]}>
                <h1>404 — Página no encontrada</h1>
                <p>No tienes permisos para ver esta sección.</p>
            </Container>
        );
    }

    return (
        <Container id={'admin-resources'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>, <Link key={'admin'} href={'/repositorio/admin'}>Admin</Link>]}>
            <h1>Administración de recursos</h1>
            <p>Puedes crear y editar recursos desde aquí.</p>

            <div style={{marginTop: 16}}>
                <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <button onClick={() => setSelected(null)}>Nuevo recurso</button>
                    <div style={{marginLeft: 'auto'}}>
                        <button onClick={() => load()}>Refrescar lista</button>
                    </div>
                </div>

                <div style={{marginTop: 12}}>
                    <ResourceForm initial={selected} onSavedAction={() => { load(); setSelected(null); }} />
                </div>

                <div style={{marginTop: 24}}>
                    <h3>Recursos existentes</h3>
                    {loading && <div>Cargando…</div>}
                    {!loading && resources.length === 0 && <div>No hay recursos.</div>}

                    {!loading && resources.length > 0 && (
                        <div style={{display: 'grid', gap: 8}}>
                            {resources.map(r => (
                                <div key={r._id} style={{display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: '1px solid #eee', borderRadius: 6}}>
                                    <div style={{flex: 1}}>
                                        <strong>{Array.isArray(r.dc?.title) ? (r.dc.title.find(t=>t.language==='es')?.title ?? r.dc.title[0]?.title) : (typeof r.dc?.title === 'string' ? r.dc.title : r._id)}</strong>
                                        <div style={{fontSize: 12, color: '#666'}}>{r.dc?.creator ?? 'Sin autor'}</div>
                                    </div>
                                    <div style={{display: 'flex', gap: 8}}>
                                        <Link href={`/repositorio/recurso/${r._id}`} style={{padding: 8, border: '1px solid #ddd', borderRadius: 6, textDecoration: 'none'}}>Ver</Link>
                                        <button onClick={() => setSelected(r)}>Editar</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Container>
    );
}