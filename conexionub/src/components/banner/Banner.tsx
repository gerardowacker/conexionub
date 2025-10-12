import React, {PropsWithChildren} from "react";
import styles from './Banner.module.css'

type BannerProps = PropsWithChildren<{}>

export default function Banner({children}: BannerProps) {
    return (
        <section className={styles.heroCard} aria-labelledby="hero-title" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.50)),url(/edificio.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>
            {children}
        </section>)
}