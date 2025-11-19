"use client";

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import Container from '@/components/container/Container';
import CollectionAdminSelector from '@/components/admin/CollectionAdminSelector';
import {useSession} from '@/context/SessionContext';
import {post} from '@/utils/request';
import {useOptionalToast} from '@/components/toast/ToastProvider';
import styles from './page.module.css';
import type {Collection} from '@/types/collections';
import useCollections from '@/hooks/useCollections';

export default function PerfilPage() {
    const {user, token, clientToken} = useSession();
    const toast = useOptionalToast();

    const [collections, setCollections] = useState<Collection[]>([]);
    const [selected, setSelected] = useState<string | null>(null);
    const [subs, setSubs] = useState<string[]>(user?.subscriptions ?? []);
    const [adding, setAdding] = useState(false);
    const [removing, setRemoving] = useState<string[]>([]);

    console.log(user, token, clientToken)

    useEffect(() => {
        setSubs(user?.subscriptions ?? []);
    }, [user]);

    const {collections: hookCollections} = useCollections();
    useEffect(() => {
        setCollections(hookCollections ?? []);
    }, [hookCollections]);

    const handleRemove = async (id: string) => {
        if (!token || !clientToken) {
            toast?.showToast({message: 'Debés iniciar sesión para desuscribirte', type: 'error'});
            return;
        }
        if (!subs.includes(id)) {
            return;
        }
        setRemoving(prev => [...prev, id]);
        try {
            const payload = {token, clientToken, collection: id};
            const res = await post('/user/unsubscribe', payload);
            const status = res?.response?.status ?? 500;
            const data = res?.response?.data;
            if (status === 200) {
                const msg = (data && (data.message || data.msg)) ? (data.message || data.msg) : 'Suscripción removida';
                toast?.showToast({message: msg, type: 'info'});
                setSubs(prev => prev.filter(x => x !== id));
            } else {
                const errMsg = (data && (data.message || data.error || data.msg)) ? (data.message || data.error || data.msg) : JSON.stringify(data || status);
                toast?.showToast({message: 'Error: ' + errMsg, type: 'error'});
            }
        } catch (err) {
            console.error(err);
            toast?.showToast({message: 'Error al desuscribirse', type: 'error'});
        } finally {
            setRemoving(prev => prev.filter(x => x !== id));
        }
    };

    function findName(id: string) {
        function search(list: Collection[] | undefined): string | null {
            if (!list || list.length === 0) return null;
            for (const col of list) {
                if (col._id === id) return col.name;
                if (col.children && col.children.length) {
                    const res = search(col.children);
                    if (res) return res;
                }
            }
            return null;
        }

        const found = search(collections.length ? collections : hookCollections);
        return found ?? id;
    }

    const handleAdd = async () => {
        if (!token || !clientToken) {
            toast?.showToast({message: 'Debés iniciar sesión para suscribirte', type: 'error'});
            return;
        }
        if (!selected) {
            toast?.showToast({message: 'Seleccioná una colección', type: 'warn'});
            return;
        }
        if (subs.includes(selected)) {
            toast?.showToast({message: 'Ya estás suscripto a esa colección', type: 'warn'});
            return;
        }
        setAdding(true);
        try {
            const payload = {token, clientToken, collection: selected};
            const res = await post('/user/subscribe', payload);
            const status = res?.response?.status ?? 500;
            const data = res?.response?.data;
            if (status === 200) {
                const msg = (data && (data.message || data.msg)) ? (data.message || data.msg) : 'Suscripción agregada';
                toast?.showToast({message: msg, type: 'info'});
                setSubs(prev => [...prev, selected]);
            } else {
                const errMsg = (data && (data.message || data.error || data.msg)) ? (data.message || data.error || data.msg) : JSON.stringify(data || status);
                toast?.showToast({message: 'Error: ' + errMsg, type: 'error'});
            }
        } catch (err) {
            console.error(err);
            toast?.showToast({message: 'Error al suscribirse', type: 'error'});
        } finally {
            setAdding(false);
        }
    };

    if (!user) {
        return (
            <Container id={'perfil'} crumb={[<Link key={'rep'}
                                                   href={'/repositorio'}>Repositorio</Link>, 'Perfil', 'Datos del usuario']}>
                <div className={styles['empty']}>Necesitás iniciar sesión. <Link href={'/repositorio/iniciar-sesion'}>Iniciar
                    sesión</Link></div>
            </Container>
        );
    }

    const levelText = (lvl: number) => {
        if (lvl === 0) return 'Usuario';
        if (lvl === 1) return (<Link href={'/repositorio/admin'} className={styles['admin-link']}>Moderador</Link>);
        if (lvl === 2) return (<Link href={'/repositorio/admin'} className={styles['admin-link']}>Administrador</Link>);
        return 'Usuario';
    };

    return (
        <Container id={'perfil'}
                   crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
                       <Link key={'per'} href={"#perfil"}>Perfil</Link>]}>
            <h1 className={styles['title']}>Datos del usuario</h1>

            <div className={styles['infoGrid']}>
                <div className={styles['infoItem']}>
                    <div className={styles['label']}>Correo electrónico:</div>
                    <div className={styles['value']}>{user.email}</div>
                </div>
                <div className={styles['infoItem']}>
                    <div className={styles['label']}>Nombre:</div>
                    <div className={styles['value']}>{user.displayName}</div>
                </div>
                <div className={styles['infoItem']}>
                    <div className={styles['label']}>Nivel de usuario:</div>
                    <div className={styles['value']}>{levelText(user.level)}</div>
                </div>
            </div>

            <h2 className={styles['sectionTitle']}>Suscripciones a colecciones</h2>
            <section className={styles['section']}>
                <div className={styles['addRow']}>
                    <div style={{flex: 1}}>
                        <CollectionAdminSelector value={selected} onChangeAction={(v) => setSelected(v)}
                                                 showControls={false} externalCollections={hookCollections}/>
                    </div>
                    <div style={{marginLeft: 12}}>
                        <button className={styles['btnPrimary']} onClick={handleAdd}
                                disabled={adding}>{adding ? 'Añadiendo…' : 'Añadir'}</button>
                    </div>
                </div>

                <div className={styles['subscriptionsList']}>
                    {subs.length === 0 && <div className={styles['muted']}>No hay suscripciones aún.</div>}
                    {subs.map(s => (
                        <div key={s} className={styles['subscriptionItem']}>
                            <Link href={"/repositorio/coleccion/" + s}
                                  className={styles['subName']}>{findName(s)}</Link>
                            <button aria-label={`Desuscribirse de ${findName(s)}`} className={styles['subRemove']}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        handleRemove(s);
                                    }} disabled={removing.includes(s)}>×
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </Container>
    );
}
