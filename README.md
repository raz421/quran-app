# Quran Calm Reader

A premium Quran web application focused on clarity, reflection, and reading flow.

Built with Next.js App Router, Tailwind CSS v4, and server-side API routes that proxy Quran data through a centralized config/client layer.

## Product Scope

- Search-first experience with premium UI/UX
- Full Surah browsing with pagination
- Surah reading page with Arabic + translation + audio
- Sticky reading progress and subtle motion effects
- User settings for theme, Arabic font, and typography sizes

## Technology Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Axios
- Route Handlers for backend-for-frontend API endpoints

## Key Features

- Hero-first search interaction
- Search results with matched ayah highlighting
- Surah detail composition from multiple Quran API editions
- Single-track ayah audio playback (starting a new ayah stops the previous one)
- Persistent local settings (theme, font, sizes)
- Dark-first premium visual system
- Responsive layouts across mobile, tablet, and desktop

## Architecture

The app follows a backend-for-frontend pattern.

- UI calls local route handlers in src/app/api/quran
- Route handlers call external Quran API via shared client
- Environment variables are centralized in one server config module

Core modules:

- src/lib/serverEnv.js
- src/lib/quranApiClient.js
- src/app/api/quran/search/route.js
- src/app/api/quran/surahs/route.js
- src/app/api/quran/surah/[id]/route.js

## Project Structure

```text
src/
	app/
		api/quran/
			search/route.js
			surahs/route.js
			surah/[id]/route.js
		search/page.js
		surahs/page.js
		surah/[id]/page.js
		page.js
		layout.js
		globals.css
	components/
		Header.jsx
		HeroSearch.jsx
		SurahGrid.jsx
		ReadingExperience.jsx
		SearchResultsClient.jsx
		SettingsPanel.jsx
		Footer.jsx
	context/
		AppSettingsContext.jsx
	lib/
		quran.js
		serverEnv.js
		quranApiClient.js
```

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create local env file from template:

macOS/Linux:

```bash
cp .env.example .env.local
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 3. Run development server

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

Defined in .env.example:

| Variable             | Required | Default                      | Description                             |
| -------------------- | -------- | ---------------------------- | --------------------------------------- |
| QURAN_API_BASE_URL   | No       | https://api.alquran.cloud/v1 | Upstream Quran API base URL             |
| QURAN_API_TIMEOUT_MS | No       | 10000                        | Upstream request timeout (ms)           |
| QURAN_API_KEY        | No       | empty                        | Optional API key (sent as Bearer token) |

Notes:

- Do not commit .env.local
- Commit only .env.example as a template

## API Endpoints

### GET /api/quran/surahs

Returns full Surah list.

Response shape:

```json
{
  "surahs": []
}
```

### GET /api/quran/search?q={query}&size={n}

Searches ayahs by keyword.

Rules:

- q length < 2 returns empty result
- size is clamped between 1 and 50

Response shape:

```json
{
  "total": 0,
  "matches": [
    {
      "text": "...",
      "surahName": "...",
      "surahNumber": 1,
      "ayahNumber": 1
    }
  ]
}
```

### GET /api/quran/surah/{id}

Composes Arabic text, English translation, and audio into a normalized payload.

Response shape:

```json
{
  "id": 1,
  "nameArabic": "...",
  "nameEnglish": "...",
  "nameTranslation": "...",
  "revelationType": "...",
  "ayahs": [
    {
      "numberInSurah": 1,
      "arabicText": "...",
      "translationText": "...",
      "audioUrl": "..."
    }
  ]
}
```

## Available Scripts

```bash
npm run dev    # Start local development server
npm run build  # Build production bundle
npm run start  # Run production server
npm run lint   # Run ESLint
```

## Quality and Conventions

- Centralized server config for external APIs
- No hardcoded API host/timeout inside route handlers
- UI state persisted via context + localStorage
- Tailwind utility-first styling with shared CSS variables

## Deployment

Recommended: Vercel or any Node-compatible platform.

Minimum requirements:

- Node.js runtime compatible with Next.js 16
- Environment variables configured in hosting platform

Deployment flow:

1. Configure env vars
2. Run npm run build
3. Start with npm run start (or platform equivalent)

## Security Notes

- Keep API credentials in .env.local / platform secrets
- Never commit real secrets
- Route handlers return sanitized fallback responses on upstream failures
