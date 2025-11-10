'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Container from '@/components/container/Container';
import {post} from '@/utils/request';
import styles from './register.module.css';
import {useSession} from '@/context/SessionContext';
import type { User } from '@/context/SessionContext';

type RegisterBody = { email: string; password: string; displayName: string }
type RegisterResponse = {
    error?: string;
    session?: { token: string; clientToken: string };
    user?: User;
}

export default function RegisterPage() {
    const router = useRouter();
    const { setSession } = useSession();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const fd = new FormData(e.currentTarget);
        const displayName = (fd.get('name') as string)?.trim();
        const email = (fd.get('email') as string)?.trim();
        const password = (fd.get('password') as string)?.trim();
        const confirm = (fd.get('confirm') as string)?.trim();


        if (!displayName || !email || !password || !confirm) return setError('Completa todos los campos.');
        if (password !== confirm) return setError('Las contraseñas no coinciden.');
        if (password.length < 8) return setError('La contraseña debe tener al menos 8 caracteres.');

        setSubmitting(true);

        const res = await post<RegisterBody, RegisterResponse>('/register', {email, password, displayName});
        const {status, data} = res.response;

        if (status >= 200 && status < 300) {
            if (data?.session && data?.user) {
                setSession(data.session, data.user);
                router.push('/repositorio/');
                return;
            }

            router.push('/repositorio/iniciar-sesion');
            return;
        }

        setSubmitting(false);
        setError(data?.error || 'No se pudo crear la cuenta.');
    };

    return (
        <Container
            id="register"
            crumb={["Inicio", <Link key="register" href="/repositorio/crear-cuenta">Crear cuenta</Link>
            ]}
        >
            <div className={styles.card}>
                <h3 className={styles.heading}>Crear cuenta</h3>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form} noValidate>
                    <div className={styles.row2}>
                        <input type="text" name="name" className={styles.input} placeholder="Nombre completo" required/>
                        <input type="email" name="email" className={styles.input} placeholder="E-mail" required/>
                    </div>

                    <input type="password" name="password" className={styles.input} placeholder="Contraseña (mín. 8)"
                           required/>
                    <input type="password" name="confirm" className={styles.input} placeholder="Confirmar contraseña"
                           required/>

                    <button type="submit" className={styles.button} disabled={submitting}>
                        {submitting ? 'Creando…' : 'Crear cuenta'}
                    </button>

                    <div className={styles.help}>
                        <span>¿Ya tenés cuenta?</span>
                        <Link href="/repositorio/iniciar-sesion" className={styles.link}>Iniciar sesión</Link>
                    </div>
                </form>
            </div>
        </Container>
    );
}
