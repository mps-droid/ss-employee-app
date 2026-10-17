import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Button, StatusPill, TextField } from '../src/components';

// Testing Library 14 renders asynchronously, so render and events are awaited.
describe('components', () => {
  it('runs the button action and blocks it while loading', async () => {
    const onPress = jest.fn();
    const { rerender } = await render(
      <Button title="Log in" onPress={onPress} />,
    );
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));
    expect(onPress).toHaveBeenCalledTimes(1);

    await rerender(<Button title="Log in" onPress={onPress} loading />);
    await fireEvent.press(screen.getByRole('button', { name: 'Log in' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('labels a status for screen readers', async () => {
    await render(<StatusPill label="In progress" tone="warning" />);
    expect(screen.getByLabelText('Status: In progress')).toBeTruthy();
  });

  it('lets people show and hide a password', async () => {
    await render(<TextField label="Password" value="secret" secure />);
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
    await fireEvent.press(
      screen.getByRole('button', { name: 'Show password' }),
    );
    expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(false);
  });

  it('shows a field error', async () => {
    await render(
      <TextField label="Email" value="" error="Enter your email." />,
    );
    expect(screen.getByText('Enter your email.')).toBeTruthy();
  });
});
