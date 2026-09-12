import { getOpenAI, TEXT_MODEL, TRANSCRIBE_MODEL } from "./openai";

export type GeneratedListing = {
  make: string | null;
  model: string | null;
  variant: string | null;
  year: number | null;
  km_driven: number | null;
  fuel_type: string | null;
  transmission: string | null;
  owners: number | null;
  color: string | null;
  price: number | null;
  title: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
};

const SYSTEM_PROMPT = `You are an expert used-car listing writer for the Indian market.

You receive:
- Photos of a used car.
- A transcript of the dealer's spoken voice note, which is usually in Hindi, English, or a mix (Hinglish). It may be informal.

Produce a clean, professional, trustworthy listing in ENGLISH.

Rules:
- Extract factual details (make, model, variant, year, kilometres driven, fuel type, transmission, number of owners, price in INR) primarily from the VOICE NOTE.
- Infer only clearly visible attributes (colour, body type, obvious condition) from the PHOTOS.
- NEVER invent facts. If a field is not stated in the voice note and not clearly visible, set it to null (for price/km/year/owners) or omit it from specs.
- Convert Indian spoken numbers correctly: "saade paanch lakh" = 550000, "p55 hazaar" = 55000, "ek lakh" = 100000.
- title: "<year> <make> <model> <variant>" using only the parts you know (e.g. "2018 Honda City VX").
- description: 2-4 sentences, factual and appealing, in clear English. No emojis.
- highlights: 3-6 short phrases (e.g. "Single owner", "Full service history").
- specs: additional useful details as label/value pairs (e.g. {"label":"Insurance","value":"Valid till Mar 2026"}). Do not duplicate the structured fields above.
- price is an integer number of rupees, or null if not stated.`;

const listingSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    make: { type: ["string", "null"] },
    model: { type: ["string", "null"] },
    variant: { type: ["string", "null"] },
    year: { type: ["integer", "null"] },
    km_driven: { type: ["integer", "null"] },
    fuel_type: { type: ["string", "null"] },
    transmission: { type: ["string", "null"] },
    owners: { type: ["integer", "null"] },
    color: { type: ["string", "null"] },
    price: { type: ["integer", "null"] },
    title: { type: "string" },
    description: { type: "string" },
    highlights: { type: "array", items: { type: "string" } },
    specs: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
        required: ["label", "value"],
      },
    },
  },
  required: [
    "make", "model", "variant", "year", "km_driven", "fuel_type",
    "transmission", "owners", "color", "price", "title", "description",
    "highlights", "specs",
  ],
} as const;

/** Transcribe a voice note (Hindi/Hinglish/English) to text. */
export async function transcribeAudio(file: File): Promise<string> {
  const client = getOpenAI();
  if (!client) return "";
  const res = await client.audio.transcriptions.create({
    model: TRANSCRIBE_MODEL,
    file,
  });
  return res.text?.trim() ?? "";
}

/** Generate a structured listing from photos + a transcript. */
export async function generateListingContent(opts: {
  imageUrls: string[];
  transcript: string;
}): Promise<GeneratedListing | null> {
  const client = getOpenAI();
  if (!client) return null;

  const userContent: OpenAIUserContent[] = [
    {
      type: "text",
      text:
        `Dealer's voice note (may be Hindi/Hinglish):\n"""\n${opts.transcript || "(no voice note provided)"}\n"""\n\n` +
        `Write the listing using the voice note and the ${opts.imageUrls.length} photo(s) below.`,
    },
    ...opts.imageUrls.map((url) => ({
      type: "image_url" as const,
      image_url: { url },
    })),
  ];

  const res = await client.chat.completions.create({
    model: TEXT_MODEL,
    max_tokens: 900,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { role: "user", content: userContent as any },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "car_listing", strict: true, schema: listingSchema },
    },
  });

  const raw = res.choices[0]?.message?.content;
  if (!raw) return null;
  return JSON.parse(raw) as GeneratedListing;
}

type OpenAIUserContent =
  | { type: "text"; text: string }
  | { type: "image_url"; image_url: { url: string } };
