import React, {Component} from "react";
import ReactMarkdown from "react-markdown";
import {RouterParamsContext} from "../../router/router";

import "../../styles/degreePage.css";
import Container from "../../components/container/container.component";
import Banner from "../../components/banner/banner.component";
import Header from "../../components/header/header.component";

class DegreePage extends Component
{
    static contextType = RouterParamsContext;

    constructor(props)
    {
        super(props);
        this.state = {
            degree: null,
            headings: []
        };
    }

    componentDidMount()
    {
        const {id} = this.context;
        if (!id) return;

        try
        {
            const degreeModule = require(`./${id}/index.js`);
            const content = degreeModule.source.es;

            // Extraer encabezados
            const headingRegex = /^(#{1,6})\s+(.*)$/gm;
            const headings = [];
            let match;
            while ((match = headingRegex.exec(content)) !== null)
            {
                const level = match[1].length;
                const text = match[2];
                const slug = text.toLowerCase().replace(/\s+/g, "-");
                headings.push({level, text, id: slug});
            }

            this.setState({degree: degreeModule, headings});
        } catch (e)
        {
            console.error("No se pudo cargar la carrera:", id, e);
            this.setState({error: true})
        }
    }

    // Renderer de headings con ID
    renderHeading = ({level, children}) =>
    {
        const text = children[0];
        const id = text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, "-");

        const Tag = `h${level}`;
        return <Tag id={id}>{children}</Tag>;
    };

    render()
    {
        const {degree, headings, error} = this.state;

        if (error)
            return window.location.href = '/404'

        if (!degree)
        {
            return <div>Cargando carrera...</div>;
        }

        return (
            <>
                <Header/>

                <main className="landing">
                    <div className="view-container">
                        <Banner>
                            <h1 id="hero-title" className="hero-title">
                                {degree.name.es}
                            </h1>
                            <h3 className="hero-sub">
                                {degree.description.es}
                            </h3>
                        </Banner>

                        <div className="degree-layout">
                            {/* Índice */}
                            <nav className="toc" aria-label="Índice de contenidos">
                                <div className="toc-title">Contenidos</div>
                                <ul>
                                    {headings.map((h, idx) => (
                                        <li
                                            key={idx}
                                            className={`toc-level-${h.level}`}
                                            style={{marginLeft: (h.level - 1) * 10}}
                                        >
                                            <a href={`#${h.id}`}>{h.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </nav>

                            {/* Contenedor principal */}
                            <Container
                                id={`${degree.id}-content`}
                                crumb={[
                                    "Inicio",
                                    <a href="/#carreras">Carreras</a>,
                                    <a key={degree.id} href={`/carreras/${degree.id}`}>
                                        {degree.name.es}
                                    </a>
                                ]}
                            >
                                <article className="degree-content">
                                    <ReactMarkdown
                                        components={{
                                            h1: this.renderHeading,
                                            h2: this.renderHeading,
                                            h3: this.renderHeading,
                                            h4: this.renderHeading,
                                            h5: this.renderHeading,
                                            h6: this.renderHeading
                                        }}
                                    >
                                        {degree.source.es}
                                    </ReactMarkdown>
                                </article>
                            </Container>
                        </div>
                    </div>
                </main>
            </>
        );
    }
}

export default DegreePage;
