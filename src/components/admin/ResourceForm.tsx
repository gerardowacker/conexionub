'use client';

import React, { useEffect, useState } from 'react';
import CollectionAdminSelector from '@/components/admin/CollectionAdminSelector';
import styles from '@/components/form/Form.module.css';
import { Resource } from '@/types/resources';

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
  onSavedAction?: (res: Record<string, unknown> | null) => void; // renamed to satisfy client prop rules
};

const host = process.env.NEXT_PUBLIC_LORE_HOST || '';

export default function ResourceForm({ initial = null, onSavedAction }: Props) {
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

  const submit = async () => {
    const token = localStorage.getItem('__lorest');
    const clientToken = localStorage.getItem('__lore_client');
    if (!token || !clientToken) return alert('Falta sesión');
    if (!collection) return alert('Seleccioná la colección destino');

    const metadata = {
      dc,
      access: {
        collection,
        restriction: 0,
      },
    } as Record<string, unknown>;

    try {
      setLoading(true);

      // Si viene un `initial`, asumimos que es edición y llamamos al endpoint de actualización.
      if (initial && initial._id) {
        // Si hay archivo, enviamos multipart similar a creación pero incluyendo el id.
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
            alert('Recurso actualizado');
            if (onSavedAction) onSavedAction(data as Record<string, unknown>);
          } else {
            alert('Error: ' + JSON.stringify(data));
          }
        } else {
          // Sin archivo: enviamos JSON con session, id y updateData (metadata)
          const body = { session: { token, clientToken }, id: initial._id, updateData: { metadata } };
          const res = await fetch(host + '/resource/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          const data = await res.json();
          if (res.status === 200) {
            alert('Recurso actualizado');
            if (onSavedAction) onSavedAction(data as Record<string, unknown>);
          } else {
            alert('Error: ' + JSON.stringify(data));
          }
        }
      } else {
        // Creación (comportamiento ya existente)
        const fd = new FormData();
        fd.append('token', token);
        fd.append('clientToken', clientToken);
        if (file) fd.append('file', file);
        fd.append('metadata', JSON.stringify(metadata));

        const res = await fetch(host + '/resource/create', { method: 'POST', body: fd });
        const data = await res.json();
        if (res.status === 200) {
          alert('Recurso creado');
          if (onSavedAction) onSavedAction(data as Record<string, unknown>);
        } else {
          alert('Error: ' + JSON.stringify(data));
        }
      }
    } catch (err) {
      console.error(err);
      alert('Error en la subida/actualización: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <label>
            Título (dc:title)
            <input className={styles['input']} value={typeof dc.title === 'string' ? dc.title : ''} onChange={e => setField('title', e.target.value)} />
          </label>

          <label>
            Autor (dc:creator)
            <input className={styles['input']} value={dc.creator || ''} onChange={e => setField('creator', e.target.value)} />
          </label>

          <label>
            Tipo (dc:type)
            <input className={styles['input']} value={dc.type || ''} onChange={e => setField('type', e.target.value)} />
          </label>

          <label>
            Descripción / Resumen (dc:description)
            <textarea className={styles['input']} value={typeof dc.description === 'string' ? dc.description : ''} onChange={e => setField('description', e.target.value)} />
          </label>

          <label>
            Fecha (dc:date.issued)
            <input type="date" className={styles['input']} value={typeof dc.date?.issued === 'string' ? dc.date?.issued : (dc.date?.issued instanceof Date ? dc.date.issued.toISOString().slice(0,10) : '')} onChange={e => setField('date', { ...(dc.date || {}), issued: e.target.value })} />
          </label>

          <label>
            Subjects (dc:subject) — separar con comas
            <input className={styles['input']} value={(Array.isArray(dc.subject) ? dc.subject.join(', ') : dc.subject) || ''} onChange={e => setField('subject', e.target.value.split(',').map(s=>s.trim()).filter(Boolean))} />
          </label>

          <label>
            Publisher (dc:publisher)
            <input className={styles['input']} value={dc.publisher || ''} onChange={e => setField('publisher', e.target.value)} />
          </label>

          <label>
            Rights / Licencia (dc:rights)
            <input className={styles['input']} value={dc.rights || ''} onChange={e => setField('rights', e.target.value)} />
          </label>

        </div>
      </div>

      <div style={{ width: 360 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <label>
              Colección destino
              <CollectionAdminSelector value={collection} onChangeAction={v => setCollection(v)} showControls={true} />
            </label>
          </div>

          <div>
            <label>
              Archivo
              <input type="file" onChange={e => setFile(e.target.files ? e.target.files[0] : null)} />
            </label>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={submit} disabled={loading}>{loading ? (initial ? 'Actualizando…' : 'Subiendo…') : (initial ? 'Actualizar Recurso' : 'Crear Recurso')}</button>
            <button onClick={() => { setDc({}); setFile(null); if (onSavedAction && initial) onSavedAction(null); }}>Limpiar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
