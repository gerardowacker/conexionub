import React from "react";
import edificio from "../../assets/edificionub.png";
import './banner.component.css'

export default class Banner extends React.Component
{
    render()
    {
        return <section className="hero-card" aria-labelledby="hero-title" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.50), rgba(0,0,0,0.50)),url(${edificio})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
        }}>
            {this.props.children}
        </section>
    }
}