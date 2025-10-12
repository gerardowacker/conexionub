import React from "react";
import styles from './PillMenu.module.css'
import Link from "next/link";

type PillMenuItem = {
    name: string,
    route: string,
    selected: boolean
}

export default function PillMenu({items}: { items: PillMenuItem[] }) {
    return <ul className={styles['pill-menu']}>
        {items.map((item, key) => (
            <Link className={styles['pill-menu-item'] + (item.selected ? ' ' + styles['pill-selected'] : '')}
                  href={'repositorio' + (item.route !== '' ? '/' + item.route : '')}>
                <li key={key}>{item.name}</li>
            </Link>
        ))}
    </ul>
}