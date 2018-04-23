import moment from 'moment';


const getCardTransactions = (transactions, card, filter) => {
  const {
    startDate,
    endDate,
    cardFlow,
    sortBy,
    text
  } = filter;

  if (!card) {
    return transactions.filter((item) => {
      let txnCardFlow = false;
      let textMatch = false;
      const isCardTxn = item.type === 'cards';
      const createdAtMoment = moment(item.paymentDate);
      const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
      const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;

      if (cardFlow === 'vendor') { txnCardFlow = !item.ATM; }
      if (cardFlow === 'atm') { txnCardFlow = item.ATM; }
      if (cardFlow === 'all') { txnCardFlow = true; }

      if (item.type === 'cards') {
        textMatch =
          item.ibanFrom.toLowerCase().includes(text.toLowerCase()) ||
          item.cardID.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.note.toLowerCase().includes(text.toLowerCase());
      }

      return isCardTxn && txnCardFlow && textMatch && startDateMatch && endDateMatch;
    }).sort((a, b) => {
      if (sortBy === 'date') {
        return a.paymentDate < b.paymentDate ? 1 : -1;
      }
      if (sortBy === 'amount') {
        let x = a.amount;
        let y = b.amount;
        if (a.flow === 'debit') {
          x *= -1;
        }
        if (b.flow === 'debit') {
          y *= -1;
        }
        return x < y ? 1 : -1;
      }
      return false;
    });
  }

  return transactions.filter((item) => {
    let txnCardFlow = false;
    let textMatch = false;
    const isCardTxn = item.type === 'cards';
    const createdAtMoment = moment(item.paymentDate);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;

    if (item.cardID === card) {
      if (cardFlow === 'vendor') { txnCardFlow = !item.ATM; }
      if (cardFlow === 'atm') { txnCardFlow = item.ATM; }
      if (cardFlow === 'all') { txnCardFlow = true; }
      if (item.type === 'cards') {
        textMatch =
          item.ibanFrom.toLowerCase().includes(text.toLowerCase()) ||
          item.cardID.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.note.toLowerCase().includes(text.toLowerCase());
      }
    }

    return isCardTxn && txnCardFlow && textMatch && startDateMatch && endDateMatch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      return a.paymentDate < b.paymentDate ? 1 : -1;
    }
    if (sortBy === 'amount') {
      let x = a.amount;
      let y = b.amount;
      if (a.flow === 'debit') {
        x *= -1;
      }
      if (b.flow === 'debit') {
        y *= -1;
      }
      return x < y ? 1 : -1;
    }
    return false;
  });
};

export default getCardTransactions;
