import React from "react";
import Header from "../components/header/header.component";
import Banner from "../components/banner/banner.component";
import Container from "../components/container/container.component";
import ContactForm from "../components/formulario/formulario.component";
import MapSection from "../components/map/mapSection.component";
import "../styles/contact.css";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="landing">
        <div className="view-container">
          <Banner>
            <h1 id="hero-title" className="hero-title">Contactanos</h1>
            <h3 className="hero-sub">Cualquier consulta no dudes en mandarnos un mail</h3>
          </Banner>

          <Container
            id="contacto-form"
            crumb={["Contacto", <a key="formulario" href="/contacto">Formulario</a>]}
          >
            <div className="contact-grid">
              <div className="contact-grid__form">
                <ContactForm />
              </div>

              <aside className="contact-info">
                <h2 className="contact-info__title">Más información</h2>

                <p className="contact-info__lead">
                  <strong>Jornada Informativa – Carreras de grado</strong><br />
                  Se realizará en la Torre Universitaria.<br />
                  Reservá tu lugar.
                </p>

                <p><strong>Dirección:</strong> Zabala 1837</p>
                <p>Buenos Aires, Argentina</p>

                <p><strong>Teléfono:</strong> +54-11-4788-5400</p>
                <p><strong>Horarios:</strong> Lun a Vier de 8:00hs - 18:00hs</p>
              </aside>
            </div>
          </Container>

          <Container
            id="contacto-ubicacion"
            crumb={[
              "Contacto",
              <a key="ubicacion" href="/contacto">Ubicación</a>,
            ]}
          >
            <MapSection/>
           
          </Container>

        </div>
      </main>
    </>
  );
}
