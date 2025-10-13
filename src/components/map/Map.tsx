import styles from './Map.module.css'

export default function MapSection() {
    return (
        <section className={styles['map-section']} id="mapa">
            <div className={styles['map-container']}>
                <iframe
                    title="Mapa Facultad UB"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6571.1169400341505!2d-58.443578888397425!3d-34.56473302646209!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcb5c7d1e12817%3A0xbe1afa773e23a60b!2sUniversidad%20de%20Belgrano%20(Sede%20Villanueva)!5e0!3m2!1ses-419!2sar!4v1757989072247!5m2!1ses-419!2sar"
                    width="100%"
                    height="400"
                    style={{border: 0}}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </section>
    );
}
