import React from 'react';
import { connect } from 'react-redux';

// import DashboardAccOverview from './DashboardAccOverview';
// import DashboardTxnOverview from './DashboardTxnOverview';
// import DashboardClockOverview from './DashboardClockOverview';
// import DashboardFutureTxn from './DashboardFutureTxn';

const DashboardPage = ({ accounts = [], transactions = [] }) => (
  <div>
    <h1>Dashboard</h1>
    <div>
      <h1>ACCOUNTS</h1>
      {
        accounts.length === 0 && <img alt="loader" src="/images/fetching.gif" />
      }
      {
        accounts.map((item) => {
          return (
            <p key={item.iban}>{item.iban}</p>
          );
        })
      }
      <h1>TRANSACTIONS</h1>
      {
        transactions.map((item) => {
          return (
            <p key={item.txnID}>{item.txnID}</p>
          );
        })
      }
    </div>
  </div>
);

const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts,
  transactions: reduxStore.transactions
});

export default connect(mapStateToProps)(DashboardPage);

