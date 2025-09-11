import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import {AppError} from './views/error'
import {RouterProvider} from './router/router';
import {Route} from './router/route';
import Home from "./views/home";
import {SessionProvider} from "./components/session.context";
import ResourceView from "./views/resource.view";
import LoginView from "./views/login.view";
import FrontpageView from "./views/repository/frontpage.view";

export const WebRoutes = [
    {
        path: "/",
        component: <Home/>
    },
    {
        path: "/repositorio",
        component: <FrontpageView/>
    },
    {
        path: "/resource/:id",
        component: <ResourceView/>,
    },
    {
        path: "/login",
        component: <LoginView/>
    },
    {
        path: "",
        component: <AppError></AppError>,
        status: 404
    },
]

const AppRoutes = () => <RouterProvider>
    {WebRoutes.map((route, k) => <Route key={k} status={route.status ? route.status : 200}
                                        path={route.path}>{route.component}</Route>)}
</RouterProvider>

ReactDOM.render(
    <SessionProvider>
        <AppRoutes/>
    </SessionProvider>,
    document.getElementById("root")
)

export default AppRoutes;