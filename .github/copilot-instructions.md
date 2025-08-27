# TaskFlow — AI Feature Generation Demo

Modern task management app built with Next.js 14, React, TypeScript, Prisma, and shadcn/ui components.

**ALWAYS follow these instructions first and fallback to additional search and context gathering only if the information in these instructions is incomplete or found to be in error.**

## Working Effectively

### Bootstrap and Dependencies
- **Node.js requirement**: Version 18 or greater (tested with v20.19.4)
- **Install dependencies**: `npm install` — takes 30 seconds, installs 484 packages. NEVER CANCEL.

### Development Server
- **Start development**: `npm run dev` — Ready in ~1 second. NEVER CANCEL.
- **TIMING**: Compilation ~2-3 seconds, full ready state ~1 second
- **Verify**: Application loads at http://localhost:3000 (redirects to /login)

### Database Setup
- **Database file**: SQLite at `prisma/app.db`
- **Setup command**: `npm run db:setup` — Generates Prisma client, creates database, and seeds test data
- **Schema location**: `prisma/schema.prisma` contains complete database structure
- **Manual operations**: Use `npx prisma generate`, `npx prisma db push`, `npm run db:seed` individually

### Linting and Code Quality
- **Lint code**: `npm run lint` — Completes in 5-10 seconds
- **Expected warnings**: 14 warnings, 3 errors in baseline (document only, don't fix unrelated issues)
- **ALWAYS run before committing**: Linting passes CI requirements

### Build Process
- **Build command**: `npm run build`
- **Note**: Build fails due to ESLint errors in generated Prisma client files (expected)
- **Development**: Use `npm run dev` for active development
- **Linting**: Generated Prisma files contain expected linting violations

## Validation Scenarios

### ALWAYS manually validate changes via these scenarios:
1. **Application startup**: `npm run dev` → Navigate to http://localhost:3000
2. **Login page access**: Verify redirect to `/login` and form renders
3. **Signup page access**: Navigate to `/signup` and verify form renders
4. **Navigation flow**: Test basic routing between login/signup pages
5. **Component loading**: Verify UI components load properly
6. **Database functionality**: Test task creation, editing, and listing after login

### NEVER CANCEL warnings:
- `npm install`: May take up to 45 seconds depending on network
- `npm run dev`: Ready in ~1 second, very fast startup
- Prisma operations: Work normally for database setup and generation

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

## Development Environment

### Environment Status
- **Network Access**: Full access enabled (Prisma binaries, Google Fonts, external resources)
- **Database Operations**: All Prisma commands work normally
- **Build Process**: Font downloads work, build fails due to expected ESLint errors in generated files
- **Development Server**: Fast startup, no external resource warnings

### Key Operations
- **Database setup**: `npm run db:setup` works fully (generates client, creates DB, seeds data)
- **Prisma client**: Generated at `app/generated/prisma/` via `npx prisma generate`
- **Development workflow**: Standard Next.js development with full database functionality

## Default Test Credentials
- **Email**: `alice@example.com`
- **Password**: `password123`
- **Note**: Database is seeded with test users and tasks via `npm run db:setup`

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
- Build process has access to external resources but fails on ESLint errors in generated files
- Database operations work normally with full Prisma functionality
- Development server starts quickly with no external resource warnings