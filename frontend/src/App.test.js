import { render, screen } from '@testing-library/react';
import App from './App';

test('renders shop dashboard', () => {
  render(<App />);
  expect(screen.getByRole('heading', { level: 1, name: /Dashboard/i })).toBeInTheDocument();
  expect(screen.getByTitle('Shop Handle')).toBeInTheDocument();
  expect(screen.getByLabelText('Expand sidebar')).toBeInTheDocument();
  expect(screen.getByLabelText('Notifications')).toBeInTheDocument();
});
