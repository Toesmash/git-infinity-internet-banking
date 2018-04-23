import React from 'react';
import { connect } from 'react-redux';
import SepaForm from './SepaForm';
import { startCancellTransaction, startEditTransaction } from '../actions/txnActions';

const SepaPaymentEdit = (props) => {
  const onRemove = (payment) => {
    props.startCancellTransaction(payment).then(() => {
      props.history.push(`/accounts/${payment.ibanFrom}/cancell`);
    });
  };

  const onEdit = (updatedPayment) => {
    props.startEditTransaction(props.match.params.id, updatedPayment).then(() => {
      props.history.push(`/accounts/${updatedPayment.ibanFrom}/edit`);
    });
  };

  return (
    <div className="content-container">
      <h2 className="page-header__title">Uprav SEPA platbu</h2>
      <div className="page-header__tagline">
        <p>
          Jednotná oblasť platieb pre Európsku úniu.
          Rovnaké poplatky. Rovnaký čas. Rovnaké tlačivá.
        </p>
      </div>
      <SepaForm sepa={props.txn} onRemove={onRemove} onEdit={onEdit} />
    </div>
  );
};

const mapStateToProps = (reduxState, props) => ({
  txn: reduxState.transactions.find((item) => {
    return item.txnID === props.match.params.id;
  })
});

const mapDispatchToProps = (dispatch, props) => ({
  startCancellTransaction: (payment) => dispatch(startCancellTransaction(payment)),
  startEditTransaction: (id, payment) => dispatch(startEditTransaction(id, payment))
});

export default connect(mapStateToProps, mapDispatchToProps)(SepaPaymentEdit);
