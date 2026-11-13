# ZIG Creative: AI receptionist demo setup guide

This guide moves your website from drag-and-drop to GitHub and switches on the AI receptionist demo at **/demo**. Your homepage (`index.html`) is not changed.

Do these steps on a laptop or computer. GitHub uploads are hard on a phone.

## What's in this folder

| File | What it is |
|---|---|
| `index.html` | Your existing homepage, unchanged (Formspree already connected) |
| `demo.html` | The new AI receptionist demo page |
| `netlify/functions/receptionist/receptionist.mjs` | The secure server code that talks to the AI |
| `netlify/functions/receptionist/clinic.mjs` | The fictional clinic's treatments, prices, hours and the receptionist's rules. Edit this to change what it knows |
| `netlify.toml` | Netlify settings, including the /demo address |
| `favicon.svg`, `robots.txt` | Tab icon and search engine file |

## Step 1: Get your Anthropic API key

1. Go to **console.anthropic.com** and create an account.
2. Open **Billing** and add a small amount of credit (around $5 is plenty for testing).
3. Open **Limits** and set a low monthly spend limit, e.g. $10. This caps what the demo can ever cost.
4. Open **API Keys**, click **Create Key**, name it `zig-demo`, and copy it.
5. Keep the key somewhere private. **Never** paste it into any file in this folder or into GitHub. Your repository is public, so anyone could see it.

## Step 2: Upload these files to GitHub

1. Unzip this folder on your computer.
2. Open your repository: github.com/ZIGcreativecontent/ZIG-Creative-website
3. Click **Add file → Upload files**.
4. Open the unzipped folder, select **everything inside it** (including the `netlify` folder), and drag it all onto the GitHub page. Upload the contents, not the outer folder.
5. Check the list shows `netlify/functions/receptionist/...` with its folders.
6. Scroll down and click **Commit changes**.

## Step 3: Connect your Netlify site to GitHub

This keeps your address, zigcreative.netlify.app.

1. Log in to **app.netlify.com** and open your ZIG Creative site.
2. Go to **Site configuration → Build & deploy → Continuous deployment**.
3. Click **Link repository** (or **Link site to Git**), choose **GitHub**, and approve access.
4. Pick **ZIG-Creative-website** and the **main** branch.
5. Build settings: leave **Base directory** and **Build command** empty. Set **Publish directory** to `.` (a single full stop). **Functions directory** should show `netlify/functions`.
6. Click **Deploy** / **Save**.

## Step 4: Add your API key to Netlify (secretly)

1. In your site, go to **Site configuration → Environment variables**.
2. Click **Add a variable → Add a single variable**.
3. Key: `ANTHROPIC_API_KEY`. Value: paste your key from Step 1. If offered, tick **Contains secret values**.
4. Save.
5. Go to **Deploys** and click **Trigger deploy → Deploy site** so the key takes effect.

## Step 5: Test it

1. When the deploy says **Published**, open **zigcreative.netlify.app/demo**.
2. Tap a suggestion such as "What are your opening hours?". You should get a reply within a few seconds.
3. Ask to book something. A booking enquiry form should appear. When submitted, it says **"Enquiry captured (demo only)"**. Nothing is sent and nothing is booked.
4. Check your homepage still looks exactly the same.

## If something goes wrong

| What you see | What it means |
|---|---|
| "The AI receptionist isn't connected yet" | The `ANTHROPIC_API_KEY` variable is missing, or you didn't redeploy after adding it |
| "Couldn't sign in to its AI service" | The key is wrong or was deleted. Make a new one and update the variable |
| "Vela is very busy" | Rate limit or your spend limit was reached. Check Billing and Limits in the Anthropic Console |
| /demo shows "Page not found" | The files weren't uploaded with their folders, or the site isn't linked to GitHub yet |

Netlify shows server logs under **Logs → Functions → receptionist**.

## Optional settings

- **Receive demo enquiries by email:** create a second Formspree form, then in `demo.html` paste its endpoint into `const DEMO_ENQUIRY_ENDPOINT = "";`. Leaving it empty is recommended for a fictional clinic.
- **Change the clinic's details or rules:** edit `netlify/functions/receptionist/clinic.mjs` in GitHub (click the file, then the pencil icon), then commit. Netlify redeploys by itself.
- **Change the AI model:** add a Netlify variable `ANTHROPIC_MODEL`. The default is `claude-haiku-5-5`.

## Updating the site from now on

Once linked to GitHub, **don't drag folders into Netlify anymore**. Edit or upload files in GitHub instead, and Netlify publishes the changes automatically within a minute or two.
