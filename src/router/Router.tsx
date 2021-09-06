import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { routes } from './RouteConfig';

const AppRouter = () => {
  return (
    <Router>
      <Switch>
        {routes.map((route: any, i: number) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch> 
    </Router>
  );
};

function RouteWithSubRoutes(route: any) {
  return (
    <Route
      exact={route.exact}
      path={route.path}
      render={(props: any) => <route.component {...props} routes={route.routes} />}
    />
  );
}

export default AppRouter;
