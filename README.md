# AUTTOBI Cryptocurrency Investment Platform

AUTTOBI is a comprehensive cryptocurrency investment platform that allows users to manage their cryptocurrency portfolios, track market data, and handle transactions securely.

## Features

- User account management with secure authentication
- Cryptocurrency wallet management
- Market data and analytics
- Portfolio tracking
- Admin panel with KYC verification
- Support & FAQ system

## Tech Stack

- React frontend
- Express.js backend
- PostgreSQL database
- Drizzle ORM
- Tailwind CSS with shadcn/ui components

## Deployment to Netlify

To deploy this application to Netlify for free, follow these steps:

1. Make sure you have a [Netlify account](https://app.netlify.com/signup).

2. Connect your GitHub repository to Netlify:
   - Go to [Netlify](https://app.netlify.com/)
   - Click "New site from Git"
   - Select GitHub and authorize Netlify
   - Select your repository

3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Advanced build settings" and add the following environment variables:
     - `DATABASE_URL`: Your PostgreSQL database URL (You can use [Supabase](https://supabase.com/) for a free PostgreSQL database)
     - `SESSION_SECRET`: A random string for session encryption

4. Deploy:
   - Click "Deploy site"

5. Set up a database:
   - Create a PostgreSQL database (e.g., on Supabase)
   - Run the database schema migrations by executing `npm run db:push` locally after setting your DATABASE_URL

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your_postgres_connection_string
   SESSION_SECRET=your_random_string
   ```
4. Run the development server: `npm run dev`

## Project Structure

- `client/`: React frontend code
  - `src/components/`: UI components
  - `src/pages/`: Application pages
  - `src/lib/`: Utilities and helpers
  - `src/features/`: Feature-specific code
- `server/`: Express.js backend code
- `shared/`: Shared code between frontend and backend
- `netlify/functions/`: Serverless functions for Netlify deployment

## Database Schema

The application uses the following main tables:
- `users`: User accounts
- `wallets`: Cryptocurrency wallets
- `transactions`: Transaction records
- `kyc`: KYC verification data
- `login_history`: User login records

## License

Copyright © 2025 AUTTOBI. All rights reserved.