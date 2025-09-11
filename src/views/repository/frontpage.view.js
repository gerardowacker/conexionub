import React from "react";
import Header from "../../components/header/header.component";
import Banner from "../../components/banner/banner.component";
import PillMenu from "../../components/pillmenu/pillmenu.component";

export default class FrontpageView extends React.Component
{
    render()
    {
        return <>
            <Header/>
            <main className="landing">
                <div className="view-container">
                    <Banner>
                        <h1 id="hero-title" className="hero-title">
                            Repositorio
                        </h1>
                        <h3 className={'hero-sub'}>Tesis y Trabajos de Investigación de la Facultad de Ingeniería y
                            Tecnología Informática</h3>
                    </Banner>
                    <PillMenu items={[
                        {
                            name: 'Inicio',
                            route: '',
                            selected: true
                        },
                        {
                            name: 'Colecciones',
                            route: 'colecciones'
                        },
                        {
                            name: 'Buscar',
                            route: 'buscar'
                        }
                    ]}/>
                </div>
            </main>

        </>
    }
}