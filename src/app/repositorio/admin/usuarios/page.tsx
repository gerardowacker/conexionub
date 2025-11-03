'use client';

import React, {useEffect, useState, useCallback} from 'react';
import Container from '@/components/container/Container';
import Link from 'next/link';
import {post} from '@/utils/request';
import {useSession} from '@/context/SessionContext';
import {notFound} from "next/navigation";
import styles from './page.module.css';
import {ToastProvider, useToast} from '@/components/toast/ToastProvider';

let adminUsersInitialLoaded = false;

type User = { _id: string; email: string; displayName: string; level: number };

function AdminUsersInner() {
    const {user, token, clientToken} = useSession();
    const {showToast} = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageSize] = useState(20);
    const [lastUser, setLastUser] = useState<string | null>(null);
    const loadingRef = React.useRef(false);
    const reqSeqRef = React.useRef(0);

    const load = useCallback(async (append = false, cursor: string | null = null) => {
        if (!token || !clientToken) return;
        if (loadingRef.current) {
            console.log('[admin users] load ignored: already loading');
            return;
        }
        loadingRef.current = true;
        setLoading(true);
        reqSeqRef.current += 1;
        const mySeq = reqSeqRef.current;
        console.log('[admin users] load called', {append, cursor, mySeq});
        try {
            const res = await post('/users', {token, clientToken, pageSize, lastUser: cursor});
            console.log('[admin users] response', res.response);
            const raw: unknown = res.response.data ?? {};
            console.log('[admin users] raw body', raw);
            let arr: unknown[] = [];
            if (Array.isArray(raw)) arr = raw as unknown[];
            else {
                const rawObj = raw as Record<string, unknown> | null;
                if (rawObj && Array.isArray(rawObj.users as unknown)) arr = rawObj.users as unknown[];
                else if (rawObj && Array.isArray(rawObj.data as unknown)) arr = rawObj.data as unknown[];
                else if (rawObj && Array.isArray(rawObj.result as unknown)) arr = rawObj.result as unknown[];
            }

            const normalized: User[] = arr.map(u => {
                const obj = u as Record<string, unknown>;
                const id = typeof obj._id === 'string' ? obj._id : (typeof obj.id === 'string' ? obj.id : '');
                const email = typeof obj.email === 'string' ? obj.email : (typeof obj.mail === 'string' ? obj.mail : '');
                const displayName = typeof obj.displayName === 'string' ? obj.displayName : (typeof obj.name === 'string' ? obj.name : (typeof obj.display === 'string' ? obj.display : ''));
                const level = typeof obj.level === 'number' ? obj.level : Number(obj.level ?? 0);
                return {_id: id, email, displayName, level} as User;
            });

            if (mySeq === reqSeqRef.current) {
                console.log('[admin users] applying response seq', mySeq);
                setUsers(prev => append ? [...prev, ...normalized] : normalized);
                const rawObj2 = (raw as Record<string, unknown> | null);
                const last = (rawObj2 && ((rawObj2.lastUser as string) ?? (rawObj2.last as string))) ?? null;
                if (last) setLastUser(last as string);
            } else {
                console.log('[admin users] Ignoring stale response (seq)', mySeq, 'current', reqSeqRef.current);
            }
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }, [token, clientToken, pageSize]);

    useEffect(() => {
        if (!user) return;
        if (user.level < 2) return;
        if (adminUsersInitialLoaded) {
            console.log('[admin users] initial load already performed (module flag)');
            return;
        }
        adminUsersInitialLoaded = true;
        load();
    }, [user, load]);

    if (!user) {
        return <>Cargando</>
    }

    if (user.level < 2) {
        return notFound()
    }

    const changeRole = async (u: User, newLevel: string) => {
        if (!token || !clientToken) return showToast({type: 'error', message: 'Falta sesión'});
        const payload: Record<string, unknown> = {userId: u._id, level: newLevel, token, clientToken};
        try {
            const res = await post<Record<string, unknown>>('/user/bump', payload);
            if (res.response.status === 200) {
                showToast({type: 'info', message: 'Nivel actualizado'});
                setUsers(prev => prev.map(p => p._id === u._id ? {...p, level: parseInt(newLevel)} : p));
            } else {
                showToast({
                    type: 'error',
                    message: 'Error al actualizar: ' + JSON.stringify(res.response.data || res.response.status)
                });
            }
        } catch (err) {
            console.error('[admin users] changeRole error', err);
            showToast({
                type: 'error',
                message: 'Error en la petición: ' + (err instanceof Error ? err.message : String(err))
            });
        }
    };

    const visibleUsers = users.filter(u => {
        const sessionId = (user as User)?._id as string | undefined;
        const isSelf = sessionId ? (u._id === sessionId) : (u.email === user.email);
        const higherLevel = u.level > user.level;
        return !isSelf && !higherLevel;
    });

    return (
        <Container id={'admin-users'} crumb={[<Link key={'rep'} href={'/repositorio'}>Repositorio</Link>,
            <Link key={'admin'} href={'/repositorio/admin'}>Admin</Link>]}>
            <h1 className={styles.title}>Administración de usuarios</h1>
            <div className={styles.actions}>
                <button className={styles.buttonSecondary} onClick={() => load(false, null)}>Refrescar usuarios</button>
            </div>
            {loading && <div className={styles.loading}>Cargando…</div>}
            <div className={styles.list}>
                {(!loading && visibleUsers.length === 0) ? (
                    <div className={`${styles.userCard} ${styles.placeholder}`}>
                        <div className={styles.userInfo}>
                            <div className={styles.displayName}><strong>No hay más usuarios (refrescar lista para confirmar)</strong></div>
                        </div>
                    </div>
                ) : (
                    visibleUsers.map(u => (
                        <div key={u._id} className={styles.userCard}>
                            <div className={styles.userInfo}>
                                <div className={styles.displayName}><strong>{u.displayName || u.email}</strong></div>
                                <div className={styles.email}>{u.email}</div>
                            </div>
                            <div className={styles.roleSelect}>
                                <select value={u.level} onChange={e => changeRole(u, e.target.value)}
                                        className={styles.select}>
                                    <option value={0}>Usuario</option>
                                    <option value={1}>Moderador</option>
                                    <option value={2}>Administrador</option>
                                </select>
                            </div>
                        </div>
                    ))
                )}

                <div className={styles.actions}>
                    <button className={styles.button} onClick={() => load(true, lastUser)}>Cargar más</button>
                </div>
            </div>
        </Container>
    );
}

export default function AdminUsers() {
    return (
        <ToastProvider>
            <AdminUsersInner/>
        </ToastProvider>
    );
}
