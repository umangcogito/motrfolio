"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const MAX_PHOTOS = 8;
const inputClass =
  "w-full rounded-sm border border-hairline bg-canvas px-4 py-3 text-[15px] text-ink " +
  "placeholder:text-muted-soft outline-none transition focus:border-ink focus:ring-2 focus:ring-ink/10";

export default function SellForm() {
  const router = useRouter();
  const [photos, setPhotos] = useState<File[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  function addPhotos(files: FileList | null) {
    if (!files) return;
    const incoming = Array.from(files).filter((f) => f.type.startsWith("image/"));
    setPhotos((prev) => [...prev, ...incoming].slice(0, MAX_PHOTOS));
  }

  function removePhoto(i: number) {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setAudio(blob: Blob | null) {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(blob);
    setAudioUrl(blob ? URL.createObjectURL(blob) : null);
  }

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      rec.onstop = () => {
        setAudio(new Blob(chunksRef.current, { type: rec.mimeType || "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      rec.start();
      recorderRef.current = rec;
      setRecording(true);
    } catch {
      setError("Couldn't access the microphone. You can upload an audio file instead.");
    }
  }

  function stopRecording() {
    recorderRef.current?.stop();
    setRecording(false);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;
    if (photos.length === 0) {
      setError("Please add at least one photo of the car.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const fd = new FormData();
    fd.append("dealer_name", (data.get("dealer_name") as string) ?? "");
    fd.append("dealer_city", (data.get("dealer_city") as string) ?? "");
    fd.append("dealer_phone", (data.get("dealer_phone") as string) ?? "");
    photos.forEach((p) => fd.append("photos", p));
    if (audioBlob) {
      // Name the file by its real format so OpenAI can parse it (iOS records mp4).
      const t = audioBlob.type || "audio/webm";
      const ext = t.includes("mp4") || t.includes("m4a")
        ? "mp4"
        : t.includes("mpeg") || t.includes("mp3")
        ? "mp3"
        : t.includes("wav")
        ? "wav"
        : t.includes("ogg")
        ? "ogg"
        : "webm";
      fd.append("audio", audioBlob, `voice.${ext}`);
    }

    try {
      const res = await fetch("/api/listings/create", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Something went wrong.");
      router.push(`/${json.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Photos */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink">1 · Photos</h2>
        <p className="mb-3 mt-0.5 text-[14px] text-muted">Add 5–8 clear photos of the car ({photos.length}/{MAX_PHOTOS}).</p>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-hairline-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(p)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-[14px] text-white"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-strongborder text-muted transition hover:border-ink hover:text-ink">
              <span className="text-[24px] leading-none">+</span>
              <span className="mt-1 text-[12px]">Add</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
            </label>
          )}
        </div>
      </section>

      {/* Voice note */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink">2 · Voice note</h2>
        <p className="mb-3 mt-0.5 text-[14px] text-muted">
          Describe the car in Hindi or English — year, km, owners, condition, price. (Optional but recommended.)
        </p>
        <div className="flex flex-wrap items-center gap-3">
          {!recording ? (
            <button
              type="button"
              onClick={startRecording}
              className="flex h-11 items-center gap-2 rounded-sm bg-rausch px-5 text-[14px] font-medium text-canvas transition hover:bg-rausch-active"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-white" /> Record
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="flex h-11 items-center gap-2 rounded-sm border border-rausch px-5 text-[14px] font-medium text-rausch"
            >
              <span className="h-2.5 w-2.5 animate-pulse rounded-sm bg-rausch" /> Stop
            </button>
          )}
          <label className="cursor-pointer text-[13px] text-muted underline">
            or upload a file
            <input type="file" accept="audio/*" className="hidden" onChange={(e) => setAudio(e.target.files?.[0] ?? null)} />
          </label>
          {audioUrl && !recording && (
            <div className="flex items-center gap-2">
              <audio controls src={audioUrl} className="h-9" />
              <button type="button" onClick={() => setAudio(null)} className="text-[13px] text-muted underline">
                remove
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Dealer */}
      <section>
        <h2 className="text-[17px] font-semibold text-ink">3 · Your details</h2>
        <p className="mb-3 mt-0.5 text-[14px] text-muted">Shown on the listing so buyers can reach you.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <input name="dealer_name" placeholder="Dealership / your name" className={inputClass} />
          <input name="dealer_city" placeholder="City (e.g. Delhi)" className={inputClass} />
          <input name="dealer_phone" type="tel" inputMode="tel" placeholder="WhatsApp number" className={inputClass} />
        </div>
      </section>

      {error && (
        <p className="text-[14px] text-rausch-active" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-sm bg-rausch text-[16px] font-medium text-canvas transition hover:bg-rausch-active disabled:cursor-not-allowed disabled:bg-rausch-disabled"
      >
        {submitting ? "Building your listing… (transcribing + writing)" : "Generate listing"}
      </button>
      {submitting && (
        <p className="text-center text-[13px] text-muted">This takes ~15–30 seconds. Please don&apos;t close the page.</p>
      )}
    </form>
  );
}
