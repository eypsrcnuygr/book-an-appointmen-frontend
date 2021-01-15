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
import 'jest-canvas-mock';

describe('IndexForAdmin', () => {
  test('renders Main Page after sign-up, you need to change the mail to pass validation', async () => {
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
    const a = document.querySelector('#emailForAdmin');
    userEvent.type(a, 'melekuygur29@gmail.com');
    userEvent.type(document.querySelector('#passwordForAdmin'), '1234567');
    userEvent.type(document.querySelector('#passwordConfirmationForAdmin'), '1234567');
    const button = document.querySelector('#buttonForAdmin');

    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitFor(() => expect(screen.getByText(/You are logged in/i)));
    const button2 = document.querySelector('#logoutAdmin');
    act(() => {
      button2.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    await waitFor(() => expect(screen.getByText(/Or Are You a TEACHER/i)));
  });
});
