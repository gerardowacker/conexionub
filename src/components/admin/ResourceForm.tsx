'use client';

import React, {useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import treeStyles from '@/components/collection-tree/CollectionTree.module.css';
import {get} from '@/utils/request';
import {Resource} from '@/types/resources';
import {useOptionalToast} from '@/components/toast/ToastProvider';
import {useSession} from '@/context/SessionContext';

type DcContributor = { author?: string[]; advisor?: string[] };

type Dc = {
    title?: string;
    creator?: string;
    type?: string;
    contributor?: DcContributor;
    date?: { available?: string | Date; issued?: string | Date };
    description?: string;
    format?: string;
    subject?: string[];
    publisher?: string;
    rights?: string;
};

type Props = {
    initial?: Resource | null;
    onSavedAction?: (res: Record<string, unknown> | null) => void;
};

const host = process.env.NEXT_PUBLIC_LORE_HOST || '';

const DC_OPTIONS: { value: string; label: string }[] = [
    {value: 'dc:title', label: 'Título (dc:title)'},
    {value: 'dc:creator', label: 'Autor (dc:creator)'},
    {value: 'dc:contributor.author', label: 'Contributor - Autor (dc:contributor.author)'},
    {value: 'dc:contributor.advisor', label: 'Contributor - Tutor (dc:contributor.advisor)'},
    {value: 'dc:date.issued', label: 'Fecha emisión (dc:date.issued)'},
    {value: 'dc:date.available', label: 'Fecha disponible (dc:date.available)'},
    {value: 'dc:description', label: 'Descripción / Resumen (dc:description)'},
    {value: 'dc:format', label: 'Formato (dc:format)'},
    {value: 'dc:subject', label: 'Subject (dc:subject)'},
    {value: 'dc:publisher', label: 'Publisher (dc:publisher)'},
    {value: 'dc:rights', label: 'Rights / Licencia (dc:rights)'}
];

function extractSpanishTitle(t: unknown): string {
    if (!t) return '';
    if (typeof t === 'string') return t;
    if (Array.isArray(t)) {
        const arr = t as unknown[];
        const found = arr.find((x): x is {
            language?: string;
            title?: string
        } => typeof x === 'object' && x !== null && ((x as { language?: unknown }).language === 'es'));
        if (found && found.title) return found.title;
        const first = arr[0] as { title?: string } | undefined;
        if (first && first.title) return first.title;
    }
    return '';
}

function extractSpanishDescription(d: unknown): string {
    if (!d) return '';
    if (typeof d === 'string') return d;
    if (Array.isArray(d)) {
        const arr = d as unknown[];
        const found = arr.find((x): x is {
            language?: string;
            abstract?: string
        } => typeof x === 'object' && x !== null && ((x as { language?: unknown }).language === 'es'));
        if (found && found.abstract) return found.abstract;
        const first = arr[0] as { abstract?: string } | undefined;
        if (first && first.abstract) return first.abstract;
    }
    return '';
}

const MULTI_ALLOWED = new Set(['dc:contributor.author', 'dc:contributor.advisor', 'dc:subject']);

export default forwardRef(function ResourceForm({initial = null, onSavedAction}: Props, ref) {
    const toastCtx = useOptionalToast();
    const {token, clientToken} = useSession();
    const notify = (opts: { message: string; type?: 'info' | 'error' | 'warn' }) => {
        if (toastCtx && typeof toastCtx.showToast === 'function') {
            toastCtx.showToast({message: opts.message, type: opts.type ?? 'info'});
            return;
        }
        console.warn('[notify]', opts.type ?? 'info', opts.message);
    };

    const [dc, setDc] = useState<Dc>({
        title: extractSpanishTitle(initial?.dc?.title),
        creator: initial?.dc?.creator || '',
        type: initial?.dc?.type || '',
        contributor: initial?.dc?.contributor || {author: [], advisor: []},
        date: initial?.dc?.date || {},
        description: extractSpanishDescription(initial?.dc?.description),
        format: initial?.dc?.format || '',
        subject: initial?.dc?.subject || [],
        publisher: initial?.dc?.publisher || '',
        rights: initial?.dc?.rights || '',
    });

    const [collection, setCollection] = useState<string | null>(initial?.access?.collection || null);
    const [file, setFile] = useState<File | null>(null);
    const [, setLoading] = useState(false);

    const [extraFields, setExtraFields] = useState<{ key: string; value: string }[]>([]);
    const [collectionOptions, setCollectionOptions] = useState<{ id: string; name: string }[]>([]);
    const [, setLoadingCollections] = useState(false);

    useEffect(() => {
        async function loadCollections() {
            setLoadingCollections(true);
            try {
                const res = await get('/collections');
                const cols = Array.isArray(res.response.data) ? res.response.data as unknown[] : [];
                const opts: { id: string; name: string }[] = [];

                type Col = { _id: string; name: string; children?: Col[] };

                function flatten(list: Col[], depth = 0) {
                    list.forEach((c: Col) => {
                        opts.push({id: c._id, name: `${'- '.repeat(depth)}${c.name}`});
                        if (c.children && c.children.length) flatten(c.children, depth + 1);
                    });
                }

                flatten(cols as Col[]);
                setCollectionOptions(opts);
            } catch (err) {
                console.error('Error cargando colecciones', err);
            } finally {
                setLoadingCollections(false);
            }
        }

        loadCollections();
    }, []);

    useEffect(() => {
        if (!initial) return;
        setDc(prev => ({
            ...prev,
            title: extractSpanishTitle(initial.dc?.title) || prev.title,
            creator: initial.dc?.creator || prev.creator,
            type: initial.dc?.type || prev.type,
            contributor: initial.dc?.contributor || prev.contributor,
            date: initial.dc?.date || prev.date,
            description: extractSpanishDescription(initial.dc?.description) || prev.description,
            format: initial.dc?.format || prev.format,
            subject: initial.dc?.subject || prev.subject,
            publisher: initial.dc?.publisher || prev.publisher,
            rights: initial.dc?.rights || prev.rights,
        }));
        setCollection(initial.access?.collection || null);

        if (initial.dc && extraFields.length === 0) {
            const skipKeys = new Set([
                'dc:title', 'dc:creator', 'dc:description', 'dc:format', 'dc:subject', 'dc:publisher', 'dc:rights',
            ]);

            const foundExtras: { key: string; value: string }[] = [];

            DC_OPTIONS.forEach(o => {
                const key = o.value;
                if (skipKeys.has(key)) return;

                const path = key.slice(3).split('.');
                let cur: unknown = initial.dc as unknown;
                for (let i = 0; i < path.length; i++) {
                    if (cur == null) {
                        cur = undefined;
                        break;
                    }
                    if (typeof cur === 'object') {
                        const obj = cur as Record<string, unknown>;
                        if (Object.prototype.hasOwnProperty.call(obj, path[i])) {
                            cur = obj[path[i]];
                        } else {
                            cur = undefined;
                            break;
                        }
                    } else {
                        cur = undefined;
                        break;
                    }
                }

                if (cur === undefined || cur === null) return;

                const extractValue = (v: unknown): string | null => {
                    if (v == null) return null;
                    if (typeof v === 'string') return v.trim() ? v : null;
                    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
                    if (Array.isArray(v)) {
                        const parts = (v as unknown[]).map((x) => extractValue(x));
                        const filtered = parts.filter((x): x is string => x != null);
                        return filtered.length ? filtered.join(', ') : null;
                    }
                    if (typeof v === 'object') {
                        const obj = v as Record<string, unknown>;
                        const maybe = obj.title ?? obj.name ?? obj.abstract ?? obj.value ?? obj.label ?? obj['@value'];
                        if (typeof maybe === 'string' && maybe.trim()) return maybe;
                        if (typeof maybe === 'number' || typeof maybe === 'boolean') return String(maybe);
                        try {
                            const str = JSON.stringify(obj);
                            return str && str !== '{}' ? str : null;
                        } catch {
                            return null;
                        }
                    }
                    return null;
                };

                if (Array.isArray(cur)) {
                    const arr = cur as unknown[];
                    if (MULTI_ALLOWED.has(key)) {
                        arr.forEach((v) => {
                            const val = extractValue(v);
                            if (val != null) foundExtras.push({key, value: val});
                        });
                    } else {
                        const mapped = arr.map((v) => extractValue(v));
                        const filtered = mapped.filter((x): x is string => x != null);
                        const val = filtered.length ? filtered[0] : null;
                        if (val != null) foundExtras.push({key, value: val});
                    }
                } else if (typeof cur === 'object') {
                    const val = extractValue(cur);
                    if (val != null) foundExtras.push({key, value: val});
                } else {
                    foundExtras.push({key, value: String(cur)});
                }
            });

            if (foundExtras.length) setExtraFields(foundExtras);
        }
    }, [initial, extraFields.length]);

    const setField = <K extends keyof Dc>(k: K, v: Dc[K]) => setDc(s => ({...s, [k]: v}));

    useImperativeHandle(ref, () => ({submit}));

    const submit = async () => {
        if (!token || !clientToken) {
            notify({message: 'Falta sesión', type: 'error'});
            return;
        }
        if (!collection) {
            notify({message: 'Seleccioná la colección destino', type: 'warn'});
            return;
        }

        const dcCopy = {...dc} as Record<string, unknown>;

        const titleVal = dcCopy['title'];
        if (titleVal) {
            if (typeof titleVal === 'string') {
                dcCopy['title'] = [{language: 'es', title: titleVal}];
            } else if (Array.isArray(titleVal)) {
                dcCopy['title'] = (titleVal as unknown[]).map((t) => typeof t === 'string' ? {
                    language: 'es',
                    title: t
                } : (t as { language?: string; title?: string }));
            }
        } else {
            dcCopy['title'] = [{language: 'es', title: ''}];
        }

        const descVal = dcCopy['description'];
        if (descVal) {
            if (typeof descVal === 'string') {
                dcCopy['description'] = [{language: 'es', abstract: descVal}];
            } else if (Array.isArray(descVal)) {
                dcCopy['description'] = (descVal as unknown[]).map((d) => (typeof d === 'string' ? {
                    language: 'es',
                    abstract: d
                } : (d as { language?: string; abstract?: string })));
            }
        }

        const emptyExtras = extraFields.filter(f => f.value.trim() === '');
        if (emptyExtras.length > 0) {
            notify({message: 'Completá todos los campos o eliminalos antes de guardar', type: 'warn'});
            return;
        }

        for (const f of extraFields) {
            const k = f.key;
            const v = f.value;
            if (k.startsWith('dc:')) {
                const path = k.slice(3).split('.');
                let cur: Record<string, unknown> = dcCopy;
                for (let i = 0; i < path.length - 1; i++) {
                    const p = path[i];
                    const next = (cur as Record<string, unknown>)[p];
                    if (!next || typeof next !== 'object') (cur as Record<string, unknown>)[p] = {};
                    cur = (cur as Record<string, unknown>)[p] as Record<string, unknown>;
                }
                const last = path[path.length - 1];
                const lastVal = (cur as Record<string, unknown>)[last];
                if (Array.isArray(lastVal)) (lastVal as unknown[]).push(v);
                else if (lastVal && typeof lastVal === 'string') (cur as Record<string, unknown>)[last] = [lastVal, v];
                else (cur as Record<string, unknown>)[last] = v;
            }
        }

        const metadata = {
            dc: dcCopy,
            access: {collection, restriction: 0},
        } as Record<string, unknown>;

        try {
            setLoading(true);
            if (initial && initial._id) {
                if (file) {
                    const fd = new FormData();
                    fd.append('token', token);
                    fd.append('clientToken', clientToken);
                    fd.append('id', initial._id);
                    fd.append('file', file);
                    fd.append('metadata', JSON.stringify(metadata));

                    const res = await fetch(host + '/resource/update', {method: 'POST', body: fd});
                    const data = await res.json();
                    if (res.status === 200) {
                        notify({message: 'Recurso actualizado', type: 'info'});
                        if (onSavedAction) onSavedAction(data as Record<string, unknown>);
                    } else notify({message: 'Error: ' + JSON.stringify(data), type: 'error'});
                } else {
                    const body = {session: {token, clientToken}, id: initial._id, metadata};
                    const res = await fetch(host + '/resource/update', {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    if (res.status === 200) {
                        notify({message: 'Recurso actualizado', type: 'info'});
                        if (onSavedAction) onSavedAction(data as Record<string, unknown>);
                    } else notify({message: 'Error: ' + JSON.stringify(data), type: 'error'});
                }
            } else {
                const fd = new FormData();
                fd.append('token', token);
                fd.append('clientToken', clientToken);
                if (file) fd.append('file', file);
                fd.append('metadata', JSON.stringify(metadata));

                const res = await fetch(host + '/resource/create', {method: 'POST', body: fd});
                const data = await res.json();
                if (res.status === 200) {
                    notify({message: 'Recurso creado', type: 'info'});
                    if (onSavedAction) onSavedAction(data as Record<string, unknown>);
                } else notify({message: 'Error: ' + JSON.stringify(data), type: 'error'});
            }
        } catch (err) {
            console.error(err);
            notify({message: 'Error en la subida/actualización: ' + String(err), type: 'error'});
        } finally {
            setLoading(false);
        }
    };

    const addExtraField = () => {
        setExtraFields(prev => {
            const hasEmpty = prev.some(p => p.value.trim() === '');
            if (hasEmpty) {
                notify({message: 'Completá o eliminá el campo vacío antes de agregar otro', type: 'warn'});
                return prev;
            }
            const used = prev.map(p => p.key);
            const unused = DC_OPTIONS.find(o => !used.includes(o.value));
            const defaultKey = unused ? unused.value : (DC_OPTIONS.find(o => MULTI_ALLOWED.has(o.value))?.value || DC_OPTIONS[0].value);
            return [...prev, {key: defaultKey, value: ''}];
        });
    };

    const updateExtraField = (idx: number, changed: Partial<{
        key: string;
        value: string
    }>) => {
        if (changed.key) {
            setExtraFields(prev => {
                const newKey = changed.key as string;
                const conflict = prev.some((p, i) => i !== idx && p.key === newKey);
                if (conflict && !MULTI_ALLOWED.has(newKey)) {
                    notify({message: 'Solo se permite un campo de este tipo', type: 'warn'});
                    return prev;
                }
                return prev.map((p, i) => i === idx ? {...p, ...changed} : p);
            });
            return;
        }

        if (Object.prototype.hasOwnProperty.call(changed, 'value')) {
            const v = changed.value as string | undefined;
            if (!v || v.trim() === '') {
                notify({
                    message: 'El valor del campo no puede estar vacío. Eliminá el campo si no lo necesitás.',
                    type: 'warn'
                });
                return;
            }
        }

        setExtraFields(prev => prev.map((p, i) => i === idx ? {...p, ...changed} : p));
    };

    const removeExtraField = (idx: number) => setExtraFields(prev => prev.filter((_, i) => i !== idx));

    return (
        <div className={treeStyles['dialogForm']}>
            <label>
                Título (dc:title)
                <input value={dc.title ?? ''}
                       onChange={e => setField('title', e.target.value)}/>
            </label>

            <label>
                Autor (dc:creator)
                <input value={dc.creator || ''} onChange={e => setField('creator', e.target.value)}/>
            </label>

            <label>
                Tipo (dc:type)
                <input value={dc.type || ''} onChange={e => setField('type', e.target.value)}/>
            </label>

            <label>
                Descripción / Resumen (dc:description)
                <textarea value={dc.description || ''} onChange={e => setField('description', e.target.value)}/>
            </label>

            {extraFields.map((f, idx) => (
                <div key={idx} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <select value={f.key} onChange={e => updateExtraField(idx, {key: e.target.value})}
                            style={{maxWidth: 320}}>
                        {DC_OPTIONS.map(o => {
                            const usedByOthers = extraFields.some((p, i) => i !== idx && p.key === o.value);
                            const disabled = usedByOthers && !MULTI_ALLOWED.has(o.value);
                            return <option key={o.value} value={o.value} disabled={disabled}>{o.label}</option>;
                        })}
                    </select>
                    <input value={f.value} onChange={e => updateExtraField(idx, {value: e.target.value})}
                           placeholder="Valor"/>
                    <button type="button" className={treeStyles['toggle-btn']}
                            onClick={() => removeExtraField(idx)}>Eliminar
                    </button>
                </div>
            ))}
            <div>
                <button type="button" className={treeStyles['createBtn']} onClick={addExtraField}>Agregar campo</button>
            </div>

            <label>
                Colección destino
                <select value={collection ?? ''} onChange={e => setCollection(e.target.value || null)}>
                    <option value="">Ninguno</option>
                    {collectionOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                </select>
            </label>

            <label>
                Archivo
                <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)}/>
            </label>
        </div>
    );
});
