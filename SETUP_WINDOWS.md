# Setup Guide for Window

This guide will help you set up and run the CEMAC AI Chatbot project on Windows.

## Prerequisites

1. **Node.js**: You need Node.js installed (v18 or higher recommended)
   - Check if you have it: Open Command Prompt (not PowerShell) and type `node --version`
   - If not installed, download from: https://nodejs.org/
   - Choose the LTS (Long Term Support) version

2. **npm**: Comes with Node.js, verify with `npm --version`

## Step-by-Step Setup

### Step 1: Open Command Prompt (CMD)

**Important**: Use **Command Prompt (cmd)** instead of PowerShell to avoid execution policy issues.

- Press `Windows Key + R`
- Type `cmd` and press Enter
- Or search for "Command Prompt" in the Start menu
- Navigate to your project folder:
  ```cmd
  cd C:\Users\Zimraan-AllinITSolut\Documents\Dev\cemac-ai-chatbot
  ```

### Step 2: Install Dependencies

In Command Prompt, run:
```cmd
npm install
```

This will install all the required packages (Next.js, React, etc.). This may take a few minutes.

**Note**: If you see any warnings, that's usually okay. Only stop if you see errors.

### Step 3: Run the Development Server

After installation completes, start the development server:
```cmd
npm run dev
```

You should see output like:
```
✓ Ready in X seconds
○ Local:        http://localhost:3000
```

### Step 4: Open in Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

You should see the chatbot interface!

## Common Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Run production build**: `npm run start`
- **Check for errors**: `npm run typecheck`
- **Format code**: `npm run format:write`

## Troubleshooting

### Issue: "next is not recognized"
**Solution**: Dependencies aren't installed. Run `npm install` first.

### Issue: Port 3000 already in use
**Solution**: The port is already being used. Either:
- Stop the other application using port 3000
- Or set a different port: `npm run dev -- -p 3001`

### Issue: PowerShell execution policy errors
**Solution**: Use Command Prompt (cmd) instead of PowerShell for npm commands.

### Issue: Permission errors
**Solution**: 
- Make sure you're running Command Prompt as Administrator (right-click → Run as administrator)
- Or install dependencies without admin: `npm install --no-optional`

## Differences from Mac

- Use `cmd` instead of Terminal
- Use backslashes `\` in paths (Windows does this automatically)
- Use `npm` commands the same way
- File paths are case-insensitive (unlike Mac/Linux)

## Environment Variables

This project doesn't require any environment variables to run in development mode. The webhook URL is hardcoded in the API route.

## Stopping the Server

To stop the development server, press `Ctrl + C` in the Command Prompt window.
