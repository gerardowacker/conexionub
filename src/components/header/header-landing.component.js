import React from "react";
import "../../styles/header-landing.css";

export default function HeaderLanding() {
  return (
    <header className="ub-landing-header">
      <div className="ub-landing-inner">

        <nav className="ub-landing-nav">
          <a href="/">inicio</a>
          <a href="/carreras">carreras</a>
          <a href="/repositorio">repositorio</a>
          <a href="/universidad">universidad</a>
          <a href="/tesisytrabajos">tesis</a>
          <a href="/contacto">contacto</a>
        </nav>
      </div>
    </header>
  );
}
