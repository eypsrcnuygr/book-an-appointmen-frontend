export const SetLocalStorageForUser = response => {
  const myResponse = response.data.data;
  const myUid = response.headers.uid;
  const myClient = response.headers.client;
  const myAccessToken = response.headers['access-token'];
  localStorage.setItem('currentUser', JSON.stringify({
    myResponse, myUid, myClient, myAccessToken,
  }));
};

export const setLocalStorageForAdmin = response => {
  const myResponse = response.data.data;
  const myUid = response.headers.uid;
  const myClient = response.headers.client;
  const myAccessToken = response.headers['access-token'];
  localStorage.setItem('currentAdmin', JSON.stringify({
    myResponse, myUid, myClient, myAccessToken,
  }));
};
