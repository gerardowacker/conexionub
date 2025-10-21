'use client'

import React from "react";
import styles from './PillMenu.module.css'
import Link from "next/link";
import {usePathname} from "next/navigation";

type PillMenuItem = {
    name: string,
    route: string
}

export default function PillMenu({items}: { items: PillMenuItem[] }) {
    const current = usePathname().split('/')[2];

    return <ul className={styles['pill-menu']}>
        {items.map((item, key) => {
            const isSelected = current === item.route || (item.route === '' && !current);
            return (
                <Link key={key} className={styles['pill-menu-item'] + (isSelected ? ' ' + styles['pill-selected'] : '')}
                      href={'/repositorio/' + item.route}>
                    <li>{item.name}</li>
                </Link>
            );
        })}
    </ul>
}