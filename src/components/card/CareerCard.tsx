import styles from './CareerCard.module.css'
import Link from "next/link";

type CareerCardTypes = {
    image: string,
    title: string,
    years: string,
    description: string,
    link: string
}

export default function CareerCard({image, title, years, description, link}: CareerCardTypes) {
    return <Link href={link} className={styles['career-card']}>
        <div className={styles['thumb']}
             style={{
                 backgroundImage: `linear-gradient(to bottom, rgba(134,28,36,.25), rgba(134,28,36,0)), url(${image})`,
                 backgroundSize: "cover",
                 backgroundPosition: "center",
             }}/>
        <h3>{title}</h3>
        <span className={styles['years']}> {years}</span>
        <p>{description}</p>
        <button className={styles['btn']}>Ver más</button>
    </Link>}