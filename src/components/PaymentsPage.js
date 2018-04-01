import React from 'react';
import { Link } from 'react-router-dom';
import numeral from 'numeral';
import GlyphArrow from 'react-icons/lib/fa/angle-double-right';
import GlyphSmile from 'react-icons/lib/fa/smile-o';
import FastPayment from './FastPayment';

numeral.register('locale', 'svk', {
  delimiters: {
    thousands: ' ',
    decimal: ','
  },
  abbreviations: {
    thousand: 'k',
    million: 'm',
    billion: 'b',
    trillion: 't'
  },
  currency: {
    symbol: '€'
  }
});
numeral.locale('svk');

const PaymentsPage = () => {
  return (
    <div className="content-container">
      <h1 className="page-header__title">Typy platieb</h1>
      <div className="payment-options">
        <Link to="/payments/sepa" >
          <div>
            <h3>SEPA platba</h3>
            <img alt="sepa" src="images/sepa.png" />
          </div>
        </Link>
        <Link to="/payments/intr" >
          <div>
            <h3>Medzinárodná platba</h3>
            <img alt="swift" src="images/swift.png" />
          </div>
        </Link>
        <Link to="/payments/acctr" >
          <div>
            <h3>Prevod medzi účtami</h3>
            <img alt="prevod" src="images/money-bag.png" />
          </div>
        </Link>
      </div>
      <h1 className="page-header__title">Rýchla domáca platba</h1>
      <div className="fast-payment">
        <div className="fast-payment__steps">
          <h2 className="fast-payment__title">Rýchla platba je jednoduchá!</h2>
          <p><span>1.</span>Vyber si svoj účet</p>
          <p><span>2.</span>Zadaj domáci účet vo forme IBAN</p>
          <p><span>3.</span>Zadaj sumu do výšky 50 EUR</p>
          <p><span>4.</span>Pošli platbu. Rýchle platby nemusíš overovať <GlyphSmile /></p>
        </div>
        <GlyphArrow className="fast-payment__glyph" />
        <div className="fast-payment__form" >
          <h2 className="fast-payment__title">Informácie o platbe</h2>
          <FastPayment />
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
