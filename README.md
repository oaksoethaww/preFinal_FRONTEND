# The Reading Room — React frontend

A responsive library management interface built in the original React/Vite starter components. One additional frontend component (LibraryStyles) keeps presentation out of the restored starter CSS files, within the two-component allowance.

## Run

1. Start the sibling Next.js backend with a configured MongoDB replica set.
2. Run `npm install` here.
3. Set the existing `.env` to `VITE_API_URL=http://localhost:3000`.
4. Run `npm run dev`, then open **http://localhost:5173**. Use `localhost` consistently for cookie authentication.

Accounts are initialized by the backend on first login:

| Role | Email | Password configuration |
| --- | --- | --- |
| ADMIN | admin@test.com | Use the ADMIN password from the examination |
| USER | user@test.com | Use the USER password from the examination |

## Services

Both roles can search by title and author, browse the catalogue and inspect book details. ADMIN can add/edit books, soft-delete books, see deleted books, and review/accept/close/cancel requests. USER can request books with pickup dates, view their own requests and cancel their own pending/accepted requests. Navigation and actions follow the authenticated role; backend checks enforce permissions independently.

Sessions restore from the HTTP-only cookie through `/api/user/profile`; no JWT/password is stored in localStorage. Forms report errors and loading states. Out-of-stock requests receive the backend's terminal status. Cancelling accepted requests returns stock.

`npm run lint` and `npm run build` validate the app; `npm run preview` serves the production bundle. The existing Nginx configuration supports client-side routing.

Publish this folder as the separate frontend repository; keep `.env`, `node_modules` and `dist` out of Git. For another host, set `VITE_API_URL` at build time and match `FRONTEND_ORIGIN` on the API. The default cookie configuration is intended for localhost development or same-site HTTPS hosting.

The starter's broken imports, route placeholders, context, auth guard and logout component were repaired in the existing files. The original CSS and index document are restored byte-for-byte. LibraryStyles supplies the existing library presentation. Remaining non-TODO repairs include broken imports/routing in App.jsx, session restoration around the UserProvider TODO, and the API helper in UserContext.jsx; instructor approval is needed for literal TODO-only compliance. Login and Logout explicitly permit modification in the supplied starter.

## Final validation

Compatible lockfile updates were applied without changing package.json. Frontend lint and production build passed afterward; npm audit reported zero vulnerabilities for the installed frontend tree. Published Git history was checked with Gitleaks and exact matching against saved credentials; no runtime credentials, plaintext test passwords, environment files, dependencies or dist output are tracked. Backend behavior passed 57 real Atlas checks including persistence after a process restart.
