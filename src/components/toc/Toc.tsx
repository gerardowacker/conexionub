'use client'

import styles from './Toc.module.css'

export default function Toc({headings}: { headings: { id: string, text: string, level: number }[] }) {
    return (
        <nav className={styles['toc']} aria-label="Índice de contenidos">
            <div className={styles['toc-title']}>Contenidos</div>
            <ul>
                {headings.map((h, idx) => (
                    <li
                        key={idx}
                        className={styles[`toc-level-${h.level}`]}
                        style={{marginLeft: (h.level - 1) * 10}}
                    >
                        <a href={`#${h.id}`}>{h.text}</a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}
