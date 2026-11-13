# ZIG Creative website

Static website for ZIG Creative, an AI automation agency in Scotland, hosted on Netlify.

- `index.html`: homepage (contact form connected to Formspree)
- `demo.html`: AI receptionist demo for a fictional clinic, served at `/demo`
- `netlify/functions/receptionist/`: secure server function for the demo

No build step or npm packages are needed. See **SETUP-GUIDE.md** for step-by-step setup.

The Anthropic API key is stored only in Netlify's environment variables (`ANTHROPIC_API_KEY`). Never commit it to this repository.
