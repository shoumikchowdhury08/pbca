"use client";
import { Mail, MapPin, Send } from "lucide-react";
import { useState, FormEvent } from "react";

function Contact() {
  const [sent, setSent] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSent(true);
  }
  return (
    <section className="contact section-wrap" id="contact">
      <div className="contact-copy">
        <p className="eyebrow">03 / SAY HELLO</p>
        <h2>
          Come as you are.
          <br />
          <i>Stay a little longer.</i>
        </h2>
        <p>
          Have a question, an idea, or simply want to say hello? We would love
          to hear from you.
        </p>
        <div className="contact-detail">
          <Mail size={18} />
          <span>hello@pbca.org</span>
        </div>
        <div className="contact-detail">
          <MapPin size={18} />
          <span>Mumbai, Maharashtra</span>
        </div>
      </div>
      <form onSubmit={submit} className="contact-form">
        {sent ? (
          <div className="success">
            <div>✓</div>
            <h3>Thank you for reaching out.</h3>
            <p>We will be in touch soon.</p>
            <button
              type="button"
              className="text-link"
              onClick={() => setSent(false)}
            >
              Send another message
            </button>
          </div>
        ) : (
          <>
            <label>
              Name
              <input name="name" required placeholder="Your name" />
            </label>
            <label>
              Email
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
                placeholder="Tell us what is on your mind..."
                rows={5}
              />
            </label>
            <button className="submit-button" type="submit">
              Send message <Send size={16} />
            </button>
          </>
        )}
      </form>
    </section>
  );
}

export default Contact;
