import React from 'react';
import numeral from 'numeral';
import IBAN from 'fast-iban';
import moment from 'moment';
import { Link } from 'react-router-dom';

export default class AccountsTransactionItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedTransaction: false,
      selectedTransaction: false
    };
  }

  getTxnDate = (txn) => {
    return (
      <div className="date">
        <div className="date__top">{moment(txn.paymentDate).format('DD MMM').toUpperCase()}</div>
        <div className="date__bottom">{moment(txn.paymentDate).format('YYYY')}</div>
      </div>
    );
  };

  getTxnType = (txn) => {
    let typ = '';
    if (txn.type === 'sepa') { typ = 'sepa'; }
    if (txn.type === 'swift') { typ = 'swift'; }
    if (txn.type === 'acctr') { typ = 'acctr'; }
    if (txn.type === 'cards') { typ = 'cards'; }
    return (
      <div className="type">
        <img alt={typ} src={`/images/${typ}_thumbnail.png`} />
      </div>
    );
  };

  getTxnNote = (txn) => {
    if (txn.type === 'sepa') {
      if (!txn.note) return <div className="note">SEPA platba</div>;
      return (
        <div className="note">
          <div className="note__top">
            {txn.note}
          </div>
          <div className="note__bottom">
            {!txn.varSymbol && !txn.specSymbol && !txn.constSymbol ? '' : `/VS${txn.varSymbol}/SS${txn.specSymbol}/KS${txn.constSymbol}`}
          </div>
        </div>
      );
    }
    if (txn.type === 'swift') {
      if (!txn.note) return <div className="note">SWIFT platba</div>;
      return (
        <div className="note">
          <div className="note__top">
            {txn.note}
          </div>
          <div className="note__bottom">
            {txn.reference}
          </div>
        </div>
      );
    }
    if (txn.type === 'acctr') {
      if (!txn.note) return <div className="note">Prevod medzi účtami</div>;
      return (
        <div className="note">
          {txn.note}
        </div>
      );
    }
    if (txn.type === 'cards') {
      if (!txn.note) return <div className="note">Transakcia kartou</div>;
      return (
        <div className="note">
          {txn.note}
        </div>
      );
    }
    return 'Platba';
  };


  getTxnAmount = (txn) => {
    if (txn.currency === 'EUR') {
      return (
        <div
          className={txn.flow === 'credit' ? 'amount amount--credit' : 'amount amount--debit'}
        >
          {txn.flow === 'credit' ? '+' : '-'}{numeral(txn.amount / 100).format('0,0.00')} EUR
        </div>
      );
    }

    return (
      <div className="amount">
        <div
          className={txn.flow === 'credit' ? 'amount__top amount--credit' : 'amount__top amount--debit'}
        >
          {txn.flow === 'credit' ? '+' : '-'}{numeral(txn.amount / 100).format('0,0.00')} EUR
        </div>
        {
          (txn.status === 'sent' || txn.status === 'wait' || txn.status === 'received') && (
            <div className="amount__bottom">
              {txn.flow === 'credit' ? '+' : '-'}{numeral(txn.originalAmount / 100).format('0,0.00')} {txn.currency}
            </div>
          )
        }
      </div>
    );
  };

  getStatus = (txnStatus) => {
    let status = '';
    let statusStyle = '';
    if (txnStatus === 'sent' || txnStatus === 'received') {
      status = 'dokončená';
      statusStyle = 'detail__status--success';
    }
    if (txnStatus === 'error' || txnStatus === 'cancelled') {
      status = 'chyba';
      statusStyle = 'detail__status--error';
    }
    if (txnStatus === 'wait') {
      status = 'čaká na spracovanie';
      statusStyle = 'detail__status--wait';
    }
    return <p className={statusStyle}>{status}</p>;
  };

  getTxnDetail = (txn) => {
    if (txn.type === 'sepa' || txn.type === 'acctr') {
      return (
        <div className="detail">
          <div className="detail__table__header">
            <h4>Číslo transakcie: <span>{txn.txnID}</span></h4>
            <div>
              {
                txn.paymentDate > moment().endOf('day').valueOf() ?
                  <Link to={`/payments/${txn.type}/${txn.ibanFrom}/${txn.txnID}`}><button className="button button__edit">Uprav alebo vymaž transakciu</button></Link> :
                  ''
              }
            </div>
          </div>
          <div className="detail__table">
            <div>
              <p>Typ</p>
              {txn.type === 'sepa' ? <p>SEPA platba</p> : <p>Prevod medzi účtami</p>}
            </div>
            <div>
              <p>Status:</p>
              {this.getStatus(txn.status)}
            </div>
            {(txn.status === 'error' || txn.status === 'cancelled') && (
              <div>
                <p>Chybná správa:</p>
                <p className="detail__status--error">{txn.error}</p>
              </div>
            )}
            {txn.status === 'cancelled' && (
              <div>
                <p>Pôvodná suma:</p>
                <p className="detail__status--error">{numeral(txn.cancelledAmount / 100).format('0,0.00')} {txn.currency}</p>
              </div>
            )}
            <div>
              <p>Dátum spracovania:</p>
              <p>{moment(txn.paymentDate).format('dddd, D MMMM YYYY, kk:mm')}</p>
            </div>
            <div>
              <p>Odosielateľ:</p>
              <p className="iban-font">{IBAN.formatIBAN(txn.ibanFrom)}</p>
            </div>
            <div>
              <p>Prijímateľ:</p>
              <p className="iban-font">{IBAN.formatIBAN(txn.ibanTo)}</p>
            </div>
            <div>
              <p>Suma:</p>
              <p>{numeral(txn.amount / 100).format('0,0.00')} {txn.currency}</p>
            </div>
            <div>
              <p>Variabliný symbol:</p>
              <p>{txn.varSymbol}</p>
            </div>
            <div>
              <p>Špecifický symbol:</p>
              <p>{txn.specSymbol}</p>
            </div>
            <div>
              <p>Konštantný symbol:</p>
              <p>{txn.constSymbol}</p>
            </div>
            <div>
              <p>Poznámka:</p>
              <p>{txn.note}</p>
            </div>
            {txn.charges && (
              <div>
                <p>Poplatky:</p>
                <p>{txn.charges}</p>
              </div>
            )}
            <div>
              <p>Express platba:</p>
              {txn.express ? <p>Áno</p> : <p>Nie</p>}
            </div>
          </div>
        </div>
      );
    }

    if (txn.type === 'swift') {
      return (
        <div className="detail">
          <div className="detail__table__header">
            <h4>Číslo transakcie: <span>{txn.txnID}</span></h4>
            <div>
              {
                txn.paymentDate > moment().endOf('day').valueOf() ? <Link to={`/payments/${txn.type}/${txn.ibanFrom}/${txn.txnID}`}><button className="button button__edit">Uprav alebo vymaž transakciu</button></Link> : ''
              }
            </div>
          </div>
          <div className="detail__table">
            <div>
              <p>Typ</p>
              <p>Medzinárodná platba SWIFT</p>
            </div>
            <div>
              <p>Status:</p>
              {this.getStatus(txn.status)}
            </div>
            {(txn.status === 'error' || txn.status === 'cancelled') && (
              <div>
                <p>Chybná správa:</p>
                <p className="detail__status--error">{txn.error}</p>
              </div>
            )}
            {txn.status === 'cancelled' && (
              <div>
                <p>Pôvodná suma:</p>
                <p className="detail__status--error">{numeral(txn.cancelledAmount / 100).format('0,0.00')} {txn.currency}</p>
              </div>
            )}
            <div>
              <p>Dátum spracovania:</p>
              <p>{moment(txn.paymentDate).format('dddd, D MMMM YYYY, kk:mm')}</p>
            </div>
            <div>
              <p>Odosielateľ:</p>
              <p className="iban-font">{IBAN.formatIBAN(txn.ibanFrom)}</p>
            </div>
            <div>
              <p>Účet prijímateľa:</p>
              <p className="iban-font">{txn.creditorAcc} - {txn.creditorBIC}</p>
            </div>
            <div>
              <p>Prijímateľ:</p>
              <p>{txn.creditorInfo}</p>
            </div>
            <div>
              <p>Banka prijímateľa:</p>
              <p className="iban-font">{txn.creditorBankInfo}</p>
            </div>
            <div>
              <p>Suma:</p>
              <p>{numeral(txn.amount / 100).format('0,0.00')} EUR</p>
            </div>
            <div>
              <p>Pôvodná suma:</p>
              <p>{numeral(txn.originalAmount / 100).format('0,0.00')} {txn.currency}</p>
            </div>
            <div>
              <p>Referencia:</p>
              <p>{txn.reference}</p>
            </div>
            <div>
              <p>Poznámka:</p>
              <p>{txn.note}</p>
            </div>
            <div>
              <p>Poplatky:</p>
              <p>{txn.charges}</p>
            </div>
            <div>
              <p>Express platba:</p>
              {txn.express ? <p>Áno</p> : <p>Nie</p>}
            </div>
          </div>
        </div>
      );
    }
    if (txn.type === 'cards') {
      return (
        <div className="detail">
          <div className="detail__table__header">
            <h4>Číslo transakcie: <span>{txn.txnID}</span></h4>
          </div>
          <div className="detail__table">
            <div>
              <p>Typ</p>
              <p>Kartová transakcia</p>
            </div>
            <div>
              <p>Podtyp:</p>
              {txn.ATM ? <p>Výber z bankomatu</p> : <p>Platba u obchodníka</p>}
            </div>
            <div>
              <p>Status:</p>
              {this.getStatus(txn.status)}
            </div>
            {txn.status === 'error' && (
              <div>
                <p>Chybná správa:</p>
                <p className="detail__status--error">{txn.error}</p>
              </div>
            )}
            <div>
              <p>Dátum spracovania:</p>
              <p>{moment(txn.paymentDate).format('dddd, D MMMM YYYY, kk:mm')}</p>
            </div>
            <div>
              <p>Odosielateľ:</p>
              <p className="iban-font">{IBAN.formatIBAN(txn.ibanFrom)}</p>
            </div>
            <div>
              <p>Karta:</p>
              <p className="iban-font">{IBAN.formatIBAN(txn.cardID.toString())}</p>
            </div>
            <div>
              <p>Suma:</p>
              <p>{numeral(txn.amount / 100).format('0,0.00')} {txn.currency}</p>
            </div>
            <div>
              <p>Poznámka:</p>
              <p>{txn.note}</p>
            </div>
            <div>
              <p>Poplatky:</p>
              <p>{txn.charges}</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div>
        ahoj
      </div>
    );
  };

  toggleDetail = () => {
    this.setState({
      expandedTransaction: !this.state.expandedTransaction,
      selectedTransaction: !this.state.selectedTransaction
    });
  };

  render() {
    const { txn } = this.props;
    return (
      <div>
        <div
          key={txn.txnID}
          className={this.state.selectedTransaction ? 'transactions__entry transaction__entry--selected' : 'transactions__entry'}
          onClick={this.toggleDetail}
        >
          {this.getTxnDate(txn)}
          {this.getTxnType(txn)}
          {this.getTxnNote(txn)}
          {this.getTxnAmount(txn)}
        </div>
        <div className={this.state.expandedTransaction ? 'transactions__entry__detail--show' : 'transactions__entry__detail--hide'}>
          {this.getTxnDetail(txn)}
        </div>
      </div>
    );
  }
}
