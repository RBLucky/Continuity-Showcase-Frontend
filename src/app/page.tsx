// src/app/page.tsx

import { AuthForm } from "@/components/AuthForm";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <AuthForm />
    </main>
  );
}