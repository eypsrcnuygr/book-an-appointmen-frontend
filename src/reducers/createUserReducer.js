const initialState = {
  user: {
    email: '',
    password: '',
    password_confirmation: '',
    uid: '',
    client: '',
    access_token: '',
  },
  admin: {
    emailForAdmin: '',
    passwordForAdmin: '',
    password_confirmationForAdmin: '',
    image: null,
    uidForAdmin: '',
    clientForAdmin: '',
    access_tokenForAdmin: '',
  },
  isLoggedIn: false,
  isAdminLoggedIn: false,
};

const createUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_USER': {
      return {
        ...state,
        user: {
          email: action.payload.user.email,
          password: action.payload.user.password,
          password_confirmation: action.payload.user.password_confirmation,
          uid: action.payload.user.uid,
          client: action.payload.user.client,
          access_token: action.payload.user.access_token,
        },
        isLoggedIn: true,
      };
    }
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
        isLoggedIn: false,
      };
    case 'CREATE_ADMIN': {
      return {
        ...state,
        admin: {
          emailForAdmin: action.payload.admin.email,
          passwordForAdmin: action.payload.admin.password,
          password_confirmationForAdmin:
            action.payload.admin.password_confirmation,
          uidForAdmin: action.payload.admin.uidForAdmin,
          clientForAdmin: action.payload.admin.clientForAdmin,
          access_tokenForAdmin: action.payload.admin.access_tokenForAdmin,
        },
        isAdminLoggedIn: true,
      };
    }
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
        isAdminLoggedIn: false,
      };
    default:
      return state;
  }
};

export default createUserReducer;
