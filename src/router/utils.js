import qs from 'querystringify';
import { pathToRegexp } from 'path-to-regexp';

/**
 *
 * @param {object} location - Location object
 * @param {string} location.pathname - path of the location
 * @param {string} location.hash - hash of the location
 * @param {object} location.state - state of the location
 * @param {string} location.search - search of the location
 * @returns {object} New Location Object of path as pathname, hash, state and query assearch
 */
export function locationToRoute({pathname, hash, state, search}) {
    return {
        path: pathname,
        hash: hash,
        state: state,
        query: qs.parse(search),
    };
}

/**
 *
 * @param {object} location - Location object
 * @param {string} path - component path
 * @returns {array} Returns the component arguments
 */
export function locationToParams(location, path) {
    const keys = [];
    let parser = new pathToRegexp(path ?? "", keys);
    let similar = parser.exec(location);

    if (path != location && !similar) return null;

    const params = keys.reduce((_, curr, index, __) => {
        let param = {};
        param[curr.name] = similar[index + 1]
        return param;
    }, {});

    return params;
}