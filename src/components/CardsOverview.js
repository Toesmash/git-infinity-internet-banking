import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import IBAN from 'fast-iban';
import { history } from '../routers/AppRouter';

const CardsOverview = ({ cards = [] }) => {
  const cardNumber = (history.location.pathname).split('/').splice(1)[1];
  const getIssuer = (issuer) => {
    if (issuer === 'visa') { return <h4>VISA</h4>; }
    if (issuer === 'amex') { return <h4>American Express</h4>; }
    if (issuer === 'mastercard') { return <h4>MasterCard</h4>; }
    if (issuer === 'discover') { return <h4>Discover</h4>; }
    return <h4>Debetná karta</h4>;
  };

  return (
    <div className="accounts__list">
      {
        cards.length === 0 ? (<p>Žiadne karty</p>) :
          (
            cards.map((item) => {
              return (
                <Link key={item.cardID} className="accounts__entry" to={`/cards/${item.cardID}`}>
                  <div
                    className={item.cardID === cardNumber ? 'account__entry__item--selected' : 'account__entry__item'}
                  >
                    <div className="entry__account">
                      {
                        getIssuer(item.issuer)
                      }
                      <p className="iban-font">{IBAN.formatIBAN(item.cardID)}</p>
                      <h4>{item.flow === 'debit' ? 'debetná karta' : 'kreditná karta'}</h4>
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
  cards: reduxStore.cards
});

export default connect(mapStateToProps)(CardsOverview);
