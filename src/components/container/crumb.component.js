import React from "react";

export default class CrumbComponent extends React.Component
{
    renderItems(items)
    {
        return items.map((item, key) =>
        {
            if (key !== items.length - 1) return (
                <>
                    <span className={'crumb-item'}>{item}</span>
                    <span className={'crumb-item'}><b>&gt;</b></span>
                </>
            )
            else return <span className={'crumb-item'}>{item}</span>
        })
    }

    render()
    {
        return <div className="container-head">
            <span className="crumb-inline">
                {this.renderItems(this.props.items)}
            </span>
        </div>
    }
}