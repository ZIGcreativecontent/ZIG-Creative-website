# ZIG Creative website

A static, single-page website. There is no build step and nothing to install: the whole site is plain HTML, CSS and JavaScript in `index.html`. The only outside resources are Google Fonts (Archivo, Instrument Sans, JetBrains Mono), which are free to use.

## Files

| File | What it does |
|---|---|
| `index.html` | The entire website: content, styles, animations and form logic |
| `favicon.svg` | The blue ZIG logo mark shown in browser tabs |
| `robots.txt` | Lets search engines index the site |
| `netlify.toml` | Settings for Netlify (no build, security headers) |
| `vercel.json` | Settings for Vercel (security headers) |

## Deploy on Netlify (easiest)

1. Sign up free at netlify.com.
2. Go to **Sites → Add new site → Deploy manually**.
3. Unzip this folder, then drag the unzipped folder onto the upload area.
4. Your site is live on a `something.netlify.app` address within seconds.
5. To use your own domain: **Domain management → Add a domain**, then follow the DNS steps for your domain provider. HTTPS is set up automatically.

## Deploy on Vercel

1. Sign up free at vercel.com.
2. The simplest route is to put this folder in a GitHub repository, then in Vercel choose **Add New → Project**, import the repository and press **Deploy**. Leave Framework Preset as **Other** and the build command empty.
3. Add your own domain under **Settings → Domains**.

## Connecting the contact form

The form already checks every field. Until it is connected, it tells visitors clearly that nothing was sent.

To make it send real enquiries:

1. Create a free account at formspree.io and make a new form. Set the notification email to the inbox where you want enquiries.
2. Copy the form endpoint it gives you, for example `https://formspree.io/f/abcdwxyz`.
3. Open `index.html`, find this line near the start of the `<script>` section:

   ```js
   const FORM_ENDPOINT = "";
   ```

   and paste your endpoint between the quotes:

   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";
   ```

4. Save and re-upload the site. The yellow "Preview: form not connected yet" notice automatically changes to a green "Form connected" notice, and visitors see a thank-you message after sending.
5. Send yourself a test enquiry and confirm the email arrives (check spam the first time).

Any service that accepts a JSON `POST` works the same way (Basin, Getform, or your own API).

The form sends: full name, business name, email, phone, business type, services chosen, message, consent and a timestamp. It includes a hidden spam trap field.

## Before launch

- Replace the Privacy Policy, Terms of Service and Accessibility Statement placeholders (in `index.html`, search for `const policies`). A real Privacy Policy is needed because the form collects personal data (UK GDPR).
- Add your business email address to the site if you want one shown. None is included, as none was provided.
