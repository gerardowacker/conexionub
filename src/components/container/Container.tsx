import React from "react";
import Crumb from "@/components/container/Crumb";
import styles from './Container.module.css'

type ContainerProps = { id: string, crumb: React.ReactNode[], children: React.ReactNode }

export default function Container({id, crumb, children}: ContainerProps) {
    return <div className={styles['container']} id={id}>
        <Crumb items={crumb}/>

        <div className={styles['container-content']}>
            {children}
        </div>
    </div>}