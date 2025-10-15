'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionContext } from '@/context/SessionContext';

export default function LoginPage() {
    const session = useContext(SessionContext);
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const user = session?.user;
    const login = session?.login;

    useEffect(() => {
        if (user) router.push('/repositorio');
    }, [user, router]);

    if (!session) {
        setError('El contexto de sesión no está disponible.')
        return;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData(e.currentTarget);
        const email = (formData.get('email') as string)?.trim();
        const password = (formData.get('password') as string)?.trim();

        if (!email || !password) {
            setError('Debes ingresar un correo y una contraseña.');
            return;
        }

        if (!login) {
            setError('No se puede iniciar sesión: función de login no disponible.');
            return;
        }

        try {
            await login(email, password);
            router.push('/');
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Error al iniciar sesión.');
            } else {
                setError('Error al iniciar sesión.');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p className="red">{error}</p>}
            <input type="email" name="email" placeholder="Correo electrónico" required/>
            <input type="password" name="password" placeholder="Contraseña" required/>
            <button type="submit">Iniciar sesión</button>
        </form>
    );
}