'use client';

import React, {useEffect, useState, useRef} from 'react';
import {get, post} from '@/utils/request';
import styles from '@/components/collection-tree/CollectionTree.module.css';

interface Collection {
    _id: string;
    name: string;
    description?: string;
    licence?: string;
    children?: Collection[];
}

type Props = {
    value?: string | null;
    onChangeAction?: (id: string | null) => void; // renamed to satisfy Next.js props rule
    showControls?: boolean; // muestra botones crear/editar
};

// Payload types
interface SessionPayload { token: string | null; clientToken: string | null }
interface CreateCollectionPayload { session: SessionPayload; collection: { name: string; description?: string; licence?: string; parent?: string } }
interface UpdateCollectionPayload { session: SessionPayload; id: string; updateData: { name?: string; description?: string; licence?: string; parent?: string } }

// Helper to flatten collections into options with indentation
function flatten(collections: Collection[], depth = 0, out: {id: string; name: string}[] = []) {
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

    // form state for create/edit modal
    const [mode, setMode] = useState<'create' | 'edit' | null>(null);
    const [editing, setEditing] = useState<Collection | null>(null);
    const [form, setForm] = useState({name: '', description: '', licence: '', parent: ''});

    async function load() {
        setLoading(true);
        const res = await get('/collections');
        const cols = Array.isArray(res.response.data) ? res.response.data : [];
        setCollections(cols);
        setLoading(false);
    }

    useEffect(() => { load(); }, []);

    // Sincronizar prop -> estado sin notificar al padre (evitar loop)
    useEffect(() => {
        // setSelected sólo si cambia realmente — así evitamos re-renders/loops
        const newVal = value ?? null;
        setSelected(prev => {
            if (prev === newVal) {
                // nada que hacer
                skipNotifyRef.current = false;
                return prev;
            }
            skipNotifyRef.current = true;
            return newVal;
        });
    }, [value]);

    // Ya no llamamos onChangeAction desde aquí para evitar loops —
    // llamamos onChangeAction únicamente desde el handler de usuario.

    const options = flatten(collections);

    const openCreate = () => {
        setMode('create');
        setEditing(null);
        setForm({name: '', description: '', licence: '', parent: ''});
    };

    const openEdit = () => {
        if (!selected) return alert('Seleccion\u00e1 una colección para editar');
        // buscar collection selected
        const find = (cols: Collection[]): Collection | null => {
            for (const c of cols) {
                if (c._id === selected) return c;
                if (c.children) {
                    const r = find(c.children);
                    if (r) return r;
                }
            }
            return null;
        };
        const col = find(collections);
        if (!col) return alert('No se encontr\u00f3 la colección');
        setMode('edit');
        setEditing(col);
        setForm({name: col.name || '', description: col.description || '', licence: col.licence || '', parent: ''});
    };

    const submit = async () => {
        const session: SessionPayload = { token: localStorage.getItem('__lorest'), clientToken: localStorage.getItem('__lore_client') };
        if (!session.token || !session.clientToken) return alert('Falta sesi\u00f3n');

        if (mode === 'create') {
            const payload: CreateCollectionPayload = { session, collection: { name: form.name } };
            if (form.description) payload.collection.description = form.description;
            if (form.licence) payload.collection.licence = form.licence;
            if (form.parent) payload.collection.parent = form.parent;
            const res = await post('/collection/create', payload);
            if (res.response.status === 200) {
                alert('Colección creada');
                setMode(null);
                await load();
            } else alert('Error: ' + JSON.stringify(res.response.data || res.response.status));
        } else if (mode === 'edit' && editing) {
            const payload: UpdateCollectionPayload = { session, id: editing._id, updateData: {} };
            if (form.name) payload.updateData.name = form.name;
            if (form.description) payload.updateData.description = form.description;
            if (form.licence) payload.updateData.licence = form.licence;
            if (form.parent) payload.updateData.parent = form.parent;
            const res = await post('/collection/update', payload);
            if (res.response.status === 200) {
                alert('Colección actualizada');
                setMode(null);
                await load();
            } else alert('Error: ' + JSON.stringify(res.response.data || res.response.status));
        }
    };

    return (
        <div>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <select value={selected ?? ''} onChange={e => {
                    const v = e.target.value || null;
                    setSelected(v);
                    // notificar sólo en interacciones de usuario —
                    // si la última actualización fue causada por sincronización prop->estado,
                    // skipNotifyRef.current estará a true y la ignoramos una vez.
                    if (skipNotifyRef.current) {
                        skipNotifyRef.current = false;
                        return;
                    }
                    if (onChangeAction) onChangeAction(v);
                }} style={{flex: 1}}>
                    <option value={''}>\u2014 Ninguna \u2014</option>
                    {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
                {showControls && (
                    <div style={{display: 'flex', gap: 8}}>
                        <button type="button" onClick={openCreate} className={styles['toggle-btn']}>Crear</button>
                        <button type="button" onClick={openEdit} className={styles['toggle-btn']}>Editar</button>
                    </div>
                )}
            </div>

            {mode && (
                <div style={{border: '1px solid #ddd', padding: 12, marginTop: 12, borderRadius: 6}}>
                    <h4>{mode === 'create' ? 'Crear colecci\u00f3n' : 'Editar colecci\u00f3n'}</h4>
                    <div style={{display: 'grid', gap: 8}}>
                        <label>
                            T\u00edtulo
                            <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                        </label>
                        <label>
                            Descripci\u00f3n
                            <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                        </label>
                        <label>
                            Licencia
                            <input value={form.licence} onChange={e => setForm({...form, licence: e.target.value})} />
                        </label>
                        <label>
                            Padre
                            <select value={form.parent} onChange={e => setForm({...form, parent: e.target.value})}>
                                <option value={''}>\u2014 Ninguno \u2014</option>
                                {options.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                            </select>
                        </label>
                        <div style={{display: 'flex', gap: 8}}>
                            <button onClick={submit}>Guardar</button>
                            <button onClick={() => setMode(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <div>Cargando colecciones…</div>}
        </div>
    );
}
