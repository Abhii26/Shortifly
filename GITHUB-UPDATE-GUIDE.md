# Publish Shortifly Studio v2 while preserving the original v1

Goal: keep **one repository** (`Abhii26/Shortifly`) with:
- `main`: Shortifly Studio v2 (new animated UI, Netlify Functions and screenshots)
- `legacy-v1`: the original Shortifly code, frozen before the update

The original code and its commit history remain in Git. GitHub and the existing manual Netlify deployment are independent.

## Prerequisites

- Install Git for Windows: https://git-scm.com/downloads/win
- Be signed into GitHub as a user authorized to push to `Abhii26/Shortifly`.
- Extract the `Shortifly-Studio-GitHub-Update.zip` archive and locate the inner `Shortifly-GitHub-Ready` directory containing `package.json` and `README.md`.
- Use **PowerShell** for the commands below. Do not run `git init` inside the extracted ZIP.

## Step 1 — Clone the existing repository

Open PowerShell in a safe working directory and run:

```powershell
cd "$HOME\Documents"
git clone https://github.com/Abhii26/Shortifly.git Shortifly-publish
cd .\Shortifly-publish
git status
git branch --show-current
```

The branch should be `main`. If it is `master` or something else, stop and adapt the commands rather than assuming `main`. `git status` should be clean. The `Shortifly-publish` folder must be a **new** folder; use a different name if it exists already.

## Step 2 — Preserve original code BEFORE copying anything

```powershell
git switch main
git pull --ff-only origin main
git branch legacy-v1
git push -u origin legacy-v1
```

Optional immutable release marker (only if the tag does not already exist):

```powershell
git tag v1.0.0
git push origin v1.0.0
```

Verify the backup at https://github.com/Abhii26/Shortifly/tree/legacy-v1 .
Do **not** proceed until that URL shows the original files.

## Step 3 — Replace the files on main with Studio v2

Set the actual absolute path of the extracted folder, for example:

```powershell
$source = 'C:\Users\YOUR_WINDOWS_USERNAME\Downloads\Shortifly-Studio-GitHub-Update\Shortifly-GitHub-Ready'
```

Then:

```powershell
if (-not (Test-Path (Join-Path $source 'package.json'))) { throw 'Incorrect source folder: package.json missing.' }
if (-not (Test-Path (Join-Path $source 'docs\screenshots\homepage.png'))) { throw 'Incorrect source folder: screenshots missing.' }
if ((git branch --show-current) -ne 'main') { throw 'Not on main. Stop.' }
if ((git status --porcelain)) { throw 'Working tree not clean. Stop.' }

git rm -r -- .
Get-ChildItem -LiteralPath $source -Force |
    Where-Object { $_.Name -ne '.git' } |
    ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination (Get-Location).Path -Recurse -Force }

git add -A
git status
git diff --cached --stat
```

`git rm -r -- .` removes **tracked files from the working copy only**. It does not delete `.git` or old commits; `legacy-v1` remains intact. Do not run `git clean -fdx` or `Remove-Item -Recurse .git`.

Check that `.env`, `node_modules`, `.netlify`, credentials and local data are **not staged**. Only `.env.example` should be present. The screenshots should appear under `docs/screenshots/`.

## Step 4 — Commit and push

```powershell
git commit -m "Launch Shortifly Studio v2 with updated README and screenshots"
git push origin main
```

If Git asks for an identity, configure your own Git username and email. If GitHub refuses the push because `main` is protected, create a feature branch and pull request instead of force-pushing. Never use `--force`.

## Step 5 — Make GitHub presentable

At https://github.com/Abhii26/Shortifly:

1. Confirm the branch selector shows `main` and the new README and all three screenshot images render.
2. Click the branch selector and verify `legacy-v1` still has your original project.
3. Edit the repository's **About** area with this description:
   `Shortifly Studio — full-stack URL shortener with animated EJS UI, click analytics, MongoDB Atlas, and Netlify Functions.`
4. Set the website to `https://shortifly-demo.netlify.app/`.
5. Add relevant topics like `nodejs`, `express`, `ejs`, `mongodb`, `url-shortener`, `netlify`, `javascript`.
6. Optionally pin the repository to your GitHub profile.

## Step 6 — Understand Netlify deployment

The existing Shortifly demo was deployed **manually** to Netlify. Changing GitHub does **not** automatically deploy it unless you configure continuous deployment. The working site should remain live at:

https://shortifly-demo.netlify.app/

Do not commit `DB_URI`, database passwords, or `.env`. Keep `DB_URI` in Netlify's environment-variable settings.

If the deployed app and GitHub files are already the same Studio version, no new Netlify deploy is necessary. If they differ, deploy the new local source manually from the project folder with `npx netlify-cli deploy --build --prod` after linking to the existing Netlify project.

## Security note

The existence of `.gitignore` does not remove credentials committed in past Git history. If any real DB password was ever committed, rotate it in MongoDB Atlas. The screenshots in this package contain **illustrative** test content, not production traffic data.
