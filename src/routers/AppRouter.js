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
import SepaPaymentEdit from '../components/SepaPaymentEdit';
import SwiftPayment from '../components/SwiftPayment';
import AcctrPayment from '../components/AcctrPayment';
import AccountsPage from '../components/AccountsPage';
import CardsPage from '../components/CardsPage';
import SwiftPaymentEdit from '../components/SwiftPaymentEdit';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <div>
      <Switch>
        <PublicRoute path="/login" component={LoginPage} exact />
        <PublicRoute path="/register" component={RegisterPage} />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <PrivateRoute path="/payments" component={PaymentsPage} exact />
        <PrivateRoute path="/payments/sepa" component={SepaPayment} exact />
        <PrivateRoute path="/payments/sepa/:iban/:id" component={SepaPaymentEdit} />
        <PrivateRoute path="/payments/swift" component={SwiftPayment} exact />
        <PrivateRoute path="/payments/swift/:iban/:id" component={SwiftPaymentEdit} />
        <PrivateRoute path="/payments/acctr" component={AcctrPayment} exact />
        <PrivateRoute path="/accounts" component={AccountsPage} />
        <PrivateRoute path="/cards" component={CardsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </Router>
);

export default AppRouter;
