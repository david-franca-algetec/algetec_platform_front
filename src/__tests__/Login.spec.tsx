import { describe, expect, test } from 'vitest';

import { renderWithProviders } from '../helpers/tests.helper';
import { LoginPage } from '../pages/Login';

// The two tests marked with concurrent will be run in parallel
describe('Login page', () => {
  const { findByAltText } = renderWithProviders(<LoginPage />);
  test.concurrent('Find logo', async () => {
    const logo = await findByAltText('Logo Branca');
    expect(logo).toBeTruthy();
  });
});
