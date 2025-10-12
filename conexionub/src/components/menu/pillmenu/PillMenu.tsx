import React from "react";
import styles from './PillMenu.module.css'
import Link from "next/link";

type PillMenuItem = {
    name: string,
    route: string,
    selected: boolean
}

export default function PillMenu({items}: { items: PillMenuItem[] }) {
    return <ul className={styles.pillMenu}>
        {items.map((item, key) => (
            <Link className={styles.pillMenuItem + (item.selected ? styles.pillSelected : '')}
                  href={'repositorio' + (item.route !== '' ? '/' + item.route : '')}>
                <li key={key}>{item.name}</li>
            </Link>
        ))}
    </ul>
}