import {
  render, screen, waitFor,
} from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import AppContainer from '../components/AppContainer';
import store from '../store/index';

describe('Index', () => {
  test('renders Main Page after sign-up and navigate on the page, you need to change the mail to pass the validation', async () => {
    const root = document.createElement('div');
    document.body.appendChild(root);

    const history = createMemoryHistory();
    render(
      <Provider store={store}>
        <Router history={history}>
          <AppContainer />
        </Router>
      </Provider>,
    );
    const a = document.querySelector('#myMailForTest');
    userEvent.type(a, 'ensaruygur41@gmail.com');
    userEvent.type(document.querySelector('#myPasswordForTest'), '1234567');
    userEvent.type(document.querySelector('#myPasswordConfirmationForTest'), '1234567');

    const button = document.querySelector('#myButtonForTest');
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitFor(() => expect(screen.getByText(/Here Are the Registrated Teachers/i)));

    const button3 = document.querySelector('#appointmentsFetcher');
    act(() => {
      button3.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    waitFor(() => expect(screen.getByText(/Your invitation/i)));

    const button4 = document.querySelector('#home');
    act(() => {
      button4.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitFor(() => expect(screen.getByText(/Here Are the Registrated Teachers/i)));

    const button2 = document.querySelector('#logoutUser');
    act(() => {
      button2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitFor(() => expect(screen.getByText(/Welcome STUDENTS/i)));
  });
});
