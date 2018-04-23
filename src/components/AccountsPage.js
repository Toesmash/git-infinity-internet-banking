import React from 'react';
import { ToastContainer, toast } from 'react-toastify';

import AccountsOverview from './AccountsOverview';
import AccountsTransactions from './AccountsTransactions';
import AccountTransactionFilter from './AccountTransactionFilter';
import AccountFuturePayments from './AccountFuturePayments';
import { history } from '../routers/AppRouter';

export default class AccountsPage extends React.Component {
  componentDidMount() {
    const alert = (history.location.pathname).split('/').splice(1)[2];
    switch (alert) {
      case 'success':
        toast.success('Platba úspešne odoslaná');
        break;
      case 'error':
        toast.error('Platba nebola úspešná');
        break;
      case 'edit':
        toast.info('Platba úspešne zmenená');
        break;
      case 'cancell':
        toast.warn('Platba zrušená');
        break;
      default:
    }
  }
  render() {
    return (
      <div className="content-container">
        <h1 className="page-header page-header__title">Prehľad účtov</h1>
        <div className="accounts">
          <AccountsOverview />
          <AccountFuturePayments />
          <AccountTransactionFilter />
          <AccountsTransactions />
          <ToastContainer autoClose={5000} />
        </div>
      </div>
    );
  }
}
