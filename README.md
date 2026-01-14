updat# CEMAC AI Chatbot

A secure, IP-whitelisted AI chatbot application built with Next.js and Supabase, featuring comprehensive admin controls and real-time chat capabilities.

## Overview

The CEMAC AI Chatbot is a production-ready web application that provides an AI-powered chat interface for CEMAC Doors. The application implements a two-layer security system (IP whitelisting + user authentication) and includes a comprehensive admin dashboard for managing users, IP addresses, access logs, and chat sessions.

## Features

### User Features
- **AI Chat Interface**: Interactive chat with AI assistant powered by n8n webhook integration
- **User Authentication**: Secure login/signup using Supabase Auth
- **Session Management**: Persistent chat sessions with message history
- **Device Fingerprinting**: Browser fingerprinting for enhanced security tracking
- **Responsive Design**: Modern, polished UI with Tailwind CSS

### Admin Features
- **Dashboard Analytics**: Overview of users, IPs, access logs, and chat sessions
- **User Management**: View and manage registered users
- **IP Whitelist Management**: Add, remove, and activate/deactivate IP addresses
- **Access Logs**: Monitor all access attempts (granted/denied) with device information
- **Chat Session Monitoring**: View active sessions and chat history
- **Admin Authentication**: Separate admin login with secret key protection

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **AI Integration**: n8n webhook
- **Device Detection**: FingerprintJS, ua-parser-js

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- n8n webhook URL (for AI responses)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cemac-ai-chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ADMIN_SECRET_KEY=your_admin_secret_key
   ```

4. **Set up Supabase database**
   
   You'll need to create the following tables in your Supabase database:
   - `ip_whitelist` - Stores whitelisted IP addresses
   - `access_logs` - Logs all access attempts
   - `chat_sessions` - Tracks chat sessions
   - `chat_history` - Stores chat messages
   - User profiles (handled by Supabase Auth)

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

### User Application Flow

The user-facing application operates through a secure, multi-layered authentication system. When a user attempts to access the application, the middleware first checks if their IP address is whitelisted in the database. If not whitelisted, they are immediately redirected to an access-denied page, and the attempt is logged with device information (browser, OS, device type). If the IP is whitelisted, the system then verifies user authentication through Supabase Auth - unauthenticated users are redirected to the login page. Once authenticated, users can access the main chat interface where they interact with an AI assistant. Each chat message is sent to a Next.js API route that forwards it to an n8n webhook for AI processing, stores the conversation in Supabase (both user messages and AI responses), and tracks session activity. The application uses browser fingerprinting to uniquely identify devices and maintains persistent chat sessions stored in localStorage, allowing users to continue conversations across page refreshes.

### Admin Dashboard Flow

The admin dashboard provides comprehensive management capabilities through a separate authentication layer. Administrators log in through a dedicated admin login page that validates a secret admin key stored in environment variables. Once authenticated, admins can access a dashboard showing real-time statistics including total users, active users, whitelisted IPs, access attempts (granted vs denied), active chat sessions, and total messages. The admin interface includes dedicated pages for user management (viewing all registered users with search functionality), IP whitelist management (adding new IPs, activating/deactivating existing ones, with descriptions), access log monitoring (viewing all access attempts with detailed device information and filtering capabilities), and chat session management (viewing active sessions and full chat histories). All admin actions are protected by middleware that verifies both the admin cookie and the secret key, ensuring only authorized personnel can access sensitive management features.

## Project Structure

```
cemac-ai-chatbot/
├── src/
│   ├── app/
│   │   ├── admin/              # Admin dashboard pages
│   │   │   ├── page.tsx        # Admin dashboard overview
│   │   │   ├── users/          # User management
│   │   │   ├── ip-whitelist/   # IP whitelist management
│   │   │   ├── access-logs/    # Access log viewer
│   │   │   ├── sessions/       # Chat session viewer
│   │   │   └── login/          # Admin login
│   │   ├── api/
│   │   │   ├── admin/          # Admin API routes
│   │   │   ├── auth/           # Authentication routes
│   │   │   └── chat/           # Chat API route
│   │   ├── components/         # React components
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatHeader.tsx
│   │   │   └── SuggestedQuestions.tsx
│   │   ├── login/              # User login page
│   │   ├── signup/             # User signup page
│   │   ├── access-denied/      # Access denied page
│   │   └── page.tsx            # Main chat page
│   ├── lib/
│   │   ├── supabase/           # Supabase client setup
│   │   └── utils/               # Utility functions
│   │       ├── ip-extractor.ts
│   │       ├── device-detection.ts
│   │       └── fingerprint-client.ts
│   ├── middleware.ts           # Next.js middleware (IP + auth checks)
│   └── env.js                   # Environment variable validation
├── public/                      # Static assets
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server with Turbo
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run typecheck` - Run TypeScript type checking
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code with Prettier

## Security Features

1. **IP Whitelisting**: Only whitelisted IP addresses can access the application
2. **User Authentication**: Supabase Auth for secure user sessions
3. **Admin Protection**: Separate admin authentication with secret key
4. **Access Logging**: All access attempts are logged with device information
5. **Device Fingerprinting**: Unique device identification for security tracking
6. **Middleware Protection**: Route-level security checks before page rendering

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous key | Yes |
| `ADMIN_SECRET_KEY` | Secret key for admin authentication | Yes |

## Database Schema

The application requires the following Supabase tables:

- **ip_whitelist**: IP addresses allowed to access the app
- **access_logs**: Logs of all access attempts
- **chat_sessions**: User chat session tracking
- **chat_history**: Stored chat messages (user and assistant)

## Deployment

The application can be deployed to platforms like Vercel, Netlify, or any Node.js hosting service. Make sure to:

1. Set all environment variables in your hosting platform
2. Configure your Supabase project for production
3. Update the n8n webhook URL in `/src/app/api/chat/route.ts` if needed
4. Ensure your database migrations are applied

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.
