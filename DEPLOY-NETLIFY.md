# Shortifly Studio — Deploy to existing Netlify site

This copy is based on the working EJS-fixed version, redesigned with a new responsive animated frontend, local-time click history, and no externally hosted illustrations.

1. Extract ZIP, enter project directory.
2. Run `npm install`.
3. Verify the existing Netlify project `shortifly-demo` has `DB_URI` containing your MongoDB Atlas URL with `/urlshortner` as database path. Do not put passwords into code or `.env.example`.
4. Run `npx netlify-cli login` (if necessary) and `npx netlify-cli link` selecting `shortifly-demo`.
5. Run `npx netlify-cli deploy --build --prod`.
6. Check `/` and `/analyse` and click a test link a few times. The browser displays times in its local timezone; EJS server fallback uses Asia/Kolkata. No historical timestamps are rewritten.

Note: This manual deployment does not touch GitHub. A Git-linked future push may overwrite a manual deploy.
