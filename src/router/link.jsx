import React from 'react';
import { useRouter, history } from './router';

/**
 *
 * @param {object} body - body
 * @param {string} body.to - path of the new location
 * @param {React.Component} [body.children=<></>] - children of the component
 * @param {object} [body.state={}] - State for the location
 * @param {function} body.onClick - The action that takes place before the push to history
 * @param {array} body.props - props
 * @returns
 */
export default function Link({ to, children, state, onClick, ...props }) {
    const [path] = useRouter();

    const handleClick = (e) => {
        e.preventDefault();

        if (path === to) {
            return;
        }
        if (onClick) {
            onClick(e);
        }
        history.push(to, state ?? {});
    };

    return (
        <a {...props} onClick={handleClick}>
            {children ?? <></>}
        </a>
    );
}