# Cloudenize

Upload a cloud photo and get a polaroid-style memory card — complete with the cloud type, a poetic Chinese description, and the season it evokes.

Recognizes both real meteorological clouds (10 types) and fantasy clouds — cartoons, kawaii illustrations, 3D renders, art installations. Real clouds get their proper scientific name. Fantasy clouds get an invented poetic name. The card looks the same either way.

**Stack:** Next.js 16 · GPT-4o vision · TypeScript

---

## Getting Started

Set your OpenAI API key:

```bash
echo "OPENAI_API_KEY=sk-..." > .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Upload a cloud photo. Get a card.

**Debug mode:** add `?debug=1` to the URL to show the image URL input field.

---

## Cloud Types

**Real (meteorological):**
卷云 · 积云 · 层云 · 积雨云 · 高积云 · 卷积云 · 卷层云 · 高层云 · 雨层云 · 层积云

**Fantasy:**
梦境积云 · 彩霞幻云 · 星织云 · 画境云 · 糖棉云 · 水墨幻云 · 童话云 · (or a freely invented name)

---

## Project Structure

```
app/
  page.tsx           — main upload + card UI
  api/generate/      — GPT-4o vision API route
components/frames/
  PolaroidFrame.tsx  — card renderer
lib/
  cloudIdentify.ts   — GPT-4o prompt + response parsing
types/
  cloud.ts           — CloudType, CloudIdentifyResult
```

---

## Deploy

```bash
npm run build
```

Deploy to any platform that supports Next.js (Vercel, Railway, etc.). Set `OPENAI_API_KEY` in the environment.
