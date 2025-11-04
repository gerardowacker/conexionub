import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import styles from './Toast.module.css';

type ToastType = 'info' | 'error' | 'warn';

type Toast = {
    id: number;
    message: string;
    type: ToastType;
    duration?: number;
};

type ToastContextValue = {
    showToast: (t: { message: string; type?: ToastType; duration?: number }) => number;
    hideToast: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within a ToastProvider');
    return ctx;
};

export const useOptionalToast = () => {
    return useContext(ToastContext);
};

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const idRef = useRef(1);
    const timersRef = useRef<Record<number, number>>({});

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
        const timer = timersRef.current[id];
        if (timer) {
            window.clearTimeout(timer);
            delete timersRef.current[id];
        }
    }, []);

    const showToast = useCallback(({ message, type = 'info', duration = 5000 }: { message: string; type?: ToastType; duration?: number }) => {
        const id = idRef.current++;
        const t: Toast = { id, message, type, duration };
        setToasts(prev => [t, ...prev]);
        timersRef.current[id] = window.setTimeout(() => removeToast(id), duration);
        return id;
    }, [removeToast]);

    const hideToast = useCallback((id: number) => removeToast(id), [removeToast]);

    // cleanup on unmount
    useEffect(() => {
        return () => {
            Object.values(timersRef.current).forEach(t => window.clearTimeout(t));
            timersRef.current = {};
        };
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <div className={styles.container} aria-live="polite" aria-atomic="true">
                {toasts.map(t => (
                    <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
                        <div className={styles.msg}>{t.message}</div>
                        <button className={styles.close} onClick={() => hideToast(t.id)} aria-label="Cerrar">×</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export default ToastProvider;
