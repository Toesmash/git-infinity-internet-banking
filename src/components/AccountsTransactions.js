import React from 'react';
import { connect } from 'react-redux';

import { history } from '../routers/AppRouter';
import AccountsTransactionItem from './AccountsTransactionItem';
import getAccountTransactions from '../selectors/accountTransactions';

class AccountsTransactions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1
    };
  }

  handleClick = (e) => {
    this.setState({
      currentPage: Number(e.target.value)
    });
  };

  render() {
    const { currentPage } = this.state;
    const { transactions = [] } = this.props;
    const txnPerPage = parseInt(this.props.txnPerPage, 10);

    // Logic for displaying current todos
    const indexOfLastTxn = currentPage * txnPerPage;
    const indexOfFirstTxn = indexOfLastTxn - txnPerPage;
    const currentTxn = transactions.slice(indexOfFirstTxn, indexOfLastTxn);


    const renderTxns = currentTxn.map((txn) => {
      return <AccountsTransactionItem key={txn.txnID} txn={txn} />;
    });

    // Logic for displaying page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(transactions.length / txnPerPage); i += 1) {
      pageNumbers.push(i);
    }

    const renderPagination = pageNumbers.map((item) => {
      return (
        <button
          key={item}
          value={item}
          onClick={this.handleClick}
          className={this.state.currentPage === item ? 'button__pagination button__pagination--active' : 'button__pagination'}
        >
          {item}
        </button>
      );
    });


    return (
      <div>
        <div className="transactions__header">
          <div className="date">Dátum</div>
          <div className="type">Typ</div>
          <div className="note">Poznámka</div>
          <div className="amount">Suma</div>
        </div>
        <div className="transactions__list">
          {transactions.length === 0 ? <p className="italic">Žiadne transakcie.</p> : renderTxns}
        </div>
        <div className="pagination">
          <button className="button__pagination" value="1" onClick={this.handleClick} >&laquo;</button>
          {renderPagination}
          <button className="button__pagination" value={Math.ceil(transactions.length / txnPerPage)} onClick={this.handleClick}>&raquo;</button>
        </div>

      </div>
    );
  }
}

const mapStateToProps = (reduxStore) => {
  const iban = (history.location.pathname).split('/').splice(1)[1];
  return {
    transactions: getAccountTransactions(reduxStore.transactions, iban, reduxStore.filter),
    txnPerPage: reduxStore.filter.txnPerPage
  };
};

export default connect(mapStateToProps)(AccountsTransactions);
