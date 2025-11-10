"use client";

import React, {useEffect, useState, useRef} from 'react';
import {get, post} from '@/utils/request';
import styles from '@/components/collection-tree/CollectionTree.module.css';
import CollectionTree from '@/components/collection-tree/CollectionTree';
import {useOptionalToast} from '@/components/toast/ToastProvider';
import {useSession} from '@/context/SessionContext';

import type {Collection} from '@/types/collections';

type Props = {
    value?: string | null;
    onChangeAction?: (id: string | null) => void;
    showControls?: boolean;
};

interface SessionPayload {
    token: string | null;
    clientToken: string | null
}

interface CreateCollectionPayload {
    session: SessionPayload;
    collection: { name: string; description?: string; licence?: string; parent?: string | null }
}

interface UpdateCollectionPayload {
    session: SessionPayload;
    id: string;
    updateData: { name?: string; description?: string; licence?: string; parent?: string | null }
}

function flatten(collections: Collection[], depth = 0, out: { id: string; name: string }[] = []) {
    collections.forEach(c => {
        out.push({id: c._id, name: `${'\u2014 '.repeat(depth)}${c.name}`});
        if (c.children && c.children.length) flatten(c.children, depth + 1, out);
    });
    return out;
}

export default function CollectionAdminSelector({value, onChangeAction, showControls = true}: Props) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string | null>(value ?? null);
    const skipNotifyRef = useRef(false);

    const toastCtx = useOptionalToast();

    const notify = (opts: { message: string; type?: 'info' | 'error' | 'warn' }) => {
        if (toastCtx && typeof toastCtx.showToast === 'function') {
            toastCtx.showToast({message: opts.message, type: opts.type ?? 'info'});
            return;
        }

        console.warn('[notify]', opts.type ?? 'info', opts.message);
    };

    const [mode, setMode] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Collection | null>(null);
    const [form, setForm] = useState({name: '', description: '', licence: '', parent: ''});
    const {token, clientToken} = useSession();

    async function load() {
        setLoading(true);
        const res = await get('/collections');
        const cols = Array.isArray(res.response.data) ? res.response.data : [];
        setCollections(cols);
        setLoading(false);
    }

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        const newVal = value ?? null;
        setSelected(prev => {
            if (prev === newVal) {
                skipNotifyRef.current = false;
                return prev;
            }
            skipNotifyRef.current = true;
            return newVal;
        });
    }, [value]);

    const options = flatten(collections);

    const openCreate = () => {
        setMode('create');
        setEditing(null);
        setForm({name: '', description: '', licence: '', parent: ''});
    };

    const openEditFor = (col: Collection) => {
        setMode('edit');
        setEditing(col);
        const rawParent = col.parent;
        let parentId = '';
        if (rawParent) {
            if (typeof rawParent === 'string') parentId = rawParent;
            else if (typeof rawParent === 'object' && '_id' in rawParent && typeof rawParent._id === 'string') parentId = rawParent._id;
        }
        setForm({
            name: col.name || '',
            description: col.description || '',
            licence: col.licence || '',
            parent: parentId
        });
    };

    const submit = async () => {
        if (!token || !clientToken) {
            notify({message: 'Falta sesión', type: 'error'});
            return;
        }
        const session: SessionPayload = {token, clientToken};

        if (mode === 'create') {
            const payload: CreateCollectionPayload = {session, collection: {name: form.name}};
            if (form.description) payload.collection.description = form.description;
            if (form.licence) payload.collection.licence = form.licence;
            payload.collection.parent = form.parent === '' ? null : form.parent;
            const res = await post('/collection/create', payload);
            if (res.response.status === 200) {
                notify({message: 'Colección creada', type: 'info'});
                setMode(null);
                await load();
            } else notify({
                message: 'Error: ' + JSON.stringify(res.response.data || res.response.status),
                type: 'error'
            });
        } else if (mode === 'edit' && editing) {
            const payload: UpdateCollectionPayload = {session, id: editing._id, updateData: {}};
            if (form.name) payload.updateData.name = form.name;
            if (form.description) payload.updateData.description = form.description;
            if (form.licence) payload.updateData.licence = form.licence;
            payload.updateData.parent = form.parent === '' ? null : form.parent;
            const res = await post('/collection/update', payload);
            if (res.response.status === 200) {
                notify({message: 'Colección actualizada', type: 'info'});
                setMode(null);
                await load();
            } else notify({
                message: 'Error: ' + JSON.stringify(res.response.data || res.response.status),
                type: 'error'
            });
        }
    };

    const handleTreeSelect = (col: Collection) => {
        setSelected(col._id);
        openEditFor(col);
    };

    return (
        <div>
            {showControls ? (
                <CollectionTree
                    collections={collections.map(c => ({...c, children: c.children ?? []}) as Collection)}
                    selectable={true}
                    onSelect={handleTreeSelect}
                    selectedId={selected}
                    header={<button className={styles.createBtn} onClick={openCreate}>Crear colección</button>}
                />
            ) : (
                <div className={styles.treeContainer}>
                    <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                        <select value={selected ?? ''} onChange={e => {
                            const v = e.target.value || null;
                            setSelected(v);
                            if (skipNotifyRef.current) {
                                skipNotifyRef.current = false;
                                return;
                            }
                            if (onChangeAction) onChangeAction(v);
                        }} style={{flex: 1}}>
                            <option value={''}>Ninguno</option>
                            {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                        </select>
                        <div style={{display: 'flex', gap: 8}}>
                            <button type="button" onClick={openCreate} className={styles['toggle-btn']}>Crear</button>
                            <button type="button" onClick={() => {
                                if (!selected) {
                                    notify({message: 'Seleccioná una colección para editar', type: 'warn'});
                                    return;
                                }
                                openEditFor(collections.find(c => c._id === selected) as Collection);
                            }} className={styles['toggle-btn']}>Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {mode && (
                <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <div>{mode === 'create' ? 'Crear colección' : 'Editar colección'}</div>
                            <button aria-label="Cerrar" className={styles.closeBtn} onClick={() => setMode(null)}>×
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <div className={styles.dialogForm}>
                                <label>
                                    Título
                                    <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                                </label>
                                <label>
                                    Descripción
                                    <input value={form.description}
                                           onChange={e => setForm({...form, description: e.target.value})}/>
                                </label>
                                <label>
                                    Licencia
                                    <input value={form.licence}
                                           onChange={e => setForm({...form, licence: e.target.value})}/>
                                </label>
                                <label>
                                    Padre
                                    <select value={form.parent}
                                            onChange={e => setForm({...form, parent: e.target.value})}>
                                        <option value={''}>Ninguno</option>
                                        {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.btnSecondary} onClick={() => setMode(null)}>Cancelar</button>
                            <button className={styles.btnPrimary} onClick={submit}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <div>Cargando colecciones…</div>}
        </div>
    );
}
