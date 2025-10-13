import React from "react";
import styles from './Container.module.css'

export default function Crumb({items}: { items: React.ReactNode[] }) {
    return (
        <div className={styles['container-head']}>
            <span key={'crumb'} className={styles['crumb-inline']}>
                {items.map((item, key) => {
                    if (key !== items.length - 1) return (
                        <div style={{display: 'inherit'}} key={key}>
                            <span className={styles['crumb-item']}>{item}</span>
                            <span className={styles['crumb-item']}><b>&gt;</b></span>
                        </div>
                    )
                    else
                        return <span key={key} className={styles['crumb-item']}>{item}</span>
                })}
            </span>
        </div>)
}