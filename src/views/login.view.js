import React from "react"
import {SessionContext} from "../components/session.context";

export default class LoginView extends React.Component
{
    static contextType = SessionContext

    constructor(props)
    {
        super(props)
        this.state = {
            email: '',
            password: '',
            error: null,
        }
    }

    componentDidMount()
    {
        const {user} = this.context
        if(user) window.location.href = '/'
    }

    componentDidUpdate(prevProps, prevState, snapshot)
    {
        const {user} = this.context
        if(user) window.location.href = '/'
    }

    handleChange = (e) =>
    {
        this.setState({[e.target.name]: e.target.value, error: null})
    }

    handleSubmit = async (e) =>
    {
        e.preventDefault()
        const {email, password} = this.state
        const {login} = this.context

        try
        {
            await login(email, password)
        } catch (err)
        {
            this.setState({error: err.message})
        }
    }

    render()
    {
        const {email, password, error} = this.state

        return <form onSubmit={this.handleSubmit}>
            {error && <p style={{color: "red"}}>{error}</p>}
            <input type="email" name="email" value={email} onChange={this.handleChange} required/>
            <input type="password" name="password" value={password} onChange={this.handleChange} required/>
            <button type="submit">Login</button>
        </form>
    }
}
