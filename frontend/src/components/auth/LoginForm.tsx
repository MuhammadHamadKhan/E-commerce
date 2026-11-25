"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import Toast from "@/components/ui/Toast";
import { useBakeryLogin } from "@/hooks/mutations/useBakeryLogin";
import type { LoginBakeryInput } from "@/lib/api/bakeryAuth";

const INITIAL_FORM: LoginBakeryInput = {
  email: "",
  password: "",
};

export default function LoginForm() {
  const router = useRouter();
  const login = useBakeryLogin();
  const [form, setForm] = useState(INITIAL_FORM);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setForm((current) => ({ ...current, [name]: value }));
    setValidationError(null);
  }

  function togglePassword() {
    setShowPassword((prev) => !prev);
  }

  function showToast(message: string, type: "success" | "error" = "error") {
    setToast({ message, type });
  }

  function handleForgotPassword(event: React.MouseEvent) {
    event.preventDefault();
    showToast("Password reset is coming soon.", "error");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.email || !form.password) {
      setValidationError("Please enter your email and password.");
      return;
    }

    setValidationError(null);
    login.mutate(form, {
      onSuccess: () => router.replace("/bakery/dashboard"),
    });
  }

  return (
    <section className="mx-auto grid max-w-5xl overflow-hidden rounded-2xl border border-outline-variant bg-surface shadow-card lg:grid-cols-[0.85fr_1.15fr]">
      <aside className="flex flex-col justify-start bg-surface-container-low p-7 md:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-white px-3 py-1.5 text-label font-semibold text-on-surface-variant">
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 13l-3 3m0 0l-3 3m3 3h-4m4 4V9a6 6 0 1112 0v3m-6 3H9M3 10a6 6 0 1112 0v3H3z"
              />
            </svg>
            Welcome back
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Sign in to your bakery
          </h1>
          <p className="mt-4 max-w-[24rem] text-body text-on-surface-variant">
            Manage your products, publish daily surplus deals, and track
            customer pickup orders — all in one place.
          </p>
        </div>

        <div className="mt-8 border-t border-outline-variant pt-6">
          <p className="text-label text-on-surface-variant">YOUR BACKOFFICE</p>
          <ul className="mt-4 space-y-3 text-body-sm text-on-surface">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                1
              </span>
              Update products and prices
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                2
              </span>
              Publish your surplus deals daily
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                3
              </span>
              View orders and pickup codes
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-6 sm:p-9 md:p-10">
        <div>
          <p className="text-label text-on-surface-variant">SIGN IN</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Welcome back
          </h2>
          <p className="mt-2 text-body-sm text-on-surface-variant">
            Enter your bakery owner email and password below.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="email">
              Email address
            </label>
            <Input
              autoComplete="email"
              id="email"
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              required
              type="email"
              value={form.email}
            />
          </div>

          <div className="relative">
            <label className="mb-1.5 block text-label font-medium" htmlFor="password">
              Password
            </label>
            <Input
              autoComplete="current-password"
              className="pr-14"
              id="password"
              name="password"
              onChange={handleChange}
              placeholder="••••••••"
              required
              type={showPassword ? "text" : "password"}
              value={form.password}
            />
            <button
              type="button"
              onClick={togglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-0 flex items-center pr-3 pt-5 text-body-sm text-on-surface-variant transition-colors hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-body-sm text-on-surface cursor-pointer select-none">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border border-outline-variant text-secondary focus:ring-secondary"
              />
              Remember me
            </label>
            <Link
              href="#"
              onClick={handleForgotPassword}
              className="text-body-sm font-semibold text-secondary hover:text-on-surface transition-colors underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>

          {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}

          {(validationError || login.error) && (
            <ErrorMessage
              message={
                validationError ||
                login.error?.message ||
                "Login failed. Please try again."
              }
            />
          )}

          <Button className="w-full" loading={login.isPending} size="lg" type="submit">
            Sign in
          </Button>
          <p className="text-center text-body-sm text-on-surface-variant">
            Need a bakery account?{" "}
            <Link
              className="font-semibold text-on-surface underline underline-offset-4 hover:text-on-surface-variant"
              href="/bakery/register"
            >
              Create your bakery account
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
