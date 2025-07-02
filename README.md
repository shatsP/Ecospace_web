# Ecospace

> "The finest of cakes... must be taskted whole."

## Why I Built This

I didn’t want another AI tool that felt like a toy.  
I wanted a workspace that worked with me — not around me.

Ecospace was born from the frustration of juggling too many tabs, disconnected tools, and AI that talks a lot but doesn’t really assist. I wanted something local, minimal, powerful — and most importantly, **mine**.

Not cloud-bound. Not corporate-controlled.  
Just a quiet, intelligent space to think, plan, and build.

## What It Is

**Ecospace** is a browser-based productivity environment with a built-in assistant named **Iti**.  
It’s offline-first, privacy-respecting, and modular by design.

It doesn’t chase trends or do everything.  
It does a few things well — with you in control.

## What It Helps You Do

- Plan your week with smart assistance  
- Clarify vague tasks or messy inputs  
- Expand your thoughts into clear writing  
- Launch apps and websites based on intent  
- Stay focused with no distractions or noise

All stored locally. No tracking. No syncing.  
The AI lives in your machine, not someone else's.

## Local Setup

```bash
# 1. Clone the repo
git clone [https://github.com/shatsP/Ecospace_web.git]
cd ecospace

# 2. Install dependencies
npm install

# 3. Create a .env file
touch .env.local
```

Inside .env.local, add your API key for Gemma via E2B:

```bash
VITE_GEMINI_API_KEY="your api key"
```

You must set up access to "gemma-3n-e2b-it" via Google's Gemini API. Without it, Ecospace will not start.

```bash
# 4. Run the app
npm run dev
```

Ecospace should now launch at http://localhost:5173

The Philosophy

No cloud login. No waiting for servers.
Just open it and get to work.

License

MIT

Ecospace isn’t here to replace humans — it’s here to support them.
Like a Lego Iron Man suit: you build it, it suits up.

— Shats
