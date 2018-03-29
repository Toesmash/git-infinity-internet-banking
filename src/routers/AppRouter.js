import React from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Components
import RegisterPage from '../components/RegisterPage';
import LoginPage from '../components/LoginPage';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import PaymentsPage from '../components/PaymentsPage';

// Routes
import PublicRoute from './PublicRouter';
import PrivateRoute from './PrivateRouter';
import SepaPayment from '../components/SepaPayment';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/login" component={LoginPage} />
        <PublicRoute path="/register" component={RegisterPage} />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <PrivateRoute path="/payments" component={PaymentsPage} exact />
        <PrivateRoute path="/payments/sepa" component={SepaPayment} exact />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;

// <PublicRoute path="/register" component={RegisterPage} exact={true} />
// <PrivateRoute path="/dashboard" component={DashboardPage} />
// <PrivateRoute path="/payments" component={PaymentsPage} exact={true} />
// <PrivateRoute path="/payments/sepa" component={AddSepaPayment} exact={true} />
// <PrivateRoute path="/payments/sepa/:iban/:id" component={EditSepaPayment} />
// <PrivateRoute path="/payments/intr" component={PaymentsIntrPage} />
// <PrivateRoute paath="/payments/acctr" component={PaymentsAcctrPage} />
// <PrivateRoute path="/accounts" component={AccountsPage} />
// <PrivateRoute path="/cards" component={CardsPage} />
