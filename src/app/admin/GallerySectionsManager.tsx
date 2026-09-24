"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { readApiData } from "@/lib/http";
import { ALLOWED_IMAGE_ACCEPT, MAX_IMAGE_FILE_SIZE_LABEL } from "@/lib/uploads";
import { formFile, formText, uploadImageDirect } from "@/lib/uploads-client";
import type { GalleryDto, GalleryImageDto } from "@/types/types";

type GallerySectionsManagerProps = {
  /** Gallery page sections, oldest first. */
  sections: GalleryDto[];
  /** Re-reads the admin galleries after a change. */
  onRefresh: () => Promise<void>;
  onError: (message: string) => void;
  onMessage: (message: string) => void;
};

/**
 * Manages the sections of the Gallery page: create a section, rename it, remove
 * it, and add or remove the images inside it.
 *
 * Sections are gallery rows under the hood, so images reuse the presigned
 * direct-to-R2 upload and the standard image endpoints. Their images carry only
 * an optional title, which is why description and accessibility text are sent
 * empty here.
 */
export default function GallerySectionsManager({
  sections,
  onRefresh,
  onError,
  onMessage,
}: GallerySectionsManagerProps) {
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);

  /** Runs a mutation, refreshes the gallery list, then reports the outcome. */
  async function run(action: () => Promise<string>) {
    onError("");
    try {
      const message = await action();
      await onRefresh();
      onMessage(message);
    } catch (cause) {
      onError(cause instanceof Error ? cause.message : "Something went wrong.");
    }
  }

  function addSection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    void run(async () => {
      await readApiData<GalleryDto>(
        axios.post("/api/admin/gallery-sections", {
          title: formText(form, "title"),
          description: formText(form, "description"),
        }),
      );
      formElement.reset();
      return "New section added to the Gallery page.";
    });
  }

  function renameSection(
    event: FormEvent<HTMLFormElement>,
    section: GalleryDto,
  ) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await readApiData<GalleryDto>(
        axios.patch(`/api/admin/galleries/${section.id}`, {
          title: formText(form, "title"),
        }),
      );
      return "Section title saved.";
    });
  }

  function removeSection(section: GalleryDto) {
    const count = section.images.length;
    if (
      !window.confirm(
        `Remove the “${section.title || "untitled"}” section and its ${count} image${count === 1 ? "" : "s"}?`,
      )
    ) {
      return;
    }
    void run(async () => {
      await readApiData<{ success: true }>(
        axios.delete(`/api/admin/gallery-sections/${section.id}`),
      );
      return "Section removed from the Gallery page.";
    });
  }

  function uploadSectionImage(
    event: FormEvent<HTMLFormElement>,
    section: GalleryDto,
  ) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const file = formFile(form);
    if (!file) {
      onError("Please select an image file.");
      return;
    }

    setUploadPercent(0);
    void run(async () => {
      try {
        const storageKey = await uploadImageDirect(
          file,
          "gallery-image",
          { galleryId: section.id },
          setUploadPercent,
        );
        await readApiData<GalleryImageDto>(
          axios.post(`/api/admin/galleries/${section.id}/images`, {
            storageKey,
            fileName: file.name,
            title: formText(form, "title"),
            description: "",
            altText: "",
            layoutVariant: "standard",
          }),
        );
        formElement.reset();
        return "Image added to the section.";
      } finally {
        setUploadPercent(null);
      }
    });
  }

  function renameImage(
    event: FormEvent<HTMLFormElement>,
    image: GalleryImageDto,
  ) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void run(async () => {
      await readApiData<GalleryImageDto>(
        axios.patch(`/api/admin/images/${image.id}`, {
          title: formText(form, "title"),
          description: "",
          altText: "",
          layoutVariant: "standard",
        }),
      );
      return "Image title saved.";
    });
  }

  function removeImage(image: GalleryImageDto) {
    if (
      !window.confirm(
        `Remove “${image.title || "this image"}” from this section?`,
      )
    ) {
      return;
    }
    void run(async () => {
      await readApiData<{ success: true }>(
        axios.delete(`/api/admin/images/${image.id}`),
      );
      return "Image removed.";
    });
  }

  return (
    <section className="admin-panel" id="gallery-page-sections">
      <div className="admin-panel-heading">
        <div>
          <p className="eyebrow">
            {sections.length} SECTION{sections.length === 1 ? "" : "S"}
          </p>
          <h2>Gallery page sections</h2>
        </div>
      </div>
      <p>
        Each section appears on the Gallery page as its own titled grid. Upload
        as many images as you like per section; every image takes just an
        optional title.
      </p>
      {uploadPercent !== null && (
        <p className="admin-success">Uploading image… {uploadPercent}%</p>
      )}

      <form className="admin-form admin-section-block" onSubmit={addSection}>
        <p className="eyebrow">NEW</p>
        <h3>Add a new section</h3>
        <label>
          Section title
          <input name="title" required maxLength={160} />
        </label>
        <label>
          Short description (optional)
          <input name="description" maxLength={1000} />
        </label>
        <button className="admin-primary-button" type="submit">
          Add section
        </button>
      </form>

      {sections.map((section, index) => (
        <article className="admin-section-block" key={section.id}>
          <div className="admin-panel-heading">
            <div>
              <p className="eyebrow">
                SECTION {String(index + 1).padStart(2, "0")} ·{" "}
                {section.images.length} IMAGE
                {section.images.length === 1 ? "" : "S"}
              </p>
              <h3>{section.title || "Untitled section"}</h3>
            </div>
            <div className="admin-row-actions">
              <button
                className="admin-secondary-button"
                onClick={() => void removeSection(section)}
              >
                Remove section
              </button>
            </div>
          </div>

          <form
            className="admin-inline-form"
            onSubmit={(event) => renameSection(event, section)}
          >
            <label>
              Section title
              <input name="title" defaultValue={section.title} maxLength={160} />
            </label>
            <button className="admin-secondary-button" type="submit">
              Save title
            </button>
          </form>

          <div className="admin-image-list">
            {section.images.map((image) => (
              <article className="admin-image-row" key={image.id}>
                <Image
                  src={image.url}
                  alt={image.altText || image.title || "Gallery image"}
                  width={192}
                  height={152}
                  sizes="96px"
                  loading="lazy"
                  decoding="async"
                />
                <form
                  className="admin-inline-form"
                  onSubmit={(event) => renameImage(event, image)}
                >
                  <label>
                    Title (optional)
                    <input
                      name="title"
                      defaultValue={image.title}
                      maxLength={160}
                    />
                  </label>
                  <button className="admin-secondary-button" type="submit">
                    Save
                  </button>
                </form>
                <div className="admin-row-actions">
                  <button onClick={() => void removeImage(image)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
            {!section.images.length && (
              <p className="admin-empty">
                No images in this section yet. Upload the first one below.
              </p>
            )}
          </div>

          <form
            className="admin-inline-form"
            onSubmit={(event) => uploadSectionImage(event, section)}
          >
            <label>
              Title (optional)
              <input name="title" maxLength={160} />
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
            <button className="admin-primary-button" type="submit">
              Upload image
            </button>
          </form>
        </article>
      ))}

      {!sections.length && (
        <p className="admin-empty">
          No sections yet. Add the first one to build the Gallery page.
        </p>
      )}
    </section>
  );
}
