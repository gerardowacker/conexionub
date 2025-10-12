import React from "react";
import styles from './Container.module.css'

export default function Crumb({items}: { items: React.ReactNode[] }) {
    return (
        <div className={styles.containerHead}>
            <span key={'crumb'} className={styles.crumbInline}>
                {items.map((item, key) => {
                    if (key !== items.length - 1) return (
                        <div style={{display: 'inherit'}} key={key}>
                            <span className={styles.crumbItem}>{item}</span>
                            <span className={styles.crumbItem}><b>&gt;</b></span>
                        </div>
                    )
                    else
                        return <span key={key} className={'crumb-item'}>{item}</span>
                })}
            </span>
        </div>)
}