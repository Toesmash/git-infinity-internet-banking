const authReducerDefaultState = {};

const authReducer = (state = authReducerDefaultState, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        uid: action.uid
      };
    case 'LOGOUT':
      return authReducerDefaultState;
    case 'SET_USER_INFO':
      return {
        ...state,
        loginID: action.loginID,
        firstName: action.firstName,
        lastName: action.lastName,
        memberSince: action.memberSince,
        phone: action.phone,
        secret: action.secret
      };
    default:
      return state;
  }
};

export default authReducer;
