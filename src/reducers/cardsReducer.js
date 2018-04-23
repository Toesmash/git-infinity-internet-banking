const cardsReducerDefaultState = [];

const cardsReducet = (state = cardsReducerDefaultState, action) => {
  switch (action.type) {
    case 'SET_CARDS':
      return action.cards;
    case 'UPDATE_STATUS':
      return state.map((card) => {
        if (card.cardID === action.cardNr) {
          return {
            ...card,
            status: action.status
          };
        }
        return card;
      });
    case 'LOGOUT':
      return cardsReducerDefaultState;
    default:
      return state;
  }
};

export default cardsReducet;
