// src/components/AuthForm.tsx
"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle as ShadcnCardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Custom wrapper for CardTitle to avoid passing non-DOM props to div
type CardTitleProps = React.HTMLAttributes<HTMLDivElement> & { asChild?: boolean };
const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
    ({ className, asChild, ...props }, ref) => (
        <ShadcnCardTitle className={className} ref={ref} {...props} />
    )
);
CardTitle.displayName = 'CardTitle';

type FormMode = 'login' | 'signup';

export function AuthForm() {
    const [mode, setMode] = useState<FormMode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (mode === 'signup') {
                const res = await fetch('http://127.0.0.1:8000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Registration failed');

                toast.success("Registration successful! Please sign in.");
                setMode('login');
                setEmail('');
                setPassword('');
            } else {
                const formData = new URLSearchParams();
                formData.append('username', email);
                formData.append('password', password);

                const res = await fetch('http://127.0.0.1:8000/auth/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: formData.toString(),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.detail || 'Login failed');

                toast.success("Login successful!");
                console.log("Received JWT:", data.access_token);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-sm">
            <form onSubmit={handleFormSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl" asChild>
                        <h2>{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
                    </CardTitle>
                    <CardDescription>
                        {mode === 'login'
                            ? 'Enter your email below to login to your account.'
                            : 'Create a new account to get started.'}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <Button className="w-full" type="submit" disabled={isLoading}>
                        {isLoading ? 'Processing...' : (mode === 'login' ? 'Sign in' : 'Create Account')}
                    </Button>
                </CardContent>
            </form>

            <CardFooter>
                <div className="text-center text-sm text-muted-foreground">
                    {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="underline hover:text-primary disabled:opacity-50"
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        disabled={isLoading}
                    >
                        {mode === 'login' ? 'Sign up' : 'Login'}
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
}
