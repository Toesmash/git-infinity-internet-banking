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


// {
//   transactions.map((item) => {
//     return (
//       <p>{item.txnID}</p>
//     );
//   })
// }
// <DashboardAccOverview className='dashboard__item' />
// <DashboardClockOverview className='dashboard__item' />
// <DashboardTxnOverview className='dashboard__item' />
// <DashboardFutureTxn className='dashboard__item' />

const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts,
  transactions: reduxStore.transactions
});

export default connect(mapStateToProps)(DashboardPage);

