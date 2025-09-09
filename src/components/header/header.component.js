import React, { useEffect, useRef, useState } from "react";
import "../../styles/header.css";

export default function Header({ variant = "landing", breadcrumb = [] }) {
  const isLanding = variant === "landing";

  const Menu = () => (
    <nav className="ub-nav" aria-label="Menú principal">
      <a href="/">Inicio</a>
      <a href="/carreras">Carreras</a>
      <a href="/contacto">Contacto</a>
      <a href="/universidad">Universidad</a>
      <a href="/repositorio">Repositorio</a>
      <a href="/tesisytrabajos">Tesis y Trabajos de Investigacion</a>
    </nav>
  );

  return (
    <header className={`ub-header ${isLanding ? "landing" : "app"}`}>
      <div className="ub-header-bar">
        <div className="ub-header-inner">
          <div className="ub-logo" href="/" aria-label="Universidad de Belgrano">
            <img src="UBLogo.png" alt="UB" />
          </div>

          <Menu />
        </div>
      </div>

      {/* Breadcrumb solo si viene data */}
      {breadcrumb?.length > 0 && (
        <div className="ub-breadcrumb-wrap" aria-label="Ruta de navegación">
          <ol className="ub-breadcrumb">
            {breadcrumb.map((item, i) => {
              const last = i === breadcrumb.length - 1;
              return (
                <li key={i} className={last ? "current" : ""}>
                  {last ? (
                    <span>{item.label}</span>
                  ) : (
                    <a href={item.href}>{item.label}</a>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </header>
  );
}
