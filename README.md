# Ave999Designs

An AI-powered interior design tool that generates furniture recommendations from IKEA, Amazon, and Wayfair based on your room dimensions and style preferences.

---

## What it does

1. **Enter your room details** — room type, dimensions, style, and budget
2. **Generate a design** — the app recommends real furniture from IKEA, Amazon, and Wayfair within your budget
3. **View the result** — an AI-generated photo-realistic visualization of the room is shown by default; switch to the 2D floor plan if preferred
4. **Swap items** — click any furniture piece to see alternatives
5. **Shop** — click the retailer buttons to open product pages and add items to your cart

There is also an **Upload Photo** mode where you can upload a photo of an existing room and the AI will analyze it and suggest furniture to redesign it.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand |
| 2D Canvas | Konva / react-konva |
| AI Analysis | Google Gemini (`gemini-2.5-flash`) |
| AI Image Gen | Google Gemini (`gemini-2.5-flash-image`) |

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd interior-design-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your key:

```bash
cp .env.example .env.local
```

Open `.env.local` and add your Google Gemini API key:

```
GEMINI_API_KEY=your_key_here
```

You can get a Gemini API key at [aistudio.google.com](https://aistudio.google.com).

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main page — all UI and flow logic
│   └── api/
│       ├── analyze/          # POST /api/analyze — Gemini photo analysis
│       └── visualize/        # POST /api/visualize — Gemini image generation
├── components/
│   ├── design/               # Input controls (room type, style, budget, dimensions, retailers)
│   ├── products/             # Product list, price summary, alternatives modal
│   ├── room/                 # Canvas, photo upload, visualize button
│   └── ui/                   # Shared UI primitives (Button, Modal)
├── data/
│   └── sampleProducts.ts     # Furniture database + filter/recommendation logic
├── lib/
│   ├── gemini.ts             # Gemini AI room analysis
│   ├── imagen.ts             # Visualization prompt builder + image generation
│   └── utils.ts              # Helpers (formatting, URL generation, unit conversion)
├── store/
│   └── roomStore.ts          # Zustand global state
└── types/
    └── index.ts              # Shared TypeScript types
```

---

## Key Features

### Retailer Support
IKEA, Amazon, and Wayfair are all supported. Products can be mixed across retailers. There is a US/Canada toggle — Canadian users get redirected to `.ca` versions of each site.

### Budget Maximization
The recommendation engine picks the most expensive (highest quality) product per furniture category that fits within the budget, rather than the cheapest.

### Furniture Recommendations
The manual flow uses a local product database (`sampleProducts.ts`). The photo upload flow uses Gemini to analyze the room and then matches suggestions to the same product database.

### Add to Cart
Clicking a retailer's shop button opens each product's page directly (e.g. `amazon.com/dp/ASIN`). Users add items to their cart on the retailer's site. All three retailers work the same way.

---

## Adding More Products

All furniture is stored in `src/data/sampleProducts.ts`. Each product has this shape:

```ts
{
  id: string;           // unique ID
  retailer: 'ikea' | 'amazon' | 'wayfair';
  externalId: string;   // ASIN for Amazon, article number for IKEA, SKU for Wayfair
  name: string;
  category: string;     // 'sofa' | 'bed' | 'desk' | 'chair' | 'table' | etc.
  price: number;
  productUrl: string;   // Direct product page URL
  width: number;        // inches
  depth: number;        // inches
  height: number;       // inches
  styles: string[];     // 'modern' | 'contemporary' | 'minimalist' | 'traditional'
  roomTypes: string[];  // 'bedroom' | 'living_room' | 'office' | 'dining_room' | etc.
  color: string;        // hex color for 2D canvas rendering
}
```

For Amazon, use `https://www.amazon.com/dp/ASIN` as the `productUrl` so it links directly to the product page.

---

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | Google Gemini API key — used for both room analysis and image generation |

`.env.local` is git-ignored and should never be committed.
