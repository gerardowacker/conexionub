import React from "react";
import {SessionContext} from "../session.context";
import Link from "../../router/link";

export default class Header extends React.Component
{
    static contextType = SessionContext

    render()
    {
        if (this.context.user !== null)
            return <div>{this.context.user.displayName}</div>
        return <div><Link to={'/login'}>Log in</Link></div>
    }
}