import moment from 'moment';

const txnFilterReducerDefaultState = {
  startDate: moment().startOf('month'),
  endDate: moment().endOf('month'),
  flow: 'all',
  sortBy: 'date',
  txnPerPage: '10',
  text: '',
  cardFlow: 'all'
};

const txnFilterReducer = (state = txnFilterReducerDefaultState, action) => {
  switch (action.type) {
    case 'RESET_FILTER':
      return txnFilterReducerDefaultState;

    case 'SET_TEXT':
      return {
        ...state,
        text: action.text
      };

    case 'SET_ATM':
      return {
        ...state,
        cardFlow: 'atm'
      };

    case 'SET_VENDOR':
      return {
        ...state,
        cardFlow: 'vendor'
      };

    case 'SET_ALL_CARDS':
      return {
        ...state,
        cardFlow: 'all'
      };

    case 'SORT_BY_DATE':
      return {
        ...state,
        sortBy: 'date'
      };

    case 'SORT_BY_AMOUNT':
      return {
        ...state,
        sortBy: 'amount'
      };


    case 'SORT_BY_CREDIT':
      return {
        ...state,
        flow: 'credit'
      };

    case 'SORT_BY_DEBIT':
      return {
        ...state,
        flow: 'debit'
      };

    case 'SORT_BY_ALL':
      return {
        ...state,
        flow: 'all'
      };

    case 'SET_START_DATE':
      return {
        ...state,
        startDate: action.date
      };

    case 'SET_END_DATE':
      return {
        ...state,
        endDate: action.date
      };

    case 'SET_TXN_PER_PAGE':
      return {
        ...state,
        txnPerPage: action.amount
      };
    default:
      return state;
  }
};

export default txnFilterReducer;
