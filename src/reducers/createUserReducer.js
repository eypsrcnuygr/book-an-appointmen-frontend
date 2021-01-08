const initialState = {
  user: {
    email: '',
    password: '',
    password_confirmation: '',
  },
  admin: {
    emailForAdmin: '',
    passwordForAdmin: '',
    password_confirmationForAdmin: '',
    photo: null,
  },
  isLoggedIn: false,
  isAdminLoggedIn: false,
};

const createUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_USER':
      return {
        ...state,
        user: {
          email: action.payload.user.email,
          password: action.payload.user.password,
          password_confirmation: action.payload.user.password_confirmation,
        },
        isLoggedIn: true,
      };
    case 'LOGIN_USER':
      return {
        ...state,
        user: {
          email: action.payload.user.email,
          password: action.payload.user.password,
        },
        isLoggedIn: true,
      };
    case 'LOGOUT_USER':
      return {
        ...state,
        user: {
          email: '',
          password: '',
        },
        isLoggedIn: false,
      };
    case 'CREATE_ADMIN':
      return {
        ...state,
        admin: {
          emailForAdmin: action.payload.admin.email,
          passwordForAdmin: action.payload.admin.password,
          password_confirmationForAdmin:
            action.payload.admin.password_confirmation,
        },
        isAdminLoggedIn: true,
      };
    case 'LOGIN_ADMIN':
      return {
        ...state,
        admin: {
          emailForAdmin: action.payload.admin.email,
          passwordForAdmin: action.payload.admin.password,
        },
        isAdminLoggedIn: true,
      };
    case 'LOGOUT_ADMIN':
      return {
        ...state,
        admin: {
          emailForAdmin: '',
          passwordForAdmin: '',
        },
        isAdminLoggedIn: false,
      };
    default:
      return state;
  }
};

export default createUserReducer;
