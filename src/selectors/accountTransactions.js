import moment from 'moment';

const getAccountTransactions = (transactions, account, filter) => {
  // const accTransactions = [];
  const EoD = moment().endOf('day').valueOf();
  const {
    startDate,
    endDate,
    flow,
    sortBy,
    text
  } = filter;


  if (!account) {
    return transactions.filter((item) => {
      let txnFlow = false;
      let textMatch = false;
      const createdAtMoment = moment(item.paymentDate);
      const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
      const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
      const isEoD = item.paymentDate <= EoD;
      if (item.type === 'sepa' || item.type === 'acctr') {
        textMatch =
          item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.ibanTo.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.note.toString().toLowerCase().includes(text.toLowerCase());
      }
      if (item.type === 'swift') {
        textMatch =
          item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.creditorAcc.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.creditorInfo.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.creditorBIC.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.currency.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.note.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.reference.toString().toLowerCase().includes(text.toLowerCase());
      }

      if (item.type === 'cards') {
        textMatch =
          item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.cardID.toString().toLowerCase().includes(text.toLowerCase()) ||
          item.note.toString().toLowerCase().includes(text.toLowerCase());
      }

      if (flow === 'credit') {
        txnFlow = item.flow === 'credit';
      }
      if (flow === 'debit') {
        txnFlow = item.flow === 'debit';
      }
      if (flow === 'all') {
        txnFlow = true;
      }
      return startDateMatch && endDateMatch && textMatch && txnFlow && isEoD;
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
    let txnFlow = false;
    let textMatch = false;
    let accountMatch = false;
    const createdAtMoment = moment(item.paymentDate);
    const startDateMatch = startDate ? startDate.isSameOrBefore(createdAtMoment, 'day') : true;
    const endDateMatch = endDate ? endDate.isSameOrAfter(createdAtMoment, 'day') : true;
    const isEoD = item.paymentDate <= EoD;

    // MATCHUJE UCET
    if (item.ibanFrom === account || item.ibanTo === account) {
      if (item.type !== 'acctr') {
        accountMatch = true;
      }
      if (item.ibanFrom === account && item.type === 'acctr' && item.flow === 'debit') {
        accountMatch = true;
      }
      if (item.ibanTo === account && item.type === 'acctr' && item.flow === 'credit') {
        accountMatch = true;
      }
    }

    // MATCHUJE TEXT
    if (item.type === 'sepa' || item.type === 'acctr') {
      textMatch =
        item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.ibanTo.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.note.toString().toLowerCase().includes(text.toLowerCase());
    }

    if (item.type === 'swift') {
      textMatch =
        item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.creditorAcc.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.creditorInfo.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.creditorBIC.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.currency.toString().toLowerCase().includes(text.toLowerCase());
    }

    if (item.type === 'cards') {
      textMatch =
        item.ibanFrom.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.cardID.toString().toLowerCase().includes(text.toLowerCase()) ||
        item.note.toString().toLowerCase().includes(text.toLowerCase());
    }

    if (flow === 'credit') {
      txnFlow = item.flow === 'credit';
    }
    if (flow === 'debit') {
      txnFlow = item.flow === 'debit';
    }
    if (flow === 'all') {
      txnFlow = true;
    }
    return startDateMatch && endDateMatch && textMatch && txnFlow && isEoD && accountMatch;
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


  // // AK JE ACCOUNT VYBRATY
  // transactions.map((item) => {
  //   if (item.paymentDate <= EoD) {
  //     if (item.ibanFrom === account || item.ibanTo === account) {
  //       if (item.type !== 'acctr') { accTransactions.push(item); }
  //       if (item.ibanFrom === account && item.type === 'acctr' && item.flow === 'debit') {
  //         accTransactions.push(item);
  //       }
  //       if (item.ibanTo === account && item.type === 'acctr' && item.flow === 'credit') {
  //         accTransactions.push(item);
  //       }
  //     }
  //   }
  // });

  // accTransactions.sort((a, b) => {
  //   return a.paymentDate > b.paymentDate ? -1 : 1;
  // });
  // return accTransactions;
};

export default getAccountTransactions;
