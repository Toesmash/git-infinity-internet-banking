import moment from 'moment';

const getTodayTransactions = (transactions) => {
  const today = moment();
  const todayTxn = [];

  transactions.map((item) => {
    if (item.paymentDate >= today.startOf('day').valueOf() && item.paymentDate <= today.endOf('day').valueOf()) {
      if (item.type !== 'acctr') {
        todayTxn.push(item);
      }
    }
  });
  todayTxn.sort((a, b) => {
    return a.paymentDate > b.paymentDate ? 1 : -1;
  });
  return todayTxn;
};

export default getTodayTransactions;
