'use client';

import React, {useEffect, useState, useRef, useCallback} from 'react';
import Container from '@/components/container/Container';
import Link from 'next/link';
import {useSession} from '@/context/SessionContext';
import ResourceForm from '@/components/admin/ResourceForm';
import {get} from '@/utils/request';
import {Resource} from '@/types/resources';
import {ToastProvider} from '@/components/toast/ToastProvider';
import ResourceList from '@/components/list/ResourceList';
import styles from './page.module.css';
import treeStyles from '@/components/collection-tree/CollectionTree.module.css';
import {notFound} from "next/navigation";

export default function AdminResources() {
    const {user} = useSession();
    type Col = { _id: string; name: string; children?: Col[] };

    const [collectionOptions, setCollectionOptions] = useState<{ id: string; name: string }[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<string | null>(null);

    const [initialResources, setInitialResources] = useState<Resource[]>([]);
    const [initialHasMore, setInitialHasMore] = useState(false);
    const [initialLastResource, setInitialLastResource] = useState<string | null>(null);
    const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);

    const formRef = useRef<{ submit?: () => void } | null>(null);
    const [selected, setSelected] = useState<Resource | null | 'new'>(null);

    const loadSeqRef = React.useRef(0);

    const loadResources = useCallback(async (reset = false, collectionId?: string | null) => {
        const coll = typeof collectionId !== 'undefined' ? collectionId : null;
        const pageSize = 20;
        const desc = true;
        const endpoint = coll ? `/collection/${encodeURIComponent(coll)}?pageSize=${pageSize}&desc=${desc}` : `/resources?pageSize=${pageSize}&desc=${desc}`;

        const seq = ++loadSeqRef.current;

        if (reset && seq === loadSeqRef.current) {
            setInitialResources([]);
            setInitialHasMore(false);
            setInitialLastResource(null);
        }

        if (seq === loadSeqRef.current) setResourcesLoading(true);

        try {
            const res = await get(endpoint);
            const data: unknown = res?.response?.data ?? [];

            let resourcesArr: Resource[];
            let hasMore: boolean;
            let lastRes: string | null;

            const payload = data as Record<string, unknown>;
            if (Array.isArray(data)) resourcesArr = data as Resource[];
            else if (Array.isArray(payload?.resources as unknown)) resourcesArr = (payload.resources as unknown) as Resource[];
            else if (Array.isArray(payload?.data as unknown)) resourcesArr = (payload.data as unknown) as Resource[];
            else if (Array.isArray(payload?.result as unknown)) resourcesArr = (payload.result as unknown) as Resource[];
            else resourcesArr = [];

            if (typeof payload?.hasMore === 'boolean') hasMore = payload.hasMore as boolean;
            else hasMore = resourcesArr.length === pageSize;

            if (typeof payload?.lastResource === 'string') lastRes = payload.lastResource as string;
            else if (resourcesArr.length) lastRes = resourcesArr[resourcesArr.length - 1]._id;
            else lastRes = null;

            if (seq === loadSeqRef.current) {
                setInitialResources(resourcesArr);
                setInitialHasMore(hasMore);
                setInitialLastResource(lastRes);
            }
        } catch (err) {
            console.error('Error cargando recursos', err);
            if (seq === loadSeqRef.current) {
                setInitialResources([]);
                setInitialHasMore(false);
                setInitialLastResource(null);
            }
        } finally {
            if (seq === loadSeqRef.current) setResourcesLoading(false);
        }
    }, []);

    const loadCollections = useCallback(async () => {
        try {
            const res = await get('/collections');
            const cols = Array.isArray(res.response.data) ? res.response.data as Col[] : [];
            const opts: { id: string; name: string }[] = [];

            function flatten(list: Col[], depth = 0) {
                list.forEach((c: Col) => {
                    opts.push({id: c._id, name: `${'- '.repeat(depth)}${c.name}`});
                    if (c.children && c.children.length) flatten(c.children, depth + 1);
                });
            }

            flatten(cols);
            setCollectionOptions(opts);
        } catch (err) {
            console.error('Error cargando colecciones', err);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        if (user.level < 1) return;
        loadCollections();
    }, [user, loadCollections]);

    useEffect(() => {
        if (!user) return;
        if (user.level < 1) return;
        loadResources(true, selectedCollection);
    }, [selectedCollection, user, loadResources]);

    if (!user || user.level < 1) {
        return notFound()
    }

    const baseEndpoint = selectedCollection ? `/collection/${selectedCollection}` : '/resources';
    const initialQuery = `?pageSize=20&desc=true`;

    return (
        <ToastProvider>
            <Container id={'admin-users'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
                <Link key={'admin'} href={'/repositorio/admin'}>Panel de control</Link>,
                <Link key={'res'} href={'#res'}>Recursos</Link>]}>
                <h1 className={styles['title']}>Administración de recursos</h1>

                <div className={styles.controlsRow}>
                    <div className={styles.controlsBox}>
                        <button className={styles.primaryBtn} onClick={() => setSelected('new')}>Nuevo recurso</button>

                        <div className={styles.centerControls} style={{flex: 1}}>
                            <select value={selectedCollection ?? ''} onChange={e => {
                                const v = e.target.value || null;
                                setSelectedCollection(v);
                            }}>
                                <option value="">Todas las colecciones</option>
                                {collectionOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </div>

                        <div className={styles.rightControls}>
                            <button className={styles.secondaryBtn}
                                    onClick={() => loadResources(true, selectedCollection)}>Refrescar lista
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.listWrapper}>
                    <h3>Recursos existentes</h3>

                    {resourcesLoading ? (
                        <div className={styles.emptyCard}>Cargando...</div>
                    ) : (
                        <ResourceList
                            key={`${selectedCollection ?? 'all'}:${initialLastResource ?? ''}`}
                            initialResources={initialResources}
                            initialHasMore={initialHasMore}
                            initialLastResource={initialLastResource}
                            baseEndpoint={baseEndpoint}
                            initialQuery={initialQuery}
                            onSelectAction={(res) => {
                                setSelected(res);
                            }}
                        />
                    )}

                </div>

                {selected !== null && (
                    <div className={treeStyles.modalBackdrop} role="dialog">
                        <div className={treeStyles.modal}>
                            <div className={treeStyles.modalHeader}>
                                <div>{selected === 'new' ? 'Crear recurso' : 'Editar recurso'}</div>
                                <button className={treeStyles.closeBtn} onClick={() => setSelected(null)}
                                        aria-label="Cerrar">×
                                </button>
                            </div>

                            <div className={treeStyles.modalBody}>
                                <ResourceForm ref={formRef} initial={selected === 'new' ? null : selected}
                                              onSavedAction={() => {
                                                  loadResources(true, selectedCollection);
                                                  setSelected(null);
                                              }}/>
                            </div>

                            <div className={treeStyles.modalFooter}>
                                <button className={treeStyles.btnSecondary} onClick={() => setSelected(null)}>Cancelar
                                </button>
                                <button className={treeStyles.btnPrimary} onClick={() => {
                                    if (formRef.current && typeof formRef.current.submit === 'function') formRef.current.submit();
                                }}>Guardar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </Container>
        </ToastProvider>
    );
}
