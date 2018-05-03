import moment from 'moment';

import database from '../firebase/firebase';
import { startUpdateBalance } from './accActions';

// ADDING TRANSACTIONS
export const addTransaction = (txn) => ({
  type: 'ADD_TRANSACTION',
  transaction: txn
});

export const startAddTransaction = (txnData, userID = '') => {
  // console.log('****************************');
  // console.log('*****SUBMITTING PAYMENT*****');
  // console.log('****************************');
  return (dispatch, getState) => {
    let user = userID;
    if (!user) {
      // console.log('NO USER ID GIVEN');
      user = getState().auth.loginID;
    }
    // console.log('USER: ', user);

    const promises = [];
    const {
      type,
      flow,
      status,
      ibanFrom,
      ibanTo,
      amount,
      paymentDate,
      currency,
      varSymbol = '',
      specSymbol = '',
      constSymbol = '',
      express = false,
      note = '',
      creditorName = '',
      charges
    } = txnData;

    const payment = {
      type,
      flow,
      status,
      ibanFrom,
      ibanTo,
      amount,
      currency,
      varSymbol,
      specSymbol,
      constSymbol,
      paymentDate,
      express,
      note,
      creditorName,
      charges
    };
    const bankTo = ibanTo.replace(/ /g, '').slice(4, 8);

    // console.log('ADDING TRANSACTION', flow);
    // console.log(payment);

    const pushTxn = database.ref(`users/${user}/transactions/`).push(payment).then((ref) => {
      if (flow === 'debit') {
        dispatch(addTransaction({
          txnID: ref.key,
          ...payment
        }));
        dispatch(startUpdateBalance(user, ibanFrom, amount, flow));

        if (bankTo === '7777') {
          dispatch(settlePayment(ref.key, payment));
        }
      }
      if (flow === 'credit') {
        if (user === getState().auth.loginID) {
          dispatch(addTransaction({
            txnID: ref.key,
            ...payment
          }));
        }
        dispatch(startUpdateBalance(user, ibanTo, amount, flow));
      }
    });

    promises.push(pushTxn);
    return Promise.all(promises);
  };
};

export const startAddSwiftTransaction = (txnData) => {
  // console.log('**********************************');
  // console.log('*****SUBMITTING SWIFT PAYMENT*****');
  // console.log('**********************************');
  return (dispatch, getState) => {
    const user = getState().auth.loginID;
    // console.log('USER: ', user);

    const promises = [];
    const {
      type,
      flow,
      status,
      charges,
      ibanFrom,
      creditorAcc,
      creditorBIC,
      creditorInfo,
      creditorBankInfo,
      amount,
      originalAmount,
      currency,
      paymentDate,
      reference,
      note,
      express
    } = txnData;

    const payment = {
      type,
      flow,
      status,
      charges,
      ibanFrom,
      creditorAcc,
      creditorBIC,
      creditorInfo,
      creditorBankInfo,
      amount,
      originalAmount,
      currency,
      paymentDate,
      reference,
      note,
      express
    };

    // console.log('ADDING TRANSACTION', flow);
    // console.log(payment);

    const pushTxn = database.ref(`users/${user}/transactions/`).push(payment).then((ref) => {
      dispatch(addTransaction({
        txnID: ref.key,
        ...payment
      }));
      dispatch(startUpdateBalance(user, ibanFrom, amount, flow));
    });

    promises.push(pushTxn);
    return Promise.all(promises);
  };
};


// SETTLING TRANSACTIONS
export const settlePayment = (pmtID, payment) => {
  return (dispatch, getState) => {
    database.ref(`accounts/${payment.ibanTo}`).once('value').then((snapshot) => {
      const creditorID = snapshot.val();
      if (creditorID) {
        // console.log('CREDITOR EXISTS', creditorID);
        const creditPayment = payment;
        creditPayment.flow = 'credit';
        creditPayment.status = 'received';
        dispatch(startAddTransaction(creditPayment, creditorID));
      } else {
        // console.log('CREDITOR DOES NOT EXIST', creditorID);
        const debtorID = getState().auth.loginID;
        database.ref(`users/${debtorID}/transactions/${pmtID}`).update({
          status: 'error',
          error: 'Číslo účtu sa nenašlo'
        }).then(() => {
          // console.log('ERRORED PAYMENT: ', payment);
          const txnData = {
            type: payment.type,
            flow: 'credit',
            status: 'received',
            charges: '',
            ibanFrom: 'INFINITY BANK',
            ibanTo: payment.ibanFrom,
            amount: payment.amount,
            currency: 'EUR',
            paymentDate: payment.paymentDate + 1000,
            note: `Vrátenie sumy za platbu ${pmtID}`,
            specSymbol: '',
            varSymbol: '',
            constSymbol: '',
            express: true
          };
          // console.log('CORRECTED PAYMENT: ', txnData);
          dispatch(startAddTransaction(txnData, debtorID));
        });
      }
    });
  };
};


// REMOVING TRANSACTION
export const cancellTransaction = (id) => ({
  type: 'CANCELL_TRANSACTION',
  id
});

export const startCancellTransaction = (payment) => {
  return (dispatch, getState) => {
    const userID = getState().auth.loginID;
    return database.ref(`users/${userID}/transactions/${payment.txnID}`).update({
      status: 'cancelled',
      error: 'Platba zrušená uživateľom',
      paymentDate: moment().valueOf(),
      cancelledAmount: payment.amount,
      amount: 0
    }).then(() => {
      dispatch(startUpdateBalance(userID, payment.ibanFrom, payment.amount, 'credit'));
      dispatch(cancellTransaction(payment.txnID));
    });
  };
};

// EDITING TRANSACTION
export const editTransaction = (id, payment) => ({
  type: 'EDIT_TRANSACTION',
  id,
  payment
});

export const startEditTransaction = (id, payment) => {
  return (dispatch, getState) => {
    const userID = getState().auth.loginID;
    return database.ref(`users/${userID}/transactions/${id}`).remove().then(() => {
      database.ref(`users/${userID}/transactions/${id}`).set({ ...payment }).then(() => {
        dispatch(editTransaction(id, payment));
      });
    });
  };
};
