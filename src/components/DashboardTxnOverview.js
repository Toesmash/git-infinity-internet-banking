import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import IBAN from 'fast-iban';
import moment from 'moment';

import getTodayTransactions from '../selectors/todayTxn';

const DashboardTxnOverview = (props) => {
  const now = moment();
  console.log(props.transactions);
  return (
    <div className="dashboard__widget dashboard__widget--left">
      <div className="dashboard__header">
        <h3>Pohyby za deň: <span>{now.format('D.MMMM.YYYY')}</span></h3>
        <h3>Suma</h3>
      </div>
      {
        props.transactions.length === 0 && <div className="italic">Žiadne pohyby za tento deň.</div>
      }
      {
        props.transactions.map((item, index) => {
          return (
            <div key={item.txnID} className="dashboard__entry">
              <div className="dashboard__entry__item">
                <div className="entry__account">
                  {
                    item.type === 'sepa' ? (
                      <div>
                        {
                          item.note ? <h4>{item.note}</h4> : <h4>Platba {index + 1}</h4>
                        }
                        {
                          item.ibanFrom === 'INFINITY BANK' && (
                            <div>
                              <p>pre: <span className="iban-font">{IBAN.formatIBAN(item.ibanTo)}</span></p>
                              <p>od: <span className="iban-font">{item.ibanFrom}</span></p>
                            </div>
                          )
                        }
                        {
                          item.ibanFrom !== 'INFINITY BANK' && (
                            <div>
                              <p>pre: <span className="iban-font">{IBAN.formatIBAN(item.ibanTo)}</span></p>
                              <p>od: <span className="iban-font">{IBAN.formatIBAN(item.ibanFrom)}</span></p>
                            </div>
                          )
                        }
                      </div>
                    ) : null
                  }
                  {
                    item.type === 'swift' ? (
                      <div>
                        {
                          item.note ? <h4>{item.note}</h4> : <h4>Platba {index + 1}</h4>
                        }
                        <div>
                          <p>pre: <span className="iban-font">{item.creditorAcc} {item.creditorBIC}</span></p>
                          <p>od: <span className="iban-font">{IBAN.formatIBAN(item.ibanFrom)}</span></p>
                        </div>
                      </div>
                    ) : null
                  }
                </div>
                <div className="entry__balance">
                  {
                    item.type === 'sepa' ? (
                      <div>
                        <h4>{item.flow === 'debit' ? '-' : '+'}{numeral(item.amount / 100).format('0,0.00')} <span>EUR</span></h4>
                        <p className="entry__balance--additional">SEPA</p>
                      </div>
                    ) : null
                  }
                  {
                    item.type === 'swift' ? (
                      <div>
                        <h4>{item.flow === 'debit' ? '-' : '+'}{numeral(item.amount / 100).format('0,0.00')} <span>EUR</span></h4>
                        <p className="entry__balance--additional">({numeral(item.originalAmount / 100).format('0,0.00')} {item.currency})</p>
                        <br />
                        <p className="entry__balance--additional">SWIFT</p>
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

// {
//   item.note ? <h4>{item.note}</h4> : <h4>Platba {index + 1}</h4>
// }
// {
//   item.ibanFrom === 'INFINITY BANK' && (
//     <div>
//       <p>pre: <span className="iban-font">{IBAN.formatIBAN(item.ibanTo)}</span></p>
//       <p>od: <span className="iban-font">{item.ibanFrom}</span></p>
//     </div>
//   )
// }
// {
//   item.ibanFrom !== 'INFINITY BANK' && (
//     <div>
//       <p>pre: <span className="iban-font">{IBAN.formatIBAN(item.ibanTo)}</span></p>
//       <p>od: <span className="iban-font">{IBAN.formatIBAN(item.ibanFrom)}</span></p>
//     </div>
//   )
// }

const mapStateToProps = (reduxStore) => ({
  transactions: getTodayTransactions(reduxStore.transactions),
  accounts: reduxStore.accounts
});

export default connect(mapStateToProps)(DashboardTxnOverview);
