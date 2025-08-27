# TaskFlow — AI Feature Generation Demo

Modern task management app built with Next.js 14, React, TypeScript, Prisma, and shadcn/ui components.

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in these instructions is incomplete or found to be in error.**

## Working Effectively

### Bootstrap and Dependencies
- **Node.js requirement**: Version 18 or greater (tested with v20.19.4)
- **Install dependencies**: `npm install` — takes 30 seconds, installs 484 packages. NEVER CANCEL.
- **CRITICAL**: Network restrictions may prevent external downloads. Common failures:
  - Prisma binary downloads fail with `ENOTFOUND binaries.prisma.sh`
  - Google Fonts fail with `ENOTFOUND fonts.googleapis.com`
  - These are environmental limitations, not code issues

### Development Server
- **Start development**: `npm run dev` — Ready in 60-90 seconds. NEVER CANCEL.
- **TIMING**: Compilation ~2-3 seconds, full ready state ~60 seconds with font warnings
- **Expected warnings**: Google Fonts download failures (fallback fonts used automatically)
- **Verify**: Application loads at http://localhost:3000 (redirects to /login)

### Database Setup
- **Database file**: SQLite at `prisma/app.db`
- **NETWORK LIMITATION**: `npm run db:setup` fails due to Prisma binary restrictions
- **Schema location**: `prisma/schema.prisma` contains complete database structure
- **Workaround for development**: Create mock Prisma client in `app/generated/prisma/`
- **Manual validation**: App functions without database by redirecting to login page

### Linting and Code Quality
- **Lint code**: `npm run lint` — Completes in 5-10 seconds
- **Expected warnings**: 14 warnings, 3 errors in baseline (document only, don't fix unrelated issues)
- **ALWAYS run before committing**: Linting passes CI requirements

### Build Process
- **Build command**: `npm run build`
- **NETWORK LIMITATION**: Fails due to Google Fonts download restrictions
- **Status**: Build cannot complete in network-restricted environments
- **Workaround**: Development server works with fallback fonts

## Validation Scenarios

### ALWAYS manually validate changes via these scenarios:
1. **Application startup**: `npm run dev` → Navigate to http://localhost:3000
2. **Login page access**: Verify redirect to `/login` and form renders
3. **Signup page access**: Navigate to `/signup` and verify form renders
4. **Navigation flow**: Test basic routing between login/signup pages
5. **Component loading**: Verify UI components load despite font warnings

### NEVER CANCEL warnings:
- `npm install`: May take up to 45 seconds depending on network
- `npm run dev`: Initial compilation may take 90 seconds with external resource warnings
- Any Prisma operations: Will fail in restricted environments but app still functions

## Repository Structure and Patterns

### Key directories:
- `/app` — Next.js 14 App Router structure
- `/app/(dashboard)` — Main application pages (tasks, board, team)
- `/components` — Reusable UI components using shadcn/ui
- `/components/ui` — Base UI component library
- `/prisma` — Database schema and seed/clear scripts
- `/lib` — Utility functions and shared logic

### Important files:
- `package.json` — Dependencies and npm scripts
- `prisma/schema.prisma` — Complete database schema (User, Task, Session models)
- `app/(dashboard)/tasks/actions.ts` — Server actions for task management
- `components/task-list.tsx` — Main task display component

### Coding patterns:
- **Server Actions**: Use "use server" directive for database operations
- **Client Components**: Use "use client" for interactive UI
- **shadcn/ui**: Import components from `@/components/ui/`
- **Type Safety**: All database models typed via Prisma generated client
- **Authentication**: Cookie-based sessions via `app/login/actions.ts`

### Database Models:
```typescript
// User: id, email, password, name
// Task: id, name, description, priority, status, dueDate, assigneeId, creatorId
// Session: id, token, userId, createdAt
```

## Common Tasks

### Adding new task features:
1. Update `app/(dashboard)/tasks/actions.ts` for server actions
2. Modify `components/task-list.tsx` for UI changes
3. Update types in Prisma schema if needed
4. Test via `/tasks` page after login

### UI component changes:
1. Import shadcn/ui components from `@/components/ui/`
2. Follow existing patterns in `components/` directory
3. Use Tailwind for styling
4. Test responsive behavior

### Authentication changes:
1. Modify `app/login/actions.ts` for auth logic
2. Update session handling as needed
3. Test login/logout flow thoroughly

## Network Limitations and Workarounds

### Known failures in restricted environments:
- **Prisma binary downloads**: `npx prisma generate` fails
- **Google Fonts**: Build fails, dev server shows warnings but works
- **Database seeding**: Cannot download Prisma binaries for full setup

### Development workarounds:
- Use mock Prisma client for development
- Accept font fallbacks (application functions normally)
- Focus on code structure and component behavior
- Validate UI functionality over data persistence

### Production considerations:
- All commands work in unrestricted environments
- Database setup requires network access for Prisma binaries
- Build process requires access to fonts.googleapis.com

## Default Test Credentials
- **Email**: `alice@example.com`
- **Password**: `password123`
- **Note**: Database seeding may not work in restricted environments

## Frequently Accessed Files
```
app/(dashboard)/tasks/page.tsx — Main tasks page
components/task-list.tsx — Task display logic  
app/(dashboard)/tasks/actions.ts — Task server actions
prisma/schema.prisma — Database schema
components/ui/ — UI component library
package.json — Project configuration
```

## CI/CD Considerations
- Always run `npm run lint` before committing
- Build process requires unrestricted network access
- Database operations require Prisma binary access
- Font warnings are acceptable in development