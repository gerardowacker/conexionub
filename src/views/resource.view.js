import React from "react";
import {RouterParamsContext} from "../router/router";
import {get} from "../utils/request.util";
import Header from "../components/header/header.component";

export default class ResourceView extends React.Component
{
    static contextType = RouterParamsContext

    constructor(props)
    {
        super(props)
        this.state = {
            resource: null,
            error: null,
        }
    }

    componentDidMount()
    {
        const {id} = this.context
        get('/resource/' + id).then(res =>
        {
            if(res.status !== 200) return this.setState({error: res.response.data.error})
            const {resource} = res.data
            this.setState({resource})
        })
    }

    render()
    {
        if(this.state.error) return (
            <div>
                <Header/>
                <span>{this.state.error}</span>
            </div>
        )
        else if (!this.state.resource) return <div>Loading...</div>
        return <div>
            <Header/>
            <span>{JSON.stringify(this.state.resource)}</span>
        </div>
    }
}