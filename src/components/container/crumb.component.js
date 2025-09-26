import React from "react";

export default class CrumbComponent extends React.Component
{
    renderItems(items)
    {
        return items.map((item, key) =>
        {
            if (key !== items.length - 1) return (
                <div style={{display: 'inherit'}} key={key}>
                    <span className={'crumb-item'}>{item}</span>
                    <span className={'crumb-item'}><b>&gt;</b></span>
                </div>
            )
            else return <span key={key} className={'crumb-item'}>{item}</span>
        })
    }

    render()
    {
        return <div className="container-head">
            <span key={'crumb'} className="crumb-inline">
                {this.renderItems(this.props.items)}
            </span>
        </div>
    }
}