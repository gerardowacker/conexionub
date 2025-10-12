'use client';

import {useEffect} from "react";
import styles from './Form.module.css'

export default function ContactForm() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    return (
        <form className={styles['contact-form']} method="POST" action="/api/contact">
            <h2>Contactate con la facultad</h2>
            <div className={styles['form-row']}>
                <input type="text" name="name" placeholder="Nombre" required/>
                <input type="email" name="email" placeholder="Email" required/>
            </div>
            <textarea name="message" placeholder="Mensaje" required></textarea>

            <div
                className={styles['cf-turnstile']}
                data-sitekey="0x4AAAAAAB1cHRmrUMRPsNoT"
            ></div>

            <button type="submit" className={styles['btn-submit']}>Enviar</button>
        </form>
    );
}
