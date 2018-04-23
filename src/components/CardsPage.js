import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import CardsOverview from './CardsOverview';
import CardsTransactions from './CardsTransactions';
import CardsTransactionsFilter from './CardsTransactionsFilter';
import CardDetail from './CardDetail';
import { history } from '../routers/AppRouter';
// import AccountList from './AccountList';
// import AccountTransactions from './AccountTransactions';
// import AccountTransactionFilter from './AccountTransactionFilter';

export default class CardsPage extends React.Component {
  componentDidMount() {
    const alert = (history.location.pathname).split('/').splice(1)[2];
    switch (alert) {
      case 'success':
        toast.success('Karta zablokovaná');
        break;
      default:
    }
  }
  render() {
    return (
      <div className="content-container">
        <h1 className="page-header page-header__title">Prehľad kariet</h1>
        <div className="accounts">
          <CardsOverview />
          <CardDetail />
          <CardsTransactionsFilter />
          <CardsTransactions />
          <ToastContainer autoClose={5000} />
        </div>
      </div>
    );
  }
}
