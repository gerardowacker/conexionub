'use client';

import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import treeStyles from '@/components/collection-tree/CollectionTree.module.css';
import { get } from '@/utils/request';
import { Resource } from '@/types/resources';
import { useOptionalToast } from '@/components/toast/ToastProvider';

type DcContributor = { author?: string[]; advisor?: string[] };

type Dc = {
  title?: string | { language: string; title: string }[];
  creator?: string;
  type?: string;
  contributor?: DcContributor;
  date?: { available?: string | Date; issued?: string | Date };
  description?: string | { language: string; abstract: string }[];
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
  { value: 'dc:title', label: 'Título (dc:title)' },
  { value: 'dc:creator', label: 'Autor (dc:creator)' },
  { value: 'dc:contributor.author', label: 'Contributor - Autor (dc:contributor.author)' },
  { value: 'dc:contributor.advisor', label: 'Contributor - Tutor (dc:contributor.advisor)' },
  { value: 'dc:date.issued', label: 'Fecha emisión (dc:date.issued)' },
  { value: 'dc:date.available', label: 'Fecha disponible (dc:date.available)' },
  { value: 'dc:description', label: 'Descripción / Resumen (dc:description)' },
  { value: 'dc:format', label: 'Formato (dc:format)' },
  { value: 'dc:subject', label: 'Subject (dc:subject)' },
  { value: 'dc:publisher', label: 'Publisher (dc:publisher)' },
  { value: 'dc:rights', label: 'Rights / Licencia (dc:rights)' }
];

export default forwardRef(function ResourceForm({ initial = null, onSavedAction }: Props, ref) {
  const toastCtx = useOptionalToast();
  const notify = (opts: { message: string; type?: 'info' | 'error' | 'warn' }) => {
    if (toastCtx && typeof toastCtx.showToast === 'function') {
      toastCtx.showToast({ message: opts.message, type: opts.type ?? 'info' });
      return;
    }
    // fallback console
    // eslint-disable-next-line no-console
    console.warn('[notify]', opts.type ?? 'info', opts.message);
  };

  const [dc, setDc] = useState<Dc>({
    title: typeof initial?.dc?.title === 'string' ? initial?.dc?.title : (Array.isArray(initial?.dc?.title) ? initial?.dc?.title : ''),
    creator: initial?.dc?.creator || '',
    type: initial?.dc?.type || '',
    contributor: initial?.dc?.contributor || { author: [], advisor: [] },
    date: initial?.dc?.date || {},
    description: typeof initial?.dc?.description === 'string' ? initial?.dc?.description : (Array.isArray(initial?.dc?.description) ? initial?.dc?.description : ''),
    format: initial?.dc?.format || '',
    subject: initial?.dc?.subject || [],
    publisher: initial?.dc?.publisher || '',
    rights: initial?.dc?.rights || '',
  });

  const [collection, setCollection] = useState<string | null>(initial?.access?.collection || null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [extraFields, setExtraFields] = useState<{ key: string; value: string }[]>([]);
  const [collectionOptions, setCollectionOptions] = useState<{id:string; name:string}[]>([]);
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    async function loadCollections() {
      setLoadingCollections(true);
      try {
        const res = await get('/collections');
        const cols = Array.isArray(res.response.data) ? res.response.data : [];
        const opts: {id:string; name:string}[] = [];
        function flatten(list: unknown[], depth = 0) {
          (list as any[]).forEach((c: any) => {
            opts.push({ id: c._id, name: `${'- '.repeat(depth)}${c.name}` });
            if (c.children && c.children.length) flatten(c.children, depth + 1);
          });
        }
        flatten(cols);
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
      title: typeof initial.dc?.title === 'string' ? initial.dc.title : (Array.isArray(initial.dc?.title) ? initial.dc.title : prev.title),
      creator: initial.dc?.creator || prev.creator,
      type: initial.dc?.type || prev.type,
      contributor: initial.dc?.contributor || prev.contributor,
      date: initial.dc?.date || prev.date,
      description: typeof initial.dc?.description === 'string' ? initial.dc.description : (Array.isArray(initial.dc?.description) ? initial.dc.description : prev.description),
      format: initial.dc?.format || prev.format,
      subject: initial.dc?.subject || prev.subject,
      publisher: initial.dc?.publisher || prev.publisher,
      rights: initial.dc?.rights || prev.rights,
    }));
    setCollection(initial.access?.collection || null);
  }, [initial]);

  const setField = <K extends keyof Dc>(k: K, v: Dc[K]) => setDc(s => ({ ...s, [k]: v }));

  useImperativeHandle(ref, () => ({ submit }));

  const submit = async () => {
    const token = localStorage.getItem('__lorest');
    const clientToken = localStorage.getItem('__lore_client');
    if (!token || !clientToken) {
      notify({ message: 'Falta sesión', type: 'error' });
      return;
    }
    if (!collection) {
      notify({ message: 'Seleccioná la colección destino', type: 'warn' });
      return;
    }

    const dcCopy: any = { ...dc };
    for (const f of extraFields) {
      const k = f.key;
      const v = f.value;
      if (k.startsWith('dc:')) {
        const path = k.slice(3).split('.');
        let cur = dcCopy;
        for (let i = 0; i < path.length - 1; i++) {
          const p = path[i];
          if (!cur[p]) cur[p] = {};
          cur = cur[p];
        }
        const last = path[path.length - 1];
        if (Array.isArray(cur[last])) cur[last].push(v);
        else if (cur[last] && typeof cur[last] === 'string') cur[last] = [cur[last], v];
        else cur[last] = v;
      }
    }

    const metadata = {
      dc: dcCopy,
      access: { collection, restriction: 0 },
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

          const res = await fetch(host + '/resource/update', { method: 'POST', body: fd });
          const data = await res.json();
          if (res.status === 200) {
            notify({ message: 'Recurso actualizado', type: 'info' });
            if (onSavedAction) onSavedAction(data as Record<string, unknown>);
          } else notify({ message: 'Error: ' + JSON.stringify(data), type: 'error' });
        } else {
          const body = { session: { token, clientToken }, id: initial._id, updateData: { metadata } };
          const res = await fetch(host + '/resource/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          const data = await res.json();
          if (res.status === 200) {
            notify({ message: 'Recurso actualizado', type: 'info' });
            if (onSavedAction) onSavedAction(data as Record<string, unknown>);
          } else notify({ message: 'Error: ' + JSON.stringify(data), type: 'error' });
        }
      } else {
        const fd = new FormData();
        fd.append('token', token);
        fd.append('clientToken', clientToken);
        if (file) fd.append('file', file);
        fd.append('metadata', JSON.stringify(metadata));

        const res = await fetch(host + '/resource/create', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.status === 200) {
          notify({ message: 'Recurso creado', type: 'info' });
          if (onSavedAction) onSavedAction(data as Record<string, unknown>);
        } else notify({ message: 'Error: ' + JSON.stringify(data), type: 'error' });
      }
    } catch (err) {
      console.error(err);
      notify({ message: 'Error en la subida/actualización: ' + String(err), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const addExtraField = () => setExtraFields(prev => [...prev, { key: DC_OPTIONS[0].value, value: '' }]);
  const updateExtraField = (idx: number, changed: Partial<{ key: string; value: string }>) => setExtraFields(prev => prev.map((p,i)=> i===idx ? {...p, ...changed} : p));
  const removeExtraField = (idx: number) => setExtraFields(prev => prev.filter((_,i)=> i!==idx));

  return (
    <div className={treeStyles['dialogForm']}>
        <label>
            Título (dc:title)
            <input value={typeof dc.title === 'string' ? dc.title : ''} onChange={e => setField('title', e.target.value)} />
        </label>

        <label>
            Autor (dc:creator)
            <input value={dc.creator || ''} onChange={e => setField('creator', e.target.value)} />
        </label>

        <label>
            Tipo (dc:type)
            <input value={dc.type || ''} onChange={e => setField('type', e.target.value)} />
        </label>

        {extraFields.map((f, idx) => (
            <div key={idx} style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <select value={f.key} onChange={e => updateExtraField(idx, { key: e.target.value })} style={{maxWidth: 320}}>
                  {DC_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <input value={f.value} onChange={e => updateExtraField(idx, { value: e.target.value })} placeholder="Valor" />
                <button type="button" className={treeStyles['toggle-btn']} onClick={() => removeExtraField(idx)}>Eliminar</button>
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
            <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
        </label>
    </div>
  );
});
