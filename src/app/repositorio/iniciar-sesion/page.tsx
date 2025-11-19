'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SessionContext } from '@/context/SessionContext';
import Container from '@/components/container/Container';
import styles from './login.module.css';

export default function LoginPage() {
  const session = useContext(SessionContext);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const user = session?.user;
  const login = session?.login;

  useEffect(() => {
    if (user) router.push('/repositorio');
  }, [user, router]);

  const missingContext = !session;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!login) {
      setError('No se puede iniciar sesión: función de login no disponible.');
      return;
    }

    const formData = new FormData(e.currentTarget);
    const email = (formData.get('email') as string)?.trim();
    const password = (formData.get('password') as string)?.trim();

    if (!email || !password) {
      setError('Debés ingresar un correo y una contraseña.');
      return;
    }

    try {
      setSubmitting(true);
      await login(email, password);
      router.push('/repositorio');
    } catch (err) {
      setSubmitting(false);
      setError(err instanceof Error ? (err.message || 'Error al iniciar sesión.') : 'Error al iniciar sesión.');
    }
  };

  return (
    <Container id="login" crumb={["Inicio",<Link key="login" href="/repositorio/iniciar-sesion">Iniciar sesión</Link>]}>
      <div className={styles.card}>
        <h3 className={styles.heading}>Iniciar sesión</h3>

        {missingContext && <div className={styles.alert}>El contexto de sesión no está disponible.</div>}

        {!missingContext && (
          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {error && <div className={styles.error}>{error}</div>}

            <label className={styles.label} htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="tucuenta@ub.edu.ar"
              autoComplete="email"
              required
            />

            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />

            <button type="submit" className={styles.button} disabled={submitting}>
              {submitting ? 'Ingresando…' : 'Iniciar sesión'}
            </button>
          </form>
        )}
      </div>
    </Container>
  );
}
