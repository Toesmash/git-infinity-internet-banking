import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import IBAN from 'fast-iban';
import { ToastContainer, toast } from 'react-toastify';
import database from '../firebase/firebase';
import { history } from '../routers/AppRouter';
import { updateStatus } from '../actions/cardActions';

const CardDetail = ({ card, user, updateStatus }) => {
  const handleCardBlock = () => {
    database.ref(`users/${user}/cards/${card.cardID}`).update({
      status: 'blocked'
    }).then(() => {
      toast.success('Karta zablokovaná');
      updateStatus(card.cardID, 'blocked');
    });
  };


  if (!card) {
    return null;
  }
  return (
    <div className={card ? 'card__detail card__detail--show' : 'card__detail card__detail--hide'}>
      <div className="card__overview">
        <div className="card__overview__logo">
          <div className="card__relative">
            <img
              className="card__detail__info--issuer"
              alt="card_logo"
              src={`/images/cards/${card.issuer}_card2.png`}
            />
            {
              card.type === 'contactless' &&
              <img
                className="card__detail__info--contactless"
                alt="contactless_card"
                src="/images/cards/contactless5.png"
              />
            }
          </div>
        </div>
        <div className="card__overview__info">
          <div className="card__general">
            <p>Meno držiteľa:</p>
            <p>Číslo účtu:</p>
            <p>Status:</p>
            <p>Bezkontaktná:</p>
            <p>Číslo karty:</p>
            <p>Platná do:</p>
          </div>
          <div className="card__specific">
            <p>{card.holder}</p>
            <p className="iban-font">{IBAN.formatIBAN(card.account)}</p>
            <p>{card.status === 'active' ? 'Aktívna' : 'Zablokovaná'}</p>
            <p>{card.type === 'contactless' ? 'Áno' : 'Nie'}</p>
            <p className="iban-font">{IBAN.formatIBAN(card.cardID)}</p>
            <p className="iban-font">{card.validTo}</p>
          </div>
        </div>
        <div className="card__overview__limits">
          <h4>Limity</h4>
          <div className="limits__text">
            <div className="limit__general">
              <p>Deň:</p>
              <p>Bankomat:</p>
              <p>Obchodník:</p>
            </div>
            <div className="limit__specific">
              <p>{numeral(card.dailyLimit).format('0,0[.]00')} EUR</p>
              <p>{numeral(card.vendorLimit).format('0,0[.]00')} EUR</p>
              <p>{numeral(card.atmLimit).format('0,0[.]00')} EUR</p>
            </div>
          </div>
          <button
            className="button button__block"
            onClick={handleCardBlock}
            disabled={card.status === 'blocked'}
          >
            Zablokuj kartu
          </button>
        </div>
      </div>
      <ToastContainer autoClose={5000} />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  updateStatus: (cardNr, status) => dispatch(updateStatus(cardNr, status))
});

const mapStateToProps = (reduxStore) => {
  const cardNr = (history.location.pathname).split('/').splice(1)[1];
  return {
    card: reduxStore.cards.find((item) => {
      return item.cardID === cardNr;
    }),
    user: reduxStore.auth.loginID
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardDetail);
