// src/components/AuthForm.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { AuthForm } from './AuthForm';
import { Toaster } from '@/components/ui/sonner';

// The helper function remains the same.
const renderAuthForm = () => {
    render(
        <>
            <AuthForm />
            <Toaster />
        </>
    );
    return { user: userEvent.setup() };
};

describe('AuthForm (Static)', () => {
    it('should render the login form by default', () => {
        renderAuthForm();
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    });
});

describe('AuthForm (Interactive)', () => {

    it('should switch between login and sign up forms', async () => {
        const { user } = renderAuthForm();
        await user.click(screen.getByRole('button', { name: /sign up/i }));
        expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should show a confirmation message after successful registration', async () => {
        // Mock fetch locally for this specific test
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ message: 'User created' }))
        );

        const { user } = renderAuthForm();
        await user.click(screen.getByRole('button', { name: /sign up/i }));
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'a-secure-password');
        await user.click(screen.getByRole('button', { name: /create account/i }));

        expect(await screen.findByText(/registration successful! please sign in./i)).toBeInTheDocument();
    });

    it('should show a success message after a successful login', async () => {
        // Mock fetch locally for this specific test
        vi.spyOn(global, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ access_token: 'token' }))
        );

        const { user } = renderAuthForm();
        await user.type(screen.getByLabelText(/email/i), 'test@example.com');
        await user.type(screen.getByLabelText(/password/i), 'a-secure-password');
        await user.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByText(/login successful!/i)).toBeInTheDocument();
    });
});