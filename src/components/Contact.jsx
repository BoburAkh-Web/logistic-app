import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { CONTACT } from "../lib/data";
import { ArrowRight, ArrowUpRight, Check, Truck } from "./ui/icons";
import { EASE_OUT, FadeUp, Magnetic, MaskIcon, RevealWords } from "./ui/primitives";

const EMAILJS = {
  service: "service_25mq3kk",
  template: "template_aqvfzf6",
  publicKey: "QOKdEBO-H1pa7cSSd",
};

const CHANNELS = [
  { label: "Call us", value: CONTACT.phone, href: CONTACT.phoneHref, icon: "/images/tel-contact.svg" },
  { label: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, icon: "/images/mail_logo.svg" },
  { label: "Visit", value: CONTACT.address, href: CONTACT.mapHref, icon: "/images/adres-contact.svg", external: true },
  { label: "Hours", value: "Open 24/7, 365 days a year", icon: "/images/deadline-contact.svg" },
];

function Field({ name, label, type = "text", required = true, textarea = false }) {
  const Tag = textarea ? "textarea" : "input";
  return (
    <label className="group relative block">
      <Tag
        name={name}
        type={textarea ? undefined : type}
        required={required}
        rows={textarea ? 3 : undefined}
        placeholder=" "
        className="peer w-full resize-none border-b border-paper/20 bg-transparent pb-3 pt-7 text-lg text-paper outline-none transition-colors placeholder:text-transparent focus:border-transparent"
      />
      <span className="pointer-events-none absolute left-0 top-7 origin-left text-lg text-paper/50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:top-0 peer-focus:scale-[0.72] peer-focus:text-brand-400 peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:scale-[0.72]">
        {label}
        {required && <span className="text-brand-400"> *</span>}
      </span>
      <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-brand-400 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] peer-focus:scale-x-100" />
    </label>
  );
}

function SubmitButton({ status }) {
  const label = {
    idle: "Send request",
    sending: "On the road…",
    sent: "Delivered — talk soon",
    error: "Something broke — retry",
  }[status];

  return (
    <button
      type="submit"
      disabled={status === "sending"}
      data-cursor={status === "idle" ? "Send" : undefined}
      className={`group relative flex h-16 w-full items-center justify-between overflow-hidden rounded-full pl-7 pr-2 text-left font-medium text-white transition-colors duration-500 ${
        status === "sent" ? "bg-emerald-600" : status === "error" ? "bg-red-600" : "bg-brand hover:bg-brand-600"
      }`}
    >
      {status === "sending" && (
        <span aria-hidden className="absolute inset-0">
          <motion.span
            className="absolute bottom-3 text-white/90"
            initial={{ left: "-15%" }}
            animate={{ left: "105%" }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Truck className="h-4 w-7" />
          </motion.span>
          <span className="absolute inset-x-6 bottom-2.5 border-t border-dashed border-white/30" />
        </span>
      )}
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={status}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE_OUT }}
          className="relative"
          aria-live="polite"
        >
          {label}
        </motion.span>
      </AnimatePresence>
      <span className="relative grid size-12 place-items-center rounded-full bg-white text-brand transition-transform duration-500 group-hover:rotate-[-45deg]">
        {status === "sent" ? <Check className="size-5 text-emerald-600" /> : <ArrowRight className="size-5" />}
      </span>
    </button>
  );
}

export default function Contact() {
  const form = useRef(null);
  const panel = useRef(null);
  const [status, setStatus] = useState("idle");

  const gx = useMotionValue(-400);
  const gy = useMotionValue(-400);
  const glowX = useSpring(gx, { stiffness: 60, damping: 20 });
  const glowY = useSpring(gy, { stiffness: 60, damping: 20 });

  const onMove = (e) => {
    const r = panel.current.getBoundingClientRect();
    gx.set(e.clientX - r.left - 300);
    gy.set(e.clientY - r.top - 300);
  };

  const send = async (e) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await emailjs.sendForm(EMAILJS.service, EMAILJS.template, form.current, {
        publicKey: EMAILJS.publicKey,
      });
      setStatus("sent");
      form.current.reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section id="contact" className="px-2 py-10 md:px-5">
      <div
        ref={panel}
        onPointerMove={onMove}
        className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-5 py-20 text-paper md:rounded-[2.75rem] md:px-12 md:py-28 lg:px-20"
      >
        <motion.div
          aria-hidden
          style={{ x: glowX, y: glowY }}
          className="pointer-events-none absolute left-0 top-0 -z-10 size-[600px] rounded-full bg-[radial-gradient(closest-side,rgb(0_87_255/0.45),transparent)] will-change-transform"
        />
        <div aria-hidden className="grid-bg absolute inset-0 -z-10 opacity-40 [--line:rgb(248_247_244/0.06)] [mask-image:radial-gradient(ellipse_at_top_left,#000,transparent_70%)]" />

        <div className="mx-auto grid max-w-[1300px] gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <div>
            <span className="eyebrow !text-paper/60">(05) Contact</span>
            <h2 className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-semibold leading-[0.9] tracking-[-0.045em]">
              <RevealWords text="Let’s move something great." highlight={[3]} />
            </h2>
            <p className="mt-6 max-w-md text-paper/60">
              Tell us what needs to move and where. A real dispatcher answers within
              minutes, day or night.
            </p>

            <ul className="mt-12 border-t border-paper/10">
              {CHANNELS.map((c, i) => {
                const Tag = c.href ? "a" : "div";
                return (
                  <FadeUp key={c.label} as="li" delay={i * 0.08} y={20} className="border-b border-paper/10">
                    <Tag
                      {...(c.href ? { href: c.href } : {})}
                      {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="group flex items-center gap-5 py-5"
                    >
                      <span className="grid size-12 shrink-0 place-items-center rounded-full border border-paper/15 transition-colors duration-500 group-hover:border-brand group-hover:bg-brand">
                        <MaskIcon src={c.icon} className="size-5 text-paper" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-paper/45">
                          {c.label}
                        </span>
                        <span className="mt-1 block truncate text-lg transition-transform duration-500 group-hover:translate-x-1 md:text-xl">
                          {c.value}
                        </span>
                      </span>
                      {c.href && (
                        <ArrowUpRight className="size-5 shrink-0 text-paper/40 transition-all duration-500 group-hover:rotate-45 group-hover:text-paper" />
                      )}
                    </Tag>
                  </FadeUp>
                );
              })}
            </ul>
          </div>

          <FadeUp delay={0.15} className="self-center">
            <form
              ref={form}
              onSubmit={send}
              className="rounded-[1.75rem] border border-paper/10 bg-paper/[0.06] p-6 md:p-10"
            >
              <p className="font-display text-2xl font-semibold tracking-tight">Request a quote</p>
              <p className="mt-1 text-sm text-paper/50">We reply fast. Usually in minutes.</p>
              <div className="mt-8 space-y-6">
                <Field name="user_name" label="Full name" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field name="user_number" label="Phone" type="tel" />
                  <Field name="user_email" label="Email" type="email" />
                </div>
                <Field name="message" label="What are we moving?" textarea required={false} />
              </div>
              <div className="mt-10">
                <Magnetic strength={0.12} className="w-full">
                  <SubmitButton status={status} />
                </Magnetic>
              </div>
            </form>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
