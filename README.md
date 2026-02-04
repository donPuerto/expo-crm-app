# Expo CRM App 👋

This is an [Expo](https://expo.dev) CRM application built with Expo SDK 54, React Native 0.81, and Tamagui v2 for cross-platform UI.

## 🚀 Tech Stack

- **Expo SDK 54** - Latest Expo framework
- **React 19** with new architecture enabled
- **Expo Router 6** - File-based navigation with typed routes
- **Tamagui v2** - Cross-platform styling and UI components
- **Supabase** - Backend and authentication
- **Zustand** - Global state management
- **TypeScript** - Strict mode with path aliases

## 🎨 Animation System

This app uses Tamagui's animation system with platform-specific drivers:

- **Web**: Motion driver (off-thread WAAPI)
- **Native**: Reanimated driver (off-thread native)

**📚 Animation Documentation**: See [docs/ANIMATIONS-INDEX.md](./docs/ANIMATIONS-INDEX.md) for complete guide

Quick examples:

- Image galleries with swipe animations
- Modals with enter/exit transitions
- Page transitions for navigation
- Interactive button animations

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 📁 Project Structure

```
expo-crm-app/
├── app/                      # Expo Router routes
│   ├── (auth)/               # Auth routes
│   ├── (crm)/                # CRM routes
│   ├── (dashboards)/         # Dashboard routes
│   ├── (tabs)/               # Tab navigator
│   └── (modals)/             # Modal routes
├── src/
│   ├── server/               # Backend/API layer (Supabase)
│   ├── database/             # Database types and migrations
│   ├── features/             # Feature modules (auth, dashboard, etc.)
│   ├── interface/            # UI components and transitions
│   │   ├── components/       # Shared UI components
│   │   ├── primitives/       # Base UI primitives
│   │   ├── hooks/            # Custom hooks
│   │   └── transitions.ts    # Animation exports
│   ├── tamagui/              # Tamagui configuration
│   │   ├── tamagui.config.ts # Main config
│   │   ├── animations.ts     # Web animations (Motion)
│   │   └── animations.native.ts # Native animations (Reanimated)
│   └── hooks/                # App-wide hooks
├── docs/                     # Documentation
│   ├── ANIMATIONS-INDEX.md   # Animation docs index
│   └── ...                   # Other guides
└── assets/                   # Static assets
```

## 📚 Documentation

### Animation System

- **[Animation Index](./docs/ANIMATIONS-INDEX.md)** - Start here for animations
- **[Quick Reference](./docs/ANIMATION-QUICK-REFERENCE.md)** - Copy-paste examples
- **[Complete Guide](./docs/ANIMATIONS-GUIDE.md)** - In-depth patterns

### Architecture & Setup

- **[Tamagui Migration Plan](./docs/TAMAGUI-MIGRATION-PLAN.md)** - Migration roadmap
- **[Route Structure](./docs/ROUTE-STRUCTURE.md)** - Navigation architecture
- **[Tools Setup](./docs/TOOLS-SETUP.md)** - Development tools

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
- [Tamagui documentation](https://tamagui.dev/docs): Learn about the UI framework and animations.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
- [Tamagui Discord](https://discord.gg/4qh6tdcVDa): Get help with Tamagui and animations.
