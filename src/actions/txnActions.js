import database from '../firebase/firebase';

// ADDING TRANSACTIONS
export const addTransaction = (txn) => ({
  type: 'ADD_TRANSACTION',
  transaction: txn
});

export const startAddTransaction = (txnData) => {
  return (dispatch, getState) => {
    const userID = getState().auth.loginID;
    const {
      type,
      flow,
      ibanFrom,
      ibanTo,
      amount,
      varSymbol = '',
      specSymbol = '',
      constSymbol = '',
      paymentDate,
      expressChecked = false,
      note = ''
    } = txnData;

    const payment = {
      type,
      flow,
      ibanFrom,
      ibanTo,
      amount,
      varSymbol,
      specSymbol,
      constSymbol,
      paymentDate,
      expressChecked,
      note
    };
    console.log('PUSHING: ', payment);
    return database.ref(`users/${userID}/transactions/`).push(payment).then((ref) => {
      dispatch(addTransaction({
        txnID: ref.key,
        ...payment
      }));
    });
  };
};
