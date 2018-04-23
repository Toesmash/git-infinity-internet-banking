import React from 'react';
import { connect } from 'react-redux';
import { history } from '../routers/AppRouter';
import getFutureTransactions from '../selectors/futureTransactions';
import AccountsTransactionItem from './AccountsTransactionItem';

class AccountFuturePayments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedFuture: false
    };
  }

  getHeaderText = () => {
    const { futureTransactions } = this.props;
    if (futureTransactions.length === 0) {
      return ('Žiadne platby na spracovanie');
    }
    if (futureTransactions.length === 1) {
      return (<p><span>{futureTransactions.length}</span> platba čaká na spracovanie</p>);
    }
    if (futureTransactions.length > 1 && futureTransactions.length < 5) {
      return (<p><span>{futureTransactions.length}</span> platby čakajú na spracovanie</p>);
    }
    if (futureTransactions.length >= 5) {
      return (<p><span>{futureTransactions.length}</span> platieb čaká na spracovanie</p>);
    }
    return ('error');
  };

  toggleFuture = () => {
    this.setState({
      expandedFuture: !this.state.expandedFuture
    });
  };

  renderTxns = () => {
    return this.props.futureTransactions.map((txn) => {
      return <AccountsTransactionItem key={txn.txnID} txn={txn} />;
    });
  }


  render() {
    return (
      <div
        className={this.props.futureTransactions.length === 0 ? 'transactions__future--hide' : 'transactions__future--show'}
      >
        <div className="transactions__future">
          {this.getHeaderText()}
          <button
            onClick={this.toggleFuture}
            className="button button__filter"
          >
            {this.state.expandedFuture ? 'Schovaj platby' : 'Zobraz platby'}
          </button>
        </div>
        <div
          className={this.state.expandedFuture ? 'transactions__list transactions__list--show' : 'transactions__list transactions__list--hide'}
        >
          {this.renderTxns()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (reduxStore) => {
  const iban = (history.location.pathname).split('/').splice(1)[1];
  return {
    futureTransactions: getFutureTransactions(reduxStore.transactions, iban)
  };
};

export default connect(mapStateToProps)(AccountFuturePayments);
