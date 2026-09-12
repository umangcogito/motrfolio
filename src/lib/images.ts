import convert from "heic-convert";

// ISO-BMFF brands that indicate a HEIC/HEIF image (iPhone photos).
const HEIC_BRANDS = ["heic", "heix", "hevc", "hevx", "mif1", "msf1", "heim", "heis"];

function isHeic(buf: Buffer, type: string, name: string): boolean {
  if (/hei[cf]/i.test(type)) return true;
  if (/\.hei[cf]$/i.test(name)) return true;
  // Magic bytes: "ftyp" at offset 4, brand at offset 8.
  if (buf.length > 12 && buf.toString("ascii", 4, 8) === "ftyp") {
    const brand = buf.toString("ascii", 8, 12).toLowerCase();
    return HEIC_BRANDS.includes(brand);
  }
  return false;
}

/**
 * Normalize an uploaded image to a format OpenAI vision accepts.
 * HEIC/HEIF (iPhone) → JPEG; everything else passes through unchanged.
 */
export async function normalizeImage(
  file: File,
): Promise<{ data: Buffer; contentType: string; ext: string }> {
  const buf = Buffer.from(await file.arrayBuffer());

  if (isHeic(buf, file.type || "", file.name || "")) {
    try {
      const out = await convert({ buffer: buf, format: "JPEG", quality: 0.85 });
      return { data: Buffer.from(out), contentType: "image/jpeg", ext: "jpg" };
    } catch (e) {
      console.error("[images] HEIC conversion failed:", e);
      // Fall through with the original bytes (best effort).
    }
  }

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().slice(0, 5);
  return { data: buf, contentType: file.type || "image/jpeg", ext };
}
