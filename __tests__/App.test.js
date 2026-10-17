import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

// With no saved session the app starts on the login screen.
it('opens the login screen when nobody is logged in', async () => {
  await render(<App />);
  expect(await screen.findByRole('header', { name: 'Log in' })).toBeTruthy();
  expect(screen.getByLabelText('Email')).toBeTruthy();
  expect(screen.getByLabelText('Password')).toBeTruthy();
});
