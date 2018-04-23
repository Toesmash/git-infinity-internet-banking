import moment from 'moment';

const getFutureTransactions = (transactions, account) => {
  const tomorrow = moment().add(1, 'day');
  const futureTxn = [];

  if (!account) {
    transactions.map((item) => {
      if (item.paymentDate >= tomorrow.startOf('day').valueOf() && item.paymentDate <= moment().endOf('month').valueOf()) {
        futureTxn.push(item);
      }
    });
    futureTxn.sort((a, b) => {
      return a.paymentDate > b.paymentDate ? 1 : -1;
    });
    return futureTxn;
  }

  transactions.map((item) => {
    if (item.paymentDate >= tomorrow.startOf('day').valueOf() && item.ibanFrom === account) {
      futureTxn.push(item);
    }
  });
  futureTxn.sort((a, b) => {
    return a.paymentDate > b.paymentDate ? 1 : -1;
  });

  return futureTxn;
};

export default getFutureTransactions;
