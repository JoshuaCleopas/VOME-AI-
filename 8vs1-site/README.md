# 8 vs 1 companion site

A static page: no build step. Everything is in this folder.

## Deploy to Vercel
Option A, from your Mac:
1. Open Terminal in this folder.
2. Run `npx vercel` and follow the prompts (log in, accept the defaults).
3. Run `npx vercel --prod` to publish.

Option B, from the browser: drag this folder onto vercel.com/new (or push it to a GitHub repo and import it). Framework preset: "Other". No build command.

## Add the films
Upload the AI Films to Google Drive and share the folder as "Anyone with the link: Viewer".
For each film, copy the ID from its share link (the part between /d/ and /view) into FILMS in data.js.
FLUX 3's horror entry stays null: it shows "No film".

## Other things to fill in
- LINKS.video and LINKS.channel in data.js (hidden until filled).
- UGC reference images: save them as refs/ugc-creator.jpg and refs/ugc-cleanser.jpg, then add both names to AVAILABLE_REFS at the top of app.js.
