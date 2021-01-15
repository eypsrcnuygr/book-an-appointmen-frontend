export const createUser = user => ({
  type: 'CREATE_USER',
  payload: user,
});

export const loginUser = user => ({
  type: 'LOGIN_USER',
  payload: user,
});

export const logoutUser = () => ({
  type: 'LOGOUT_USER',
});

export const createAdmin = admin => ({
  type: 'CREATE_ADMIN',
  payload: admin,
});

export const loginAdmin = admin => ({
  type: 'LOGIN_ADMIN',
  payload: admin,
});

export const logoutAdmin = () => ({
  type: 'LOGOUT_ADMIN',
});
