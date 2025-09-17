import React, { useState, useEffect } from "react";
import "./contactform.css";

export default function ContactForm() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <form className="contact-form" method="POST" action="/api/contact">
      <h2>Contactate con la facultad</h2>
      <div className="form-row">
        <input type="text" name="name" placeholder="Nombre" required />
        <input type="email" name="email" placeholder="Email" required />
      </div>
      <textarea name="message" placeholder="Mensaje" required></textarea>

      <div
        className="cf-turnstile"
        data-sitekey="0x4AAAAAAB1cHRmrUMRPsNoT"
      ></div>

      <button type="submit" className="btn-submit">Enviar</button>
    </form>
  );
}
