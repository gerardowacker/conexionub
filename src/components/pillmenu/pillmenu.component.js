import React from "react";
import Link from "../../router/link";
import './pillmenu.component.css'

export default class PillMenu extends React.Component
{
    constructor(props)
    {
        super(props)
    }

    renderItems(itemList)
    {
        return itemList.map((item, key) => (
            <Link className={'pill-menu-item' + (item.selected ? ' pill-selected' : '')}
                  to={'repositorio' + (item.route !== '' ? '/' + item.route : '')}>
                <li className={'item'} key={key}>{item.name}</li>
            </Link>
        ))
    }

    render()
    {
        return <ul className={"pill-menu"}>
            {this.renderItems(this.props.items)}
        </ul>
    }
}