"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors, type UseFormRegisterReturn } from "react-hook-form";
import { Arrow, buttonClasses } from "@/components/ui/button";
import { EVENT_TYPES, isEventTypeId } from "@/config/event-types";
import { cn } from "@/lib/utils";
import {
  createEnquiryFormSchema,
  localIsoDate,
  type Enquiry,
  type EnquiryInput,
} from "@/schemas/enquiry";
import { prepareEnquiryHandoff, type EnquiryHandoff } from "@/services/enquiry-handoff";
import { EnquiryReview } from "./enquiry-review";

interface FieldProps {
  id: keyof EnquiryInput;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  render: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    "aria-required": boolean | undefined;
    className: string;
  }) => React.ReactNode;
}

function Field({ id, label, hint, error, required, className, render }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold">
        {label}
        {!required && <span className="ml-2 font-normal text-stone-600">Optional</span>}
      </label>
      {render({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
        "aria-required": required || undefined,
        className: "field-control",
      })}
      {hint && (
        <p id={hintId} className="mt-2 text-[0.8125rem] leading-snug text-stone-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-sm font-medium text-alert-700">
          {error}
        </p>
      )}
    </div>
  );
}

const fieldLabels: Partial<Record<keyof EnquiryInput, string>> = {
  name: "Name",
  phone: "Phone number",
  eventType: "Type of event",
  preferredDate: "Preferred date",
  guestCount: "Expected guests",
  message: "Your message",
};

function ErrorSummary({ errors }: { errors: FieldErrors<EnquiryInput> }) {
  const items = (Object.keys(fieldLabels) as (keyof EnquiryInput)[]).filter((key) => errors[key]);
  if (items.length === 0) return null;
  return (
    <div role="alert" className="border-l-2 border-alert-700 bg-ivory-100 p-4 text-sm">
      <p className="font-semibold text-alert-700">Please check {items.length === 1 ? "this field" : "these fields"}:</p>
      <ul className="mt-2 space-y-1">
        {items.map((key) => (
          <li key={key}>
            <a href={`#${key}`} className="underline underline-offset-2">
              {fieldLabels[key]}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function StepIndicator({ step }: { step: 1 | 2 }) {
  const steps = ["Your details", "Review", "Send in WhatsApp"];
  return (
    <ol className="mb-10 flex items-center gap-3 text-[0.8125rem] text-stone-600">
      {steps.map((label, index) => {
        const current = index + 1 === step;
        return (
          <li key={label} className="flex items-center gap-3">
            {index > 0 && <span aria-hidden="true" className="h-px w-5 bg-current opacity-50" />}
            <span
              aria-current={current ? "step" : undefined}
              className={cn(current && "font-semibold text-forest-900")}
            >
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

interface EnquiryFormProps {
  whatsappNumber: string | null;
  /** Injected in tests, so date rules don't change as time passes. */
  now?: Date;
}

export function EnquiryForm({ whatsappNumber, now }: EnquiryFormProps) {
  const searchParams = useSearchParams();
  const requestedEvent = searchParams.get("event");

  const [today] = useState(() => localIsoDate(now ?? new Date()));
  const schema = useMemo(() => createEnquiryFormSchema(today), [today]);

  const [review, setReview] = useState<{ enquiry: Enquiry; handoff: EnquiryHandoff } | null>(null);
  const formTop = useRef<HTMLHeadingElement>(null);
  const shouldFocusForm = useRef(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitted },
  } = useForm<EnquiryInput, unknown, Enquiry>({
    resolver: zodResolver(schema),
    shouldFocusError: true,
    defaultValues: {
      name: "",
      phone: "",
      // Unknown values from the URL are ignored rather than trusted.
      eventType: (isEventTypeId(requestedEvent) ? requestedEvent : "") as EnquiryInput["eventType"],
      preferredDate: "",
      guestCount: "",
      message: "",
    },
  });

  useEffect(() => {
    if (!review && shouldFocusForm.current) {
      shouldFocusForm.current = false;
      formTop.current?.focus();
    }
  }, [review]);

  const onValid = (enquiry: Enquiry) => {
    const handoff = prepareEnquiryHandoff(enquiry, whatsappNumber);
    if (!handoff.ok && handoff.reason === "message-too-long") {
      setError("message", {
        message: "Your details are too long to send through WhatsApp. Please shorten your message.",
      });
      return;
    }
    setReview({ enquiry, handoff });
  };

  if (review) {
    return (
      <div key="review" className="step-in">
        <StepIndicator step={2} />
        <EnquiryReview
          enquiry={review.enquiry}
          handoff={review.handoff}
          onEdit={() => {
            shouldFocusForm.current = true;
            setReview(null);
          }}
        />
      </div>
    );
  }

  const control = (registration: UseFormRegisterReturn) => registration;

  return (
    <div key="details" className="step-in">
      <StepIndicator step={1} />
      <h2 ref={formTop} tabIndex={-1} className="type-statement mb-10 outline-none">
        Tell us about <em>your event</em>
      </h2>

      <form noValidate onSubmit={handleSubmit(onValid)} className="grid gap-8 md:grid-cols-2">
        {isSubmitted && (
          <div className="md:col-span-2">
            <ErrorSummary errors={errors} />
          </div>
        )}

        <Field
          id="name"
          label="Name"
          required
          error={errors.name?.message}
          render={(props) => (
            <input {...props} {...control(register("name"))} type="text" autoComplete="name" />
          )}
        />

        <Field
          id="phone"
          label="Phone number"
          required
          hint="Include your country code if you are outside India."
          error={errors.phone?.message}
          render={(props) => (
            <input
              {...props}
              {...control(register("phone"))}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
            />
          )}
        />

        <Field
          id="eventType"
          label="Type of event"
          required
          className="md:col-span-2"
          error={errors.eventType?.message}
          render={(props) => (
            <select {...props} {...control(register("eventType"))}>
              <option value="">Choose one</option>
              {EVENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.label}
                </option>
              ))}
            </select>
          )}
        />

        <Field
          id="preferredDate"
          label="Preferred date"
          required
          hint="This doesn't reserve the date."
          error={errors.preferredDate?.message}
          render={(props) => (
            <input {...props} {...control(register("preferredDate"))} type="date" min={today} />
          )}
        />

        <Field
          id="guestCount"
          label="Expected guests"
          required
          hint="An estimate is fine."
          error={errors.guestCount?.message}
          render={(props) => (
            <input
              {...props}
              {...control(register("guestCount"))}
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
            />
          )}
        />

        <Field
          id="message"
          label="Your message"
          hint="Up to 300 characters, in any language."
          className="md:col-span-2"
          error={errors.message?.message}
          render={(props) => (
            <textarea
              {...props}
              {...control(register("message"))}
              rows={3}
              className={cn(props.className, "resize-y")}
            />
          )}
        />

        <div className="md:col-span-2">
          <button type="submit" className={buttonClasses("forest", "w-full md:w-auto")}>
            <span>Review my enquiry</span>
            <Arrow />
          </button>
          <p className="mt-4 max-w-[58ch] text-[0.8125rem] leading-relaxed text-stone-600">
            Nothing is sent until you choose to. Next you can check your details and continue to
            WhatsApp, where you press Send yourself.
          </p>
        </div>
      </form>
    </div>
  );
}
