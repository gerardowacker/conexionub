import React from "react";
import Link from "next/link";
import Banner from "@/components/banner/Banner";
import Container from "@/components/container/Container";
import ContactForm from "@/components/form/Form";
import MapSection from "@/components/map/Map";

import styles from './page.module.css'
import bannerStyles from "@/components/banner/Banner.module.css";

export default function Contacto() {
    return (
        <>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>Contactanos</h1>
                <h3 className={bannerStyles["hero-sub"]}>No dudes en mandarnos un correo electrónico ante cualquier consulta</h3>
            </Banner>

            <Container
                id="contacto-form"
                crumb={["Contacto", <Link key={'Formulario'} id="formulario" href="#formulario">Formulario</Link>]}
            >
                <div className={styles["contact-grid"]}>
                    <div className={styles["contact-grid__form"]}>
                        <ContactForm/>
                    </div>

                    <aside className={styles["contact-info"]}>
                        <h2 className={styles["contact-info__title"]}>Más información</h2>

                        <p className={styles["contact-info__lead"]}>
                            <strong>Jornada Informativa – Carreras de grado</strong><br/>
                            Se realizará en la Torre Universitaria.<br/>
                            Reservá tu lugar.
                        </p>

                        <p className={styles["contact-info__address"]}><strong>Dirección:</strong> Zabala 1837</p>
                        <p className={styles["contact-info__city"]}>Buenos Aires, Argentina</p>

                        <p className={styles["contact-info__phone"]}><strong>Teléfono:</strong> +54-11-4788-5400</p>
                        <p className={styles["contact-info__hours"]}><strong>Horarios:</strong> Lun a Vier de 8:00hs - 18:00hs</p>
                    </aside>
                </div>
            </Container>
            <div className={styles['container']} />
            <Container
                id="contacto-ubicacion"
                crumb={[
                    "Contacto",
                    <Link key={'Ubicación'} id="ubicacion" href="#ubicacion">Ubicación</Link>,
                ]}
            >
                <MapSection/>

            </Container>

        </>
    )
}