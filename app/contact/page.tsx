"use client";

import { useState, type FormEvent } from "react";

const CONTACT_API_URL = process.env.NEXT_PUBLIC_CONTACT_API_URL;

export default function ContactPage() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "submitted" | "error"
  >("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      if (!CONTACT_API_URL) {
        throw new Error("Contact API URL is not configured");
      }
      const res = await fetch(`${CONTACT_API_URL}contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }

  if (status === "submitted") {
    return (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Thanks!</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Your message was received. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
      <form onSubmit={handleSubmit} className="flex max-w-md flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Name
          <input
            name="name"
            type="text"
            required
            maxLength={200}
            className="rounded border border-black/[.15] px-3 py-2 dark:border-white/[.2] dark:bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={320}
            className="rounded border border-black/[.15] px-3 py-2 dark:border-white/[.2] dark:bg-transparent"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Message
          <textarea
            name="message"
            required
            maxLength={2000}
            rows={5}
            className="rounded border border-black/[.15] px-3 py-2 dark:border-white/[.2] dark:bg-transparent"
          />
        </label>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-foreground px-5 py-3 text-background transition-colors hover:bg-[#383838] disabled:opacity-50 dark:hover:bg-[#ccc]"
        >
          {status === "submitting" ? "Sending…" : "Send"}
        </button>
        {status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400">
            Something went wrong sending your message. Please try again.
          </p>
        )}
      </form>
    </div>
  );
}
