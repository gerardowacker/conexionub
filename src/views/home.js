import React from "react"
import {SessionContext} from "../components/session.context";
import Header from "../components/header/header.component";

export default class Home extends React.Component
{
    render()
    {
        return <div>
            <Header/>
            <h1>hola</h1>
        </div>
    }
}