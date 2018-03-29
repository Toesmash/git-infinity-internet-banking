import database from '../firebase/firebase';

export const setUserInfo = ({
  firstName, lastName, memberSince, phone, secret, loginID
}) => ({
  type: 'SET_USER_INFO',
  firstName,
  lastName,
  memberSince,
  phone,
  secret,
  loginID
});

export const setUserAccounts = (accounts) => ({
  type: 'SET_ACCOUNTS',
  accounts
});

export const setUserTransactions = (transactions) => ({
  type: 'SET_TRANSACTIONS',
  transactions
});

export const fetchUserData = (userID) => {
  const transactions = [];
  const accounts = [];
  let userData;

  return (dispatch) => {
    const fetchPromises = [];
    database.ref(`users/${userID}`).once('value').then((snapshot) => {
      const data = snapshot.val();
      userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        memberSince: data.memberSince,
        phone: data.phone,
        secret: data.secret,
        loginID: userID
      };
    }).then(() => {
      dispatch(setUserInfo(userData));
    });

    const accPromise = database.ref(`users/${userID}/accounts`).once('value').then((snapshot) => {
      snapshot.forEach((item) => {
        accounts.push({
          iban: item.key,
          ...item.val()
        });
      });
    });

    const txnPromise = database.ref(`users/${userID}/transactions/`).once('value').then((snapshot) => {
      snapshot.forEach((item) => {
        transactions.push({
          txnID: item.key,
          ...item.val()
        });
      });
    });
    fetchPromises.push(accPromise);
    fetchPromises.push(txnPromise);

    return Promise.all(fetchPromises).then(() => {
      dispatch(setUserAccounts(accounts));
      dispatch(setUserTransactions(transactions));
    });
  };
};
