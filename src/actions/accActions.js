import database from '../firebase/firebase';

export const updateBalance = (ibanFrom, newBalance) => ({
  type: 'UPDATE_BALANCE',
  iban: ibanFrom,
  balance: newBalance
});

export const startUpdateBalance = (user, iban, value, flow) => {
  console.log('UPDATEING BALANCE: ', user, iban, value, flow);
  return (dispatch) => {
    let newBalance;
    database.ref(`users/${user}/accounts/${iban}`).once('value').then((snapshot) => {
      const oldBalance = snapshot.val().balance;
      if (flow === 'debit') { newBalance = oldBalance - value; }
      if (flow === 'credit') { newBalance = oldBalance + value; }
    }).then(() => {
      database.ref(`users/${user}/accounts/${iban}`).update({ balance: newBalance });
      dispatch(updateBalance(iban, newBalance));
    });
  };
};
