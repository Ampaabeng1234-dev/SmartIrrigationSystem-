# Visual Studio Code Setup Guide

This guide will help you run the Smart Irrigation Management System in Visual Studio Code with optimal development experience.

## Prerequisites

1. **Visual Studio Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)
2. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
3. **PostgreSQL** - Local installation or cloud database

## Step 1: Open Project in VS Code

```bash
# Navigate to project folder
cd smart-irrigation-system

# Open in VS Code
code .
```

## Step 2: Install Recommended Extensions

VS Code will automatically suggest installing recommended extensions. Click "Install All" when prompted, or install manually:

- **TypeScript and JavaScript Language Features**
- **Tailwind CSS IntelliSense**
- **Prettier - Code formatter**
- **Path Intellisense**
- **Auto Rename Tag**

## Step 3: Setup Environment

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your database credentials:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/irrigation_db
   SESSION_SECRET=your-super-secure-random-string
   ```

## Step 4: Install Dependencies

Use VS Code's integrated terminal (`Ctrl+` ` or `View > Terminal`):

```bash
npm install
```

Or use the VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "Install Dependencies"

## Step 5: Initialize Database

```bash
npm run db:push
```

Or use VS Code task: `Ctrl+Shift+P` → "Tasks: Run Task" → "Database Push"

## Step 6: Start the Application

### Method 1: Using VS Code Tasks (Recommended)
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "Start Development Server"

### Method 2: Using Terminal
```bash
npm run dev
```

### Method 3: Using Debug Mode
1. Press `F5` or go to "Run and Debug" panel
2. Select "Start Smart Irrigation App"
3. Click the green play button

## Step 7: Access the Application

Open your browser and go to: **http://localhost:5000**

**Login Credentials:**
- Username: `Samuel`
- Password: `Alpha@22`

## VS Code Features Configured

### IntelliSense & Auto-completion
- TypeScript support for both frontend and backend
- Tailwind CSS class suggestions
- Path auto-completion for imports
- React component IntelliSense

### Debugging
- Full debugging support with breakpoints
- Server-side debugging configured
- Integrated terminal for logs

### Code Formatting
- Prettier formatting on save
- Auto-organize imports
- Consistent code style

### Tasks Available
Access via `Ctrl+Shift+P` → "Tasks: Run Task":
- **Start Development Server** - Runs `npm run dev`
- **Build for Production** - Runs `npm run build`
- **Database Push** - Runs `npm run db:push`
- **Open Database Studio** - Runs `npm run db:studio`
- **Install Dependencies** - Runs `npm install`

## Useful VS Code Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+` ` | Open integrated terminal |
| `F5` | Start debugging |
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+Shift+E` | File explorer |
| `Ctrl+Shift+G` | Source control |
| `Ctrl+Shift+D` | Debug panel |
| `Ctrl+Shift+X` | Extensions |

## Project Structure in VS Code

```
smart-irrigation-system/
├── .vscode/              # VS Code configuration
│   ├── settings.json     # Editor settings
│   ├── launch.json       # Debug configuration
│   ├── tasks.json        # Task definitions
│   └── extensions.json   # Recommended extensions
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── lib/          # Utilities
├── server/               # Express backend
│   ├── services/         # Business logic
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── auth.ts           # Authentication
├── shared/               # Shared types
└── package.json          # Dependencies
```

## Development Workflow

1. **Start the server**: Use F5 or the "Start Development Server" task
2. **Make changes**: Files auto-reload on save
3. **Debug**: Set breakpoints and use F5 to debug
4. **Database changes**: Use "Database Push" task
5. **View database**: Use "Open Database Studio" task

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000
```

### TypeScript Errors
- Restart TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Database Connection Issues
- Check your `.env` file has correct `DATABASE_URL`
- Make sure PostgreSQL is running

### Extension Issues
- Reload VS Code: `Ctrl+Shift+P` → "Developer: Reload Window"

## Additional Tips

- Use the **Explorer** panel to navigate files quickly
- The **Problems** panel shows TypeScript errors and warnings
- Use **Source Control** panel for Git operations
- **Terminal** panel for running commands
- **Debug Console** for debugging output

Your Smart Irrigation Management System is now fully configured for VS Code development!