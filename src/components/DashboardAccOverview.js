import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IBAN from 'fast-iban';
import numeral from 'numeral';

const DashboardAccOverview = ({ accounts = [], transactions = [] }) => {
  return (
    <div className="dashboard__widget dashboard__widget--left">
      <div className="dashboard__header">
        <h3>Prehľad účtov</h3>
        <h3>Zostatok</h3>
      </div>
      {
        accounts.map((item) => {
          return (
            <Link key={item.iban} className="dashboard__entry" to={`/accounts/${item.iban}`}>
              <div className="dashboard__entry__item">
                <div className="entry__account">
                  <h4>{item.name}</h4>
                  <p className="iban-font">{IBAN.formatIBAN(item.iban)}</p>
                </div>
                <div className="entry__balance">
                  <h4>{numeral(item.balance / 100).format('0,0.00')} <span>{item.ccy}</span></h4>
                </div>
              </div>
            </Link>
          );
        })
      }

    </div>
  );
};

const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts,
  transactions: reduxStore.transactions
});

export default connect(mapStateToProps)(DashboardAccOverview);
