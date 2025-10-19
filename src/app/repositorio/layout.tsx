import React from "react";
import Banner from "@/components/banner/Banner";
import PillMenu from "@/components/menu/pillmenu/PillMenu";

import bannerStyles from "@/components/banner/Banner.module.css";
import sidebarStyles from '@/components/sidebar/Sidebar.module.css';
import {SessionProvider} from "@/context/SessionContext";
import Sidebar from "@/components/sidebar/Sidebar";

export default function RepoLayout({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <Banner>
                <h1 id="hero-title" className={bannerStyles["hero-title"]}>
                    Repositorio
                </h1>
                <h3 className={bannerStyles['hero-sub']}>Tesis y Trabajos de Investigación de la Facultad de Ingeniería
                    y
                    Tecnología Informática</h3>
            </Banner>
            <PillMenu items={[
                {
                    name: 'Inicio',
                    route: '',
                },
                {
                    name: 'Colecciones',
                    route: 'colecciones'
                },
                {
                    name: 'Recursos',
                    route: 'recursos'
                },
                {
                    name: 'Buscar',
                    route: 'buscar'
                }
            ]}/>
            <div style={{display: 'flex', alignItems: 'flex-start'}}>
                <div style={{flex: 1, minWidth: 0}}>
                    {children}
                </div>
                <Sidebar>
                    <div className={sidebarStyles.block}>
                        <div className={sidebarStyles.title}>Mi Cuenta</div>
                        <div className={sidebarStyles.email}>usuario@ejemplo.com</div>
                        <div className={sidebarStyles.buttonGroup}>
                            <button className={sidebarStyles.button}>Perfil</button>
                            <button className={sidebarStyles.button}>Panel de control</button>
                            <button className={sidebarStyles.button}>Salir</button>
                        </div>
                    </div>
                </Sidebar>
            </div>
        </SessionProvider>
    )
}