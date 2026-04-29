# CryptoLens

A production-grade, full-stack cryptocurrency price and news fetcher. 
Built with a **Node.js/Express TypeScript backend** and a **React/Vite TypeScript frontend** using **Tailwind CSS v4**.

![CryptoLens](https://placehold.co/1200x600/0a0a0a/e5e5e5.png?text=CryptoLens+Minimalist+UI)

## Features

- **Extreme Minimalism**: Vercel-inspired UI with pure typography, perfect spacing, and micro-animations (no borders, no backgrounds).
- **Real-Time Market Data**: Live tracking of Bitcoin, Ethereum, and Solana via the CoinGecko API.
- **Crypto News Feed**: Latest crypto news fetched seamlessly (fallback to mock data gracefully if no API key is provided).
- **Production-Ready Backend**: MVC architecture with global error handling, asynchronous wrappers, strict typing, rate limiting, and CORS configuration.
- **Performance Optimized**: 30-second in-memory caching on the backend to prevent upstream API rate-limiting, and an auto-refreshing React frontend.

## Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS v4
- Custom `useQuery` hook for zero-dependency API fetching

### Backend
- Node.js & Express
- TypeScript
- Axios (for external API fetching)
- express-rate-limit & Helmet (for security)
- dotenv (for environment configuration)

## Getting Started

### Prerequisites
- Node.js v18+ 
- npm

### Installation

1. Clone the repository and install all dependencies:
   ```bash
   # Install dependencies for both frontend and backend
   npm run install:all
   ```

2. Set up your environment variables:
   ```bash
   cd backend
   cp .env.example .env
   ```
   *(Optional)* Add your CryptoCompare API key inside `backend/.env` to get live news. If left empty, the application will gracefully use realistic mock news data.

### Running the Application

You can start both the frontend and backend development servers easily from the root directory:

Open two terminal tabs:

**Terminal 1 (Backend):**
```bash
npm run dev:backend
```
*Runs on http://localhost:5000*

**Terminal 2 (Frontend):**
```bash
npm run dev:frontend
```
*Runs on http://localhost:5174*

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | API status, uptime, and version details |
| GET | `/api/v1/price/:coin` | Fetches price and market cap for `btc`, `eth`, or `sol` |
| GET | `/api/v1/news` | Fetches the latest cryptocurrency news |

## License

MIT
