"use client";
// CheckoutForm: guest checkout form (name, phone, email).
// - name required, phone required (Pakistani format: 03XX-XXXXXXX or +92...),
//   email optional but valid if provided.
// - clear error message under each field.
// - remembers the last used name and phone in localStorage.
import { useState, useEffect, useCallback } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const NAME_KEY = "lastbite_checkout_name";
const PHONE_KEY = "lastbite_checkout_phone";

// Pakistani mobile: 03XX-XXXXXXX (11 digits) or +92 3XX ... (12 digits with 923).
// We strip spaces/hyphens and accept a leading + or 92.
function normalizePhone(raw) {
  return String(raw ?? "").replace(/[^\d+]/g, "");
}

function isValidPhone(raw) {
  const p = normalizePhone(raw);
  // 03XXXXXXXXX (11 digits) or +923XXXXXXXXX / 923XXXXXXXXX (12 digits)
  return /^(\+?92|0)?3\d{9}$/.test(p);
}

function isValidEmail(raw) {
  const e = String(raw ?? "").trim();
  if (!e) return true; // optional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// Read a saved value from localStorage (client only - safe in the
// useState initializer because this component mounts in the browser).
function loadSaved(key) {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

export default function CheckoutForm({ onSubmit, loading, items }) {
  const [name, setName] = useState(() => loadSaved(NAME_KEY));
  const [phone, setPhone] = useState(() => loadSaved(PHONE_KEY));
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Remember the last used name + phone as the customer types.
  const saveToStorage = useCallback(() => {
    try {
      window.localStorage.setItem(NAME_KEY, name);
      window.localStorage.setItem(PHONE_KEY, phone);
    } catch {
      // ignore
    }
  }, [name, phone]);

  useEffect(() => {
    saveToStorage();
  }, [name, phone, saveToStorage]);

  const validate = useCallback(() => {
    const next = {};
    const n = String(name ?? "").trim();
    const p = String(phone ?? "").trim();
    const e = String(email ?? "").trim();

    if (!n) next.name = "Full name is required.";
    if (!p) next.phone = "Phone number is required.";
    else if (!isValidPhone(p)) next.phone = "Enter a valid Pakistani number (e.g. 03XX-XXXXXXX or +92...).";
    if (e && !isValidEmail(e)) next.email = "Enter a valid email address.";

    setErrors(next);
    return Object.keys(next).length === 0;
  }, [name, phone, email]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ name: true, phone: true, email: true });
    if (!validate()) return;
    saveToStorage();
    onSubmit({
      customer_name: String(name).trim(),
      customer_phone: normalizePhone(phone),
      customer_email: String(email).trim() || undefined,
      items: items.map((it) => ({
        listing_id: it.listing_id,
        quantity: it.quantity,
      })),
    });
  };

  const fieldError = (key) => (touched[key] && errors[key] ? errors[key] : null);

  return (
    <form onSubmit={handleSubmit} className="space-y-lg">
      <div className="space-y-sm">
        <label className="text-label uppercase tracking-wider text-on-surface-variant block">
          Full name
        </label>
        <Input
          id="checkout-name"
          placeholder="e.g. Aisha Khan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={Boolean(fieldError("name"))}
          aria-describedby={fieldError("name") ? "checkout-name-error" : undefined}
          className={fieldError("name") ? "border-error" : ""}
        />
        {fieldError("name") && (
          <p id="checkout-name-error" className="text-body-sm text-error mt-xs">
            {fieldError("name")}
          </p>
        )}
      </div>

      <div className="space-y-sm">
        <label className="text-label uppercase tracking-wider text-on-surface-variant block">
          Phone number
        </label>
        <Input
          id="checkout-phone"
          placeholder="03XX-XXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          aria-invalid={Boolean(fieldError("phone"))}
          aria-describedby={fieldError("phone") ? "checkout-phone-error" : undefined}
          className={fieldError("phone") ? "border-error" : ""}
        />
        {fieldError("phone") && (
          <p id="checkout-phone-error" className="text-body-sm text-error mt-xs">
            {fieldError("phone")}
          </p>
        )}
        <p className="text-body-sm text-on-surface-variant">
          We will SMS your pickup code to this number.
        </p>
      </div>

      <div className="space-y-sm">
        <label className="text-label uppercase tracking-wider text-on-surface-variant block">
          Email address (optional)
        </label>
        <Input
          id="checkout-email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, email: true }))}
          aria-invalid={Boolean(fieldError("email"))}
          aria-describedby={fieldError("email") ? "checkout-email-error" : undefined}
          className={fieldError("email") ? "border-error" : ""}
        />
        {fieldError("email") && (
          <p id="checkout-email-error" className="text-body-sm text-error mt-xs">
            {fieldError("email")}
          </p>
        )}
      </div>

      <Button
        type="submit"
        variant="primary"
        loading={loading}
        className="w-full min-h-[50px] text-lg"
        disabled={loading}
      >
        Place order &mdash; pay at the bakery
      </Button>
    </form>
  );
}
