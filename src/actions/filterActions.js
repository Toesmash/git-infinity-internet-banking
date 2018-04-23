// TXN FILTER
export const resetFilter = () => ({
  type: 'RESET_FILTER'
});

export const setTextFilter = (text) => ({
  type: 'SET_TEXT',
  text
});

export const sortByDate = () => ({
  type: 'SORT_BY_DATE'
});

export const sortByAmount = () => ({
  type: 'SORT_BY_AMOUNT'
});

export const sortByCredit = () => ({
  type: 'SORT_BY_CREDIT'
});

export const sortByDebit = () => ({
  type: 'SORT_BY_DEBIT'
});

export const sortByAll = () => ({
  type: 'SORT_BY_ALL'
});

export const setStartDate = (date) => ({
  type: 'SET_START_DATE',
  date
});

export const setEndDate = (date) => ({
  type: 'SET_END_DATE',
  date
});

export const setTxnPerPage = (amount) => ({
  type: 'SET_TXN_PER_PAGE',
  amount
});

export const sortByVendor = () => ({
  type: 'SET_VENDOR'
});

export const sortByATM = () => ({
  type: 'SET_ATM'
});

export const sortAllCardsTxn = () => ({
  type: 'SET_ALL_CARDS'
});
