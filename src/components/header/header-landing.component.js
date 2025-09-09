import React from "react";
import "../../styles/header-landing.css";

export default function HeaderLanding() {
  return (
    <header className="ub-landing-header">
      <div className="ub-landing-inner">

        {/* Menú principal */}
        <nav className="ub-landing-nav">
          <a href="/carreras">Carreras</a>
          <a href="/repositorio">Repositorio</a>
          <a href="/universidad">Universidad</a>
          <a href="/tesisytrabajos">Tesis</a>
          <a href="/contacto">Contacto</a>
        </nav>

      </div>
    </header>
  );
}
