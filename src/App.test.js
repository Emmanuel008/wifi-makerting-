import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

test('renders sign in page at /login', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /wifi payment/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});

test('renders dashboard navigation', () => {
  render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <AppRoutes />
    </MemoryRouter>
  );
  expect(screen.getByRole('heading', { name: /^dashboard$/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /captive portal/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /wifi bundles/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /transactions/i })).toBeInTheDocument();
});
