import {
  render, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import AppContainer from '../components/AppContainer';
import store from '../store/index';

describe('App', () => {
  test('renders Main Page', () => {
    render(
      <Provider store={store}>
        <AppContainer />
      </Provider>,
    );
    const FirstHeading = screen.getByText(/Welcome STUDENTS/i);
    const secondHeading = screen.queryByText(/Or Are You a TEACHER?/i);
    expect(FirstHeading).toBeInTheDocument();
    expect(secondHeading).toBeInTheDocument();
  });
});
