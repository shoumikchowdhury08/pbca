"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GalleryDto, GalleryImageDto } from "@/types/types";
import { GALLERY_PAGE_LABELS } from "@/types/types";
import type { PartnerDto } from "@/types/types";
import type { LandingImageDto } from "@/types/types";
import type { EventsBentoHomeDto } from "@/types/types";
import type { TestimonialDto } from "@/types/types";
import type { HomeCountdownDto } from "@/types/types";
import {
  ALLOWED_IMAGE_ACCEPT,
  formatFileSize,
  INVALID_IMAGE_MESSAGE,
  MAX_IMAGE_FILE_SIZE,
  MAX_IMAGE_FILE_SIZE_LABEL,
} from "@/lib/uploads";

/**
 * Fails fast on oversized files so admins get an immediate message instead of
 * uploading tens of megabytes just to be rejected by the API route.
 */
function assertUploadSize(form: FormData) {
  const file = form.get("file");
  if (file instanceof File && file.size > MAX_IMAGE_FILE_SIZE) {
    throw new Error(
      `“${file.name}” is ${formatFileSize(file.size)}. ${INVALID_IMAGE_MESSAGE}`,
    );
  }
}

function toDatetimeLocalValue(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatCountdownTarget(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "full",
    timeStyle: "short",
  });
}

function partnerImageUrl(storageKey: string) {
  return `/api/r2/${storageKey.split("/").map(encodeURIComponent).join("/")}`;
}
const emptyImage = {
  title: "",
  description: "",
  altText: "",
  layoutVariant: "standard",
};

type ImageForm = typeof emptyImage;

async function readJson<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok)
    throw new Error(body.error?.message ?? "Something went wrong.");
  return body.data as T;
}

export default function AdminPage() {
  const [galleries, setGalleries] = useState<GalleryDto[]>([]);
  const [partners, setPartners] = useState<PartnerDto[]>([]);
  const [events, setEvents] = useState<EventsBentoHomeDto[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialDto[]>([]);
  const [countdown, setCountdown] = useState<HomeCountdownDto | null>(null);
  const [countdownTarget, setCountdownTarget] = useState("");
  const [landingImages, setLandingImages] = useState<
    Record<string, LandingImageDto | null>
  >({});
  const [selectedGalleryId, setSelectedGalleryId] = useState("");
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageForm, setImageForm] = useState<ImageForm>(emptyImage);
  const [landingAltText, setLandingAltText] = useState("");
  const [login, setLogin] = useState({ email: "", password: "" });
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedGallery = galleries.find(
    (gallery) => gallery.id === selectedGalleryId,
  );
  const landingImage = selectedGallery
    ? (landingImages[selectedGallery.pageSlug] ?? null)
    : null;

  async function loadAdmin() {
    try {
      const me = await readJson<{ name: string }>(
        await fetch("/api/admin/auth/me"),
      );
      const data = await readJson<GalleryDto[]>(
        await fetch("/api/admin/galleries"),
      );
      const partnerData = await readJson<PartnerDto[]>(
        await fetch("/api/admin/partners"),
      );
      const eventData = await readJson<EventsBentoHomeDto[]>(
        await fetch("/api/admin/events-bento-home"),
      );
      const testimonialData = await readJson<TestimonialDto[]>(
        await fetch("/api/admin/testimonials"),
      );
      const countdownData = await readJson<HomeCountdownDto | null>(
        await fetch("/api/admin/countdown"),
      );
      setUser(me);
      setGalleries(data);
      setPartners(partnerData);
      setEvents(eventData);
      setTestimonials(testimonialData);
      setCountdown(countdownData);
      setCountdownTarget(
        countdownData ? toDatetimeLocalValue(countdownData.targetAt) : "",
      );
      const initialGallery =
        data.find((gallery) => gallery.id === selectedGalleryId) ?? data[0];
      setSelectedGalleryId((current) => current || initialGallery?.id || "");
      if (initialGallery) void loadLandingImage(initialGallery.pageSlug);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void loadAdmin(), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function loadLandingImage(pageSlug: string) {
    try {
      const image = await readJson<LandingImageDto | null>(
        await fetch(`/api/admin/landing/${pageSlug}`),
      );
      setLandingImages((current) => ({ ...current, [pageSlug]: image }));
      setLandingAltText(image?.altText ?? "");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to load landing image.",
      );
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const signedIn = await readJson<{ name: string }>(
        await fetch("/api/admin/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(login),
        }),
      );
      setUser(signedIn);
      await loadAdmin();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in.");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    setUser(null);
    setGalleries([]);
    setPartners([]);
    setEvents([]);
    setTestimonials([]);
    setCountdown(null);
    setCountdownTarget("");
    setLandingImages({});
  }

  async function saveCountdown(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const saved = await readJson<HomeCountdownDto>(
        await fetch("/api/admin/countdown", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetAt: new Date(countdownTarget).toISOString(),
          }),
        }),
      );
      setCountdown(saved);
      setCountdownTarget(toDatetimeLocalValue(saved.targetAt));
      setMessage("Homepage countdown date and time saved.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to save countdown date and time.",
      );
    }
  }

  async function uploadPartner(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    const form = new FormData(formElement);

    try {
      assertUploadSize(form);
      const partner = await readJson<PartnerDto>(
        await fetch("/api/admin/partners", {
          method: "POST",
          body: form,
        }),
      );
      setPartners((current) => [...current, partner]);
      setMessage("Partner logo uploaded to R2 and saved.");
      formElement.reset();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to upload partner logo.",
      );
    }
  }

  async function removePartner(partner: PartnerDto) {
    if (!window.confirm(`Remove ${partner.name} from the partner gallery?`)) {
      return;
    }

    setError("");
    try {
      await readJson<{ success: true }>(
        await fetch(`/api/admin/partners/${partner.id}`, {
          method: "DELETE",
        }),
      );
      setPartners((current) =>
        current.filter((item) => item.id !== partner.id),
      );
      setMessage("Partner logo removed from R2 and the database.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove partner logo.",
      );
    }
  }

  async function uploadEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      assertUploadSize(form);
      const item = await readJson<EventsBentoHomeDto>(
        await fetch("/api/admin/events-bento-home", {
          method: "POST",
          body: form,
        }),
      );
      setEvents((current) => [...current, item]);
      setMessage("Event image uploaded to R2 and saved.");
      formElement.reset();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to upload event image.",
      );
    }
  }

  async function removeEvent(item: EventsBentoHomeDto) {
    if (!window.confirm(`Remove ${item.title} from the events gallery?`))
      return;
    setError("");
    try {
      await readJson<{ success: true }>(
        await fetch(`/api/admin/events-bento-home/${item.id}`, {
          method: "DELETE",
        }),
      );
      setEvents((current) => current.filter((event) => event.id !== item.id));
      setMessage("Event image removed from R2 and the database.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove event image.",
      );
    }
  }

  async function uploadTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formElement = event.currentTarget;

    try {
      const testimonial = await readJson<TestimonialDto>(
        await fetch("/api/admin/testimonials", {
          method: "POST",
          body: new FormData(formElement),
        }),
      );
      setTestimonials((current) => [...current, testimonial]);
      setMessage("Testimonial saved.");
      formElement.reset();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save testimonial.",
      );
    }
  }

  async function removeTestimonial(testimonial: TestimonialDto) {
    if (!window.confirm(`Remove the testimonial from ${testimonial.name}?`)) {
      return;
    }

    setError("");
    try {
      await readJson<{ success: true }>(
        await fetch(`/api/admin/testimonials/${testimonial.id}`, {
          method: "DELETE",
        }),
      );
      setTestimonials((current) =>
        current.filter((item) => item.id !== testimonial.id),
      );
      setMessage("Testimonial removed.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove testimonial.",
      );
    }
  }

  async function uploadLandingImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const pageSlug = selectedGallery?.pageSlug;
    if (!pageSlug) return;
    const formElement = event.currentTarget;
    try {
      const form = new FormData(formElement);
      assertUploadSize(form);
      const image = await readJson<LandingImageDto>(
        await fetch(`/api/admin/landing/${pageSlug}`, {
          method: "PUT",
          body: form,
        }),
      );
      setLandingImages((current) => ({ ...current, [pageSlug]: image }));
      setMessage("Landing image uploaded and replaced.");
      setLandingAltText("");
      formElement.reset();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to upload landing image.",
      );
    }
  }

  async function removeLandingImage() {
    if (!window.confirm("Remove this page's landing image?")) return;
    setError("");
    const pageSlug = selectedGallery?.pageSlug;
    if (!pageSlug) return;
    try {
      await readJson<{ success: true }>(
        await fetch(`/api/admin/landing/${pageSlug}`, { method: "DELETE" }),
      );
      setLandingImages((current) => ({ ...current, [pageSlug]: null }));
      setMessage("Landing image removed from R2 and the database.");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove landing image.",
      );
    }
  }

  async function saveImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGalleryId) return;
    setError("");
    try {
      const url = editingImageId
        ? `/api/admin/images/${editingImageId}`
        : `/api/admin/galleries/${selectedGalleryId}/images`;
      const form = new FormData(event.currentTarget);
      assertUploadSize(form);
      const data = await readJson<GalleryImageDto>(
        await fetch(url, {
          method: editingImageId ? "PATCH" : "POST",
          body: form,
        }),
      );
      setMessage(
        editingImageId
          ? "Image details updated."
          : "Image added to the gallery.",
      );
      setImageForm(emptyImage);
      setEditingImageId(null);
      setGalleries((current) =>
        current.map((gallery) =>
          gallery.id === selectedGalleryId
            ? {
                ...gallery,
                images: editingImageId
                  ? gallery.images.map((image) =>
                      image.id === data.id ? data : image,
                    )
                  : [...gallery.images, data],
              }
            : gallery,
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to save image.",
      );
    }
  }

  async function removeImage(image: GalleryImageDto) {
    if (!window.confirm(`Remove “${image.title}” from this gallery?`)) return;
    try {
      await readJson<{ success: true }>(
        await fetch(`/api/admin/images/${image.id}`, { method: "DELETE" }),
      );
      setGalleries((current) =>
        current.map((gallery) =>
          gallery.id === selectedGalleryId
            ? {
                ...gallery,
                images: gallery.images.filter((item) => item.id !== image.id),
              }
            : gallery,
        ),
      );
      setMessage("Image removed.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to remove image.",
      );
    }
  }

  function editImage(image: GalleryImageDto) {
    setEditingImageId(image.id);
    setImageForm({
      title: image.title,
      description: image.description,
      altText: image.altText,
      layoutVariant: image.layoutVariant,
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  if (loading)
    return (
      <main className="admin-page">
        <p>Loading admin portal...</p>
      </main>
    );

  if (!user) {
    return (
      <main className="admin-page admin-login-page">
        <section className="admin-panel admin-login-panel">
          <p className="eyebrow">PBCA CONTENT DESK</p>
          <h1>Welcome back.</h1>
          <p>
            Sign in to manage the images and stories shown across the PBCA
            website.
          </p>
          <form onSubmit={handleLogin} className="admin-form">
            <label>
              Email
              <input
                type="email"
                value={login.email}
                onChange={(event) =>
                  setLogin({ ...login, email: event.target.value })
                }
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={login.password}
                onChange={(event) =>
                  setLogin({ ...login, password: event.target.value })
                }
                required
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button className="admin-primary-button" type="submit">
              Sign in
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <p className="eyebrow">PBCA CONTENT DESK</p>
          <h1>Gallery manager</h1>
        </div>
        <div className="admin-header-actions">
          <span>Signed in as {user.name}</span>
          <button className="admin-secondary-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>
      <section className="admin-toolbar">
        <label>
          Choose a page
          <select
            value={selectedGalleryId}
            onChange={(event) => {
              setSelectedGalleryId(event.target.value);
              setEditingImageId(null);
              setImageForm(emptyImage);
              setLandingAltText("");
              const page = galleries.find(
                (item) => item.id === event.target.value,
              );
              if (page) void loadLandingImage(page.pageSlug);
            }}
          >
            {galleries.map((gallery) => (
              <option key={gallery.id} value={gallery.id}>
                {GALLERY_PAGE_LABELS[gallery.pageSlug]}
              </option>
            ))}
          </select>
        </label>
        {selectedGallery && <p>{selectedGallery.description}</p>}
      </section>
      {error && <p className="admin-error">{error}</p>}
      {message && <p className="admin-success">{message}</p>}
      {selectedGallery && (
        <section className="admin-content-grid">
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">LANDING IMAGE</p>
                <h2>{selectedGallery.pageSlug} landing image</h2>
              </div>
            </div>
            {landingImage ? (
              <article className="admin-image-row">
                <img src={landingImage.imageUrl} alt={landingImage.altText} />
                <div>
                  <h3>Current landing image</h3>
                  <p>{landingImage.storageKey}</p>
                  <small>{landingImage.mimeType ?? "Image"}</small>
                </div>
                <div className="admin-row-actions">
                  <button onClick={() => void removeLandingImage()}>
                    Delete
                  </button>
                </div>
              </article>
            ) : (
              <p className="admin-empty">No landing image uploaded.</p>
            )}
          </div>
          <form
            className="admin-panel admin-form"
            onSubmit={uploadLandingImage}
          >
            <p className="eyebrow">
              {selectedGallery.pageSlug.toUpperCase()} PAGE
            </p>
            <h2>
              {landingImage ? "Replace landing image" : "Add landing image"}
            </h2>
            <label>
              Accessibility text
              <input
                name="altText"
                value={landingAltText}
                onChange={(event) => setLandingAltText(event.target.value)}
                required
              />
            </label>
            <label>
              Landing image (up to {MAX_IMAGE_FILE_SIZE_LABEL})
              <input
                name="file"
                type="file"
                accept={ALLOWED_IMAGE_ACCEPT}
                required
              />
            </label>
            <button className="admin-primary-button" type="submit">
              {landingImage ? "Replace image" : "Upload image"}
            </button>
          </form>
        </section>
      )}
      {selectedGallery?.pageSlug === "home" && (
        <>
          <section className="admin-content-grid">
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">HOME PAGE</p>
                  <h2>Countdown</h2>
                </div>
              </div>
              {countdown ? (
                <div>
                  <h3>Current target</h3>
                  <p>{formatCountdownTarget(countdown.targetAt)}</p>
                  <small>Shown on the homepage countdown timer</small>
                </div>
              ) : (
                <p className="admin-empty">
                  No countdown date has been set yet.
                </p>
              )}
            </div>
            <form className="admin-panel admin-form" onSubmit={saveCountdown}>
              <p className="eyebrow">COUNTDOWN TIMER</p>
              <h2>
                {countdown ? "Update date and time" : "Set date and time"}
              </h2>
              <label>
                Target date and time
                <input
                  type="datetime-local"
                  value={countdownTarget}
                  onChange={(event) => setCountdownTarget(event.target.value)}
                  required
                />
              </label>
              <button className="admin-primary-button" type="submit">
                Save countdown
              </button>
            </form>
          </section>
          <section className="admin-content-grid">
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">{partners.length} LOGOS</p>
                  <h2>Partner logos</h2>
                </div>
              </div>
              <div className="admin-image-list">
                {partners.map((partner) => (
                  <article className="admin-image-row" key={partner.id}>
                    <img
                      src={partnerImageUrl(partner.image.storageKey)}
                      alt={partner.image.altText}
                    />
                    <div>
                      <h3>{partner.name}</h3>
                      <p>{partner.image.storageKey}</p>
                      <small>
                        {partner.published
                          ? "Visible on website"
                          : "Hidden from website"}
                      </small>
                    </div>
                    <div className="admin-row-actions">
                      <button onClick={() => void removePartner(partner)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
                {!partners.length && (
                  <p className="admin-empty">No partner logos uploaded yet.</p>
                )}
              </div>
            </div>
            <form className="admin-panel admin-form" onSubmit={uploadPartner}>
              <p className="eyebrow">SPONSORSHIP GALLERY</p>
              <h2>Upload partner logo</h2>
              <label>
                Partner name
                <input name="name" required maxLength={160} />
              </label>
              <label>
                Website URL
                <input name="websiteUrl" type="url" placeholder="https://..." />
              </label>
              <label>
                Accessibility text
                <input name="altText" required maxLength={250} />
              </label>
              <label>
                Logo file (up to {MAX_IMAGE_FILE_SIZE_LABEL})
                <input
                  name="file"
                  type="file"
                  accept={ALLOWED_IMAGE_ACCEPT}
                  required
                />
              </label>
              <button className="admin-primary-button" type="submit">
                Upload logo
              </button>
            </form>
          </section>
          <section className="admin-content-grid">
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">{events.length} EVENTS</p>
                  <h2>Events gallery</h2>
                </div>
              </div>
              <div className="admin-image-list">
                {events.map((item) => (
                  <article className="admin-image-row" key={item.id}>
                    <img src={item.image.imageUrl} alt={item.image.altText} />
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.detail || item.image.storageKey}</p>
                      <small>
                        {item.featured ? "Featured event" : "Supporting event"}
                      </small>
                    </div>
                    <div className="admin-row-actions">
                      <button onClick={() => void removeEvent(item)}>
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
                {!events.length && (
                  <p className="admin-empty">No event images uploaded yet.</p>
                )}
              </div>
            </div>
            <form className="admin-panel admin-form" onSubmit={uploadEvent}>
              <p className="eyebrow">HOME EVENTS GALLERY</p>
              <h2>Upload event image</h2>
              <label>
                Title
                <input name="title" required maxLength={160} />
              </label>
              <label>
                Detail
                <input name="detail" maxLength={250} />
              </label>
              <label>
                Accessibility text
                <input name="altText" required maxLength={250} />
              </label>
              <label>
                Image (up to {MAX_IMAGE_FILE_SIZE_LABEL})
                <input
                  name="file"
                  type="file"
                  accept={ALLOWED_IMAGE_ACCEPT}
                  required
                />
              </label>
              <label>
                <span>Featured card</span>
                <input name="featured" type="checkbox" value="true" />
              </label>
              <label>
                Sort order
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </label>
              <button className="admin-primary-button" type="submit">
                Upload event image
              </button>
            </form>
          </section>
          <section className="admin-content-grid">
            <div className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <p className="eyebrow">{testimonials.length} TESTIMONIALS</p>
                  <h2>Home testimonials</h2>
                </div>
              </div>
              <div className="admin-image-list">
                {testimonials.map((testimonial) => (
                  <article className="admin-image-row" key={testimonial.id}>
                    <div>
                      <h3>{testimonial.name}</h3>
                      <p>{testimonial.quote}</p>
                    </div>
                    <div className="admin-row-actions">
                      <button
                        onClick={() => void removeTestimonial(testimonial)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
                {!testimonials.length && (
                  <p className="admin-empty">No testimonials added yet.</p>
                )}
              </div>
            </div>
            <form
              className="admin-panel admin-form"
              onSubmit={uploadTestimonial}
            >
              <p className="eyebrow">HOME TESTIMONIALS</p>
              <h2>Add testimonial</h2>
              <label>
                Quote
                <textarea name="quote" rows={5} maxLength={2000} required />
              </label>
              <label>
                Name
                <input name="name" maxLength={160} required />
              </label>
              <label>
                Sort order
                <input
                  name="sortOrder"
                  type="number"
                  min="0"
                  defaultValue="0"
                />
              </label>
              <button className="admin-primary-button" type="submit">
                Add testimonial
              </button>
            </form>
          </section>
        </>
      )}
      {selectedGallery?.pageSlug !== "home" && (
        <section className="admin-content-grid">
          <div className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <p className="eyebrow">
                  {selectedGallery?.images.length ?? 0} IMAGES
                </p>
                <h2>Published gallery</h2>
              </div>
            </div>
            <div className="admin-image-list">
              {selectedGallery?.images.map((image) => (
                <article className="admin-image-row" key={image.id}>
                  <img src={image.url} alt={image.altText} />
                  <div>
                    <h3>{image.title}</h3>
                    <p>{image.description || "No description yet."}</p>
                    <small>
                      {image.published
                        ? "Visible on website"
                        : "Hidden from website"}
                    </small>
                  </div>
                  <div className="admin-row-actions">
                    <button onClick={() => editImage(image)}>Edit</button>
                    <button onClick={() => void removeImage(image)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
              {!selectedGallery?.images.length && (
                <p className="admin-empty">
                  This gallery is empty. Add its first image using the form.
                </p>
              )}
            </div>
          </div>
          <form className="admin-panel admin-form" onSubmit={saveImage}>
            <p className="eyebrow">
              {editingImageId ? "EDIT IMAGE" : "ADD IMAGE"}
            </p>
            <h2>
              {editingImageId ? "Update image details" : "Add a gallery image"}
            </h2>
            <label>
              Image file (up to {MAX_IMAGE_FILE_SIZE_LABEL})
              <input
                name="file"
                type="file"
                accept={ALLOWED_IMAGE_ACCEPT}
                required
              />
            </label>
            <label>
              Title
              <input
                name="title"
                value={imageForm.title}
                onChange={(event) =>
                  setImageForm({ ...imageForm, title: event.target.value })
                }
                required
              />
            </label>
            {selectedGallery?.pageSlug !== "membership" && (
              <label>
                Description
                <textarea
                  name="description"
                  value={imageForm.description}
                  onChange={(event) =>
                    setImageForm({
                      ...imageForm,
                      description: event.target.value,
                    })
                  }
                  rows={3}
                  placeholder={
                    selectedGallery?.pageSlug === "awards-and-recognition"
                      ? "Shown as the card heading in the awards carousel"
                      : undefined
                  }
                />
              </label>
            )}
            <label>
              Accessibility text
              <input
                name="altText"
                value={imageForm.altText}
                onChange={(event) =>
                  setImageForm({ ...imageForm, altText: event.target.value })
                }
                required
              />
            </label>
            {selectedGallery?.pageSlug !== "membership" &&
              selectedGallery?.pageSlug !== "awards-and-recognition" && (
                <label>
                  Layout style
                  <select
                    name="layoutVariant"
                    value={imageForm.layoutVariant}
                    onChange={(event) =>
                      setImageForm({
                        ...imageForm,
                        layoutVariant: event.target.value,
                      })
                    }
                  >
                    <option value="standard">Standard</option>
                    {selectedGallery?.pageSlug !== "about-us" && (
                      <option value="portrait">Portrait</option>
                    )}
                    {selectedGallery?.pageSlug === "events" && (
                      <option value="feature-tall">Feature (2x2)</option>
                    )}
                    <option value="wide">Wide</option>
                  </select>
                </label>
              )}
            <div className="admin-form-actions">
              <button className="admin-primary-button" type="submit">
                {editingImageId ? "Save changes" : "Add image"}
              </button>
              {editingImageId && (
                <button
                  className="admin-secondary-button"
                  type="button"
                  onClick={() => {
                    setEditingImageId(null);
                    setImageForm(emptyImage);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
