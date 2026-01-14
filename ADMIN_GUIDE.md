# Quick Admin Guide - CEMAC AI Chatbot

## For Administrators

### Accessing the Admin Dashboard

1. Navigate to `/admin/login` on the application
2. Enter the admin secret key (stored in environment variables)
3. You'll be redirected to the admin dashboard

### Key Features

**Dashboard Overview** (`/admin`)
- View real-time statistics: total users, active users, whitelisted IPs, access attempts, and chat sessions
- Quick access to all management sections

**User Management** (`/admin/users`)
- View all registered users
- See user details: email, name, creation date, last login, status
- Search users by email or name

**IP Whitelist Management** (`/admin/ip-whitelist`)
- **Adding a new IP**: Click "Add IP Address", enter the IP and optional description, click "Add"
- **Activating/Deactivating**: Toggle the switch next to any IP address
- **Removing**: Deactivate an IP to block access (or delete if needed)
- Only whitelisted IPs can access the application

**Access Logs** (`/admin/access-logs`)
- View all access attempts (both granted and denied)
- See device information: browser, OS, device type
- Filter by date range or access status
- Monitor security and track who's trying to access the system

**Chat Sessions** (`/admin/sessions`)
- View all active chat sessions
- Click on a session to see full chat history
- Monitor user interactions with the AI
- Track message counts per session

### Important Notes

- **IP Whitelisting is Required**: Users must have their IP address whitelisted before they can access the application
- **Two-Layer Security**: Users need both a whitelisted IP AND a valid login account
- **Access Logs**: All access attempts are automatically logged, even denied ones
- **Session Tracking**: Each user gets a unique session ID that persists across page refreshes

### Quick Workflow for New Users

1. User signs up at `/signup` (but can't access yet)
2. Admin adds their IP address in `/admin/ip-whitelist`
3. User can now log in and use the chat interface

### Logout

Click the "Logout" button in the top-right corner of any admin page to securely log out.
