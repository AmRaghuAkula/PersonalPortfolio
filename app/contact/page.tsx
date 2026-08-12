"use client";

import { useState, type FormEvent } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "submitted">(
    "idle",
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    // TODO: wire to API Gateway -> Lambda (lead-intake) -> DynamoDB.
    // Backend not yet provisioned — see BUILD_GUIDELINES.md before adding it.
    setTimeout(() => setStatus("submitted"), 400);
  }

  if (status === "submitted") {
    return (
      <div className="mx-auto flex max-w-3xl flex-1 flex-col gap-4 px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Thanks!</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Your message was received. (Placeholder confirmation — no data is
          persisted yet.)
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
      </form>
    </div>
  );
}
