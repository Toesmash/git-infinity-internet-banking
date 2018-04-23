import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import IBAN from 'fast-iban';
import numeral from 'numeral';

import getFutureTransactions from '../selectors/futureTransactions';


const DashboardFutureTxn = (props) => {
  console.log(props.transactions);

  return (
    <div className="dashboard__widget dashboard__widget--right">
      <div className="dashboard__header">
        <h3>Plánované platby: <span>{moment().format('MMMM')}</span></h3>
      </div>
      {
        props.transactions.length === 0 && <div className="italic">Žiadne plánované platby.</div>
      }
      {
        props.transactions.map((item, index) => {
          return (
            <div key={item.txnID} className="dashboard__entry">
              <div className="dashboard__entry__item">
                <div className="entry__account">
                  {
                    <div>
                      <h4>{moment(item.paymentDate).format('D.MMMM.YYYY')}</h4>
                      {
                        item.type === 'sepa' ? <span className="iban-font iban__small">{IBAN.formatIBAN(item.ibanFrom)}</span> : null
                      }
                      {
                        item.type === 'swift' ? <span className="iban-font iban__small">{item.creditorAcc} {item.creditorBIC}</span> : null
                      }
                      <br />
                      <span className="iban__small">{item.note}</span>
                    </div>
                  }
                </div>
                <div className="entry__balance">
                  {
                    item.type === 'sepa' ? (
                      <div>
                        <h4>{item.flow === 'debit' ? '-' : '+'}{numeral(item.amount / 100).format('0,0[.]00')} <span>EUR</span></h4>
                      </div>
                    ) : null
                  }
                  {
                    item.type === 'swift' ? (
                      <div>
                        <h4>{item.flow === 'debit' ? '-' : '+'}{numeral(item.amount / 100).format('0,0[.]00')} <span>EUR</span></h4>
                        <p className="entry__balance--additional">({numeral(item.originalAmount / 100).format('0,0.00')} {item.currency})</p>
                      </div>
                    ) : null
                  }
                </div>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

const mapStateToProps = (reduxStore) => ({
  transactions: getFutureTransactions(reduxStore.transactions),
  accounts: reduxStore.accounts
});

export default connect(mapStateToProps)(DashboardFutureTxn);
