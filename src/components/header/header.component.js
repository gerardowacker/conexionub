import React from "react";
import "./header.component.css";
import Link from "../../router/link";
import logo from '../../assets/UBLogo.png'

export default class Header extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <header className="ub-landing-header">
                <div className="ub-landing-inner">

                    <nav className="ub-landing-nav">
                        <Link to={"/"} style={{display: 'flex'}}>
                            <img className={'header-logo'} src={logo} alt={'Logo de la Universidad de Belgrano'}/>
                        </Link>
                        <Link to="/">Inicio</Link>
                        <a href="/carreras">Carreras</a>
                        <a href="/repositorio">Repositorio</a>
                        <a href="/universidad">Universidad</a>
                        <a href="/tesisytrabajos">Tesis</a>
                        <a href="/contacto">Contacto</a>
                    </nav>
                </div>
            </header>
        );
    }
}
