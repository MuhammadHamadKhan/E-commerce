"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Input from "@/components/ui/Input";
import { useBakeryRegister } from "@/hooks/mutations/useBakeryRegister";
import type { RegisterBakeryInput } from "@/lib/api/bakeryAuth";

const INITIAL_FORM: RegisterBakeryInput = {
  owner_name: "",
  email: "",
  password: "",
  phone: "",
  bakery_name: "",
  address: "",
  city: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const register = useBakeryRegister();
  const [form, setForm] = useState(INITIAL_FORM);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.password !== confirmPassword) {
      setValidationError("Your passwords do not match.");
      return;
    }

    setValidationError(null);
    register.mutate(form, {
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
                d="M4 10h16v10H4zM3 10l2-6h14l2 6M8 10v10m8-10v10M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0"
              />
            </svg>
            Bakery partner
          </span>
          <h1 className="mt-6 font-display text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            Good food deserves another chance.
          </h1>
          <p className="mt-4 max-w-[24rem] text-body text-on-surface-variant">
            Join Last Bite to share your fresh surplus bakes with your
            community, reduce food waste, and bring in extra sales.
          </p>
        </div>

        <div className="mt-8 border-t border-outline-variant pt-6">
          <p className="text-label text-on-surface-variant">YOUR PARTNERSHIP</p>
          <ul className="mt-4 space-y-3 text-body-sm text-on-surface">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                1
              </span>
              Create your bakery profile
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                2
              </span>
              Add products and daily deals
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold">
                3
              </span>
              Welcome more local customers
            </li>
          </ul>
        </div>
      </aside>

      <div className="p-6 sm:p-9 md:p-10">
        <div>
          <p className="text-label text-on-surface-variant">GET STARTED</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">
            Register your bakery
          </h2>
          <p className="mt-2 text-body-sm text-on-surface-variant">
            Set up your owner and bakery details below.
          </p>
        </div>

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="owner_name">
                Owner name
              </label>
              <Input
                autoComplete="name"
                id="owner_name"
                name="owner_name"
                onChange={handleChange}
                placeholder="Your full name"
                required
                value={form.owner_name}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="bakery_name">
                Bakery name
              </label>
              <Input
                autoComplete="organization"
                id="bakery_name"
                name="bakery_name"
                onChange={handleChange}
                placeholder="Your bakery"
                required
                value={form.bakery_name}
              />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="phone">
                Phone number
              </label>
              <Input
                autoComplete="tel"
                id="phone"
                name="phone"
                onChange={handleChange}
                placeholder="Your contact number"
                required
                type="tel"
                value={form.phone}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="address">
              Bakery address
            </label>
            <Input
              autoComplete="street-address"
              id="address"
              name="address"
              onChange={handleChange}
              placeholder="Street address and area"
              required
              value={form.address}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="city">
                City
              </label>
              <Input
                autoComplete="address-level2"
                id="city"
                name="city"
                onChange={handleChange}
                placeholder="e.g. Peshawar"
                required
                value={form.city}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="password">
                Password
              </label>
              <Input
                autoComplete="new-password"
                id="password"
                minLength={8}
                name="password"
                onChange={handleChange}
                placeholder="At least 8 characters"
                required
                type="password"
                value={form.password}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="confirm-password">
              Confirm password
            </label>
            <Input
              autoComplete="new-password"
              id="confirm-password"
              minLength={8}
              onChange={(event) => setConfirmPassword(event.currentTarget.value)}
              placeholder="Enter your password again"
              required
              type="password"
              value={confirmPassword}
            />
          </div>

          {(validationError || register.error) && (
            <ErrorMessage
              message={validationError || register.error?.message || "Registration failed. Please try again."}
            />
          )}

          <Button className="w-full" loading={register.isPending} size="lg" type="submit">
            Create bakery account
          </Button>
          <p className="text-center text-body-sm text-on-surface-variant">
            Already have an account?{" "}
            <Link
              className="font-semibold text-on-surface underline underline-offset-4 hover:text-on-surface-variant"
              href="/bakery/login"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}
