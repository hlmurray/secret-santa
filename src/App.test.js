import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

it('renders without crashing', () => {
  render(<App />);
});

it('renders a snapshot', () => {
  const component = render(<App />);
  expect(component).toMatchSnapshot();
});
