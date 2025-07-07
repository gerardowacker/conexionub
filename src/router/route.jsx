import React from 'react';

/**
 *
 * @param {object} body - body
 * @param {string} body.path - path for the routing
 * @param {array} body.children - children of the route
 * @returns {React.Component} Component
 */
export function Route({ path, children }) {
    return children;
}