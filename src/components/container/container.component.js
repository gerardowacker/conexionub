import React from "react";
import CrumbComponent from "./crumb.component";
import './container.component.css'

export default class Container extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return <div className="container" id={this.props.id}>
            <CrumbComponent items={this.props.crumb}/>

            <div className={'container-content'}>
                {this.props.children}
            </div>
        </div>
    }
}