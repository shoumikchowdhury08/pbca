"use client";

import { FormEvent, useEffect, useState } from "react";
import type { GalleryDto, GalleryImageDto } from "@/types/gallery";

const emptyImage = {
  title: "",
  description: "",
  altText: "",
  url: "",
  storageKey: "",
  credit: "",
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
  const [selectedGalleryId, setSelectedGalleryId] = useState("");
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [imageForm, setImageForm] = useState<ImageForm>(emptyImage);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const selectedGallery = galleries.find(
    (gallery) => gallery.id === selectedGalleryId,
  );

  async function loadAdmin() {
    try {
      const me = await readJson<{ name: string }>(
        await fetch("/api/admin/auth/me"),
      );
      const data = await readJson<GalleryDto[]>(
        await fetch("/api/admin/galleries"),
      );
      setUser(me);
      setGalleries(data);
      setSelectedGalleryId((current) => current || data[0]?.id || "");
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
  }

  async function saveImage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGalleryId) return;
    setError("");
    try {
      const url = editingImageId
        ? `/api/admin/images/${editingImageId}`
        : `/api/admin/galleries/${selectedGalleryId}/images`;
      const data = await readJson<GalleryImageDto>(
        await fetch(url, {
          method: editingImageId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(imageForm),
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
      url: image.url,
      storageKey: image.storageKey,
      credit: image.credit ?? "",
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
            }}
          >
            {galleries.map((gallery) => (
              <option key={gallery.id} value={gallery.id}>
                {gallery.title}
              </option>
            ))}
          </select>
        </label>
        {selectedGallery && <p>{selectedGallery.description}</p>}
      </section>
      {error && <p className="admin-error">{error}</p>}
      {message && <p className="admin-success">{message}</p>}
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
            Image URL
            <input
              value={imageForm.url}
              onChange={(event) =>
                setImageForm({ ...imageForm, url: event.target.value })
              }
              type="url"
              placeholder="https://..."
              required
            />
          </label>
          <label>
            Storage key
            <input
              value={imageForm.storageKey}
              onChange={(event) =>
                setImageForm({ ...imageForm, storageKey: event.target.value })
              }
              placeholder="events/2026/puja.webp"
              required
            />
          </label>
          <label>
            Title
            <input
              value={imageForm.title}
              onChange={(event) =>
                setImageForm({ ...imageForm, title: event.target.value })
              }
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={imageForm.description}
              onChange={(event) =>
                setImageForm({ ...imageForm, description: event.target.value })
              }
              rows={3}
            />
          </label>
          <label>
            Accessibility text
            <input
              value={imageForm.altText}
              onChange={(event) =>
                setImageForm({ ...imageForm, altText: event.target.value })
              }
              required
            />
          </label>
          <label>
            Photographer credit
            <input
              value={imageForm.credit}
              onChange={(event) =>
                setImageForm({ ...imageForm, credit: event.target.value })
              }
            />
          </label>
          <label>
            Layout style
            <select
              value={imageForm.layoutVariant}
              onChange={(event) =>
                setImageForm({
                  ...imageForm,
                  layoutVariant: event.target.value,
                })
              }
            >
              <option value="standard">Standard</option>
              <option value="feature">Feature</option>
              <option value="portrait">Portrait</option>
              <option value="wide">Wide</option>
            </select>
          </label>
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
    </main>
  );
}
