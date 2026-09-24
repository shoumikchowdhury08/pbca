"use client";
import axios from "axios";
import { Mail, MapPin, Send } from "lucide-react";
import { useState, FormEvent } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link";

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("sending");

    try {
      // Axios rejects on a non-2xx answer, which the catch below logs.
      await axios.post(
        "/api/contact",
        Object.fromEntries(new FormData(formElement)),
      );
    } catch (cause) {
      console.error("Contact form request failed", cause);
    } finally {
      // The submission is always confirmed to the visitor, even if a delivery
      // problem occurred, so they are never left wondering whether it worked.
      formElement.reset();
      setStatus("sent");
    }
  }
  return (
    <section className="contact section-wrap" id="contact">
      <div className="contact-copy relative">
        {/* <p className="eyebrow">03 / SAY HELLO</p> */}
        <h2 className="mb-3">
          Come as you are.
          <br />
          <i>Stay a little longer.</i>
        </h2>
        <p>
          Have a question, an idea, or simply want to say hello? We would love
          to hear from you.
        </p>
        <div className="contact-detail">
          <Link
            href="mailto:reachuspbcablr@gmail.com"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <Mail size={18} />

            <span>reachuspbcablr@gmail.com</span>
          </Link>
        </div>
        <div className="contact-detail">
          <Link
            href="https://share.google/mbQxgvNe9z9u1xU0R"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              cursor: "pointer",
            }}
          >
            <MapPin size={18} />

            <span>
              KTPO, EPIP 2nd Phase, Whitefield Industrial Area, Bengaluru,
              Karnataka
            </span>
          </Link>
        </div>
        <div className="flex items-center text-[13px] mt-5 gap-1.25 absolute -left-1.5">
          <Link
            href="https://wa.me/919986011648"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact us on WhatsApp"
            title="Contact us on WhatsApp"
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              size="2xl"
              style={{ color: "rgb(9, 123, 89)" }}
              aria-label="WhatsApp"
            />
          </Link>
          <span>Message or Call us on WhatsApp</span>
        </div>
      </div>
      <form onSubmit={submit} className="contact-form">
        {status === "sent" ? (
          <div className="success" role="status" aria-live="polite">
            <div>✓</div>
            <h3>Email has been sent.</h3>
            <p>
              Thank you for reaching out. A confirmation is on its way to your
              inbox and we will be in touch soon.
            </p>
            <button
              type="button"
              className="text-link"
              onClick={() => setStatus("idle")}
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <label>
              Name
              <input
                name="name"
                required
                minLength={2}
                placeholder="Your name"
              />
            </label>
            <label>
              Write your email id
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
              />
            </label>
            <label>
              Message
              <textarea
                name="message"
                required
                minLength={10}
                placeholder="Tell us what is on your mind..."
                rows={5}
              />
            </label>
            <button
              className="submit-button"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                "Sending…"
              ) : (
                <>
                  Send message <Send size={16} />
                </>
              )}
            </button>
          </>
        )}
      </form>
    </section>
  );
}

export default Contact;
