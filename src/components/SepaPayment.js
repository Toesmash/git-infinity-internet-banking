import React from 'react';
// import SepaForm from './SepaForm';
import { connect } from 'react-redux';
// import { startAddTransaction } from '../actions/txnActions';

const SepaPayment = (props) => {
  // const onSubmit = (payment) => {
  //   props.startAddTransaction(payment);
  //   props.history.push('/dashboard');
  // };

  return (
    <div>
      <h2>Nova SEPA platba</h2>
    </div>
  );
};


const mapDispatchToProps = (dispatch) => ({
  // startAddTransaction: (payment) => dispatch(startAddTransaction(payment))
});

export default connect(undefined, mapDispatchToProps)(SepaPayment);
