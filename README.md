# ShongjogBD Server (Social Development Events Platform API)

Robust, production-ready REST API built with Node.js, Express.js, TypeScript, MongoDB native driver, BetterAuth, and JSON Web Tokens.

## Tech Stack
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js & TypeScript
- **Database:** MongoDB Native Driver (`mongodb`)
- **Authentication:** `better-auth` (with `better-auth/adapters/mongodb`) + Google OAuth
- **Authorization:** `jsonwebtoken` (JWT bearer protection for sensitive routes)
- **Validation:** `zod`

## REST API Endpoints
- `ALL /api/auth/*` - Handled by BetterAuth (sign in, sign up, session management, Google OAuth)
- `POST /api/jwt` - Issue 7-day signed JWT for authenticated client sessions
- `GET /api/events/recent` - Public: 6 most imminent upcoming events (strictly future dates, `.limit(6)`)
- `GET /api/events/upcoming` - Public: Filterable & searchable upcoming events
- `GET /api/events/:id` - Public: Event details with live participant count
- `POST /api/events` - Protected (`verifyJWT`): Create event with future date validation
- `GET /api/my-events` - Protected (`verifyJWT`): Fetch all events created by the caller
- `PUT /api/events/:id` - Protected (`verifyJWT`): Update event (owner-restricted, future date validated)
- `DELETE /api/events/:id` - Protected (`verifyJWT`): Delete event (owner-restricted, cascades to joined records)
- `POST /api/events/:id/join` - Protected (`verifyJWT`): Join event (prevents duplicates via compound index)
- `GET /api/joined-events` - Protected (`verifyJWT`): Retrieve user's joined events sorted chronologically
- `POST /api/seed` - Public: Seed 8 realistic Bangladesh community events

## Environment Variables
Create a `.env` file referencing `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
DB_NAME=shongjogbd
JWT_SECRET=super_secret_jwt_key
CLIENT_URL=http://localhost:3000
BETTER_AUTH_SECRET=better_auth_secret_key_32_chars_min
BETTER_AUTH_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Running the Server
```bash
npm run dev   # Start development server with tsx hot-reload
npm run build # Compile TypeScript to dist/
npm run start # Start production server from dist/
```
