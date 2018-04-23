import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IBAN from 'fast-iban';
import numeral from 'numeral';

import { history } from '../routers/AppRouter';

const AccountsOverview = ({ accounts = [] }) => {
  const iban = (history.location.pathname).split('/').splice(1)[1];

  return (
    <div className="accounts__list">
      {
        accounts.length === 0 ? (<p>Žiadny účet</p>) :
          (
            accounts.map((item) => {
              return (
                <Link key={item.iban} className="accounts__entry" to={`/accounts/${item.iban}`}>
                  <div
                    className={item.iban === iban ? 'account__entry__item--selected' : 'account__entry__item'}
                  >
                    <div className="entry__account">
                      <h4>{item.name}</h4>
                      <p className="iban-font">{IBAN.formatIBAN(item.iban)}</p>
                      <h4>{numeral(item.balance / 100).format('0,0.00')} <span>{item.ccy}</span></h4>
                    </div>
                  </div>
                </Link>
              );
            })
          )

      }
    </div>
  );
};

const mapStateToProps = (reduxStore) => ({
  accounts: reduxStore.accounts
});

export default connect(mapStateToProps)(AccountsOverview);
