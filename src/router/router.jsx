import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { locationToRoute, locationToParams } from './utils';
import { Route } from './route';


const history = createBrowserHistory();

export const RouterContext = React.createContext(locationToRoute(history.location));

export const RouterParamsContext = React.createContext([]);

/**
 *
 * @param {object} body - body
 * @param {array} body.children - child components for routing of type Route
 * @returns {React.Component} This page is rendered and the routing and parameter service provider is used
 */
const RouterProvider = ({ children }) => {
    const routes = children.filter((child) => child.type == Route);

    let params = {};

    const [route, setRoute] = useState(locationToRoute(history.location));

    const handleRouteChange = ({ location }) => setRoute(locationToRoute(location));

    useEffect(() => {

        let unlisten = history.listen(handleRouteChange);

        return () => unlisten();

    }, [history]);



    const currentPage = routes.find(_route => {

        params = locationToParams(route.path, _route.props.path) ?? {};

        if (_route.props.path == route.path || Object.values(params).length != 0) {
            return _route;
        }
    });

    return (
        <RouterContext.Provider value={Object.values(route)}>
            <RouterParamsContext.Provider value={params}>
                {currentPage ?? (routes.find((_route) => !_route.props.path) ?? <p>Not path found</p>)}
            </RouterParamsContext.Provider>
        </RouterContext.Provider>
    );
};


/**
 * @returns {Array.<*>} Returns a list of pathname, hash, state and search
 */
const useRouter = () => useContext(RouterContext);

/**
 * @returns {Array.<*>} Returns a list of parameters
 */
const useParams = () => useContext(RouterParamsContext);

export { useRouter, useParams, RouterProvider, history };