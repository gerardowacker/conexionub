import React from "react";
import {post} from "../utils/request.util";

export const SessionContext = React.createContext()

export class SessionProvider extends React.Component
{
    constructor(props)
    {
        super(props)
        this.state = {
            user: null,
            token: localStorage.getItem('__lorest'),
            clientToken: localStorage.getItem('__lore_client'),
        }
    }

    componentDidMount()
    {
        const {token, clientToken} = this.state

        if (token && clientToken)
        {
            this.setState({token, clientToken}, () =>
                post("/user/get", {token: token, clientToken: clientToken}).then(result =>
                {
                    console.log(result)
                    if (result.response.status === 200) this.setState({user: result.response.data})
                    else
                    {
                        if (result.response.status === 498) this.localLogout()
                        this.setState({user: null})
                        throw new Error(result.response.data.error)
                    }
                })
            )
        }
    }

    login = async (email, password) =>
    {
        const res = await post("/login", {email, password})
        if (res.response.status !== 200) throw new Error(res.response.data.error)
        const {session, user} = res.response.data
        this.setState({token: session.token, user: user, clientToken: session.clientToken})
        this.saveSession(session.token, session.clientToken)
        return user
    }

    saveSession = (token, clientToken) =>
    {
        localStorage.setItem('__lorest', token)
        localStorage.setItem('__lore_client', clientToken)
    }

    logout = async (single) =>
    {
        const res = await post("/logout", {
            token: this.state.token,
            clientToken: this.state.clientToken,
            single: single
        })

        if (res.status !== 200) throw new Error(res.response.data.error)

        this.localLogout()
    }

    localLogout = () =>
    {
        localStorage.removeItem('__lorest')
        localStorage.removeItem('__lore_client')
        this.setState({token: null, user: null, clientToken: null})
    }

    render()
    {
        return <SessionContext.Provider value={{...this.state, login: this.login, logout: this.logout}}>
            {this.props.children}
        </SessionContext.Provider>
    }
}