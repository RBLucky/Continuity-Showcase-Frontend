// src/app/page.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Home from './page';

describe('Home Page', () => {
    it('should render the AuthForm component', () => {
        render(<Home />);

        // This test now verifies that the main page correctly displays
        // the "Login" heading from within the AuthForm component.
        const heading = screen.getByRole('heading', { name: /login/i });
        expect(heading).toBeInTheDocument();
    });
});