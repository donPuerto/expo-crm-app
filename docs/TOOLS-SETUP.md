# Recommended Tools & Extensions

## VS Code Extensions

### Install All at Once

Open VS Code terminal and run:

```bash
code --install-extension expo.vscode-expo-tools
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension usernamehw.errorlens
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension eamodio.gitlens
code --install-extension pkief.material-icon-theme
code --install-extension msjsdiag.vscode-react-native
```

### Extension Details

#### Essential for Expo

- **Expo Tools** - Debugging, IntelliSense, code actions
- **ES7+ React Snippets** - Quick component creation
- **ESLint** - Code quality checks
- **Prettier** - Auto-formatting

#### Productivity Boosters

- **Error Lens** - See errors inline (highly recommended!)
- **Auto Rename Tag** - Sync opening/closing tags
- **Path Intellisense** - Autocomplete imports
- **GitLens** - Enhanced Git features

#### UI Enhancements

- **Material Icon Theme** - Better file/folder icons
- **React Native Tools** - Enhanced debugging for RN

## Development Tools Checklist

### Required

- [ ] Node.js 18+ installed
- [ ] npm or yarn working
- [ ] Git installed
- [ ] VS Code installed
- [ ] Expo CLI accessible (`npx expo --version` works)

### Platform-Specific

- [ ] **Android:** Android Studio + Emulator configured
- [ ] **iOS (Mac only):** Xcode + iOS Simulator
- [ ] **Quick Testing:** Expo Go app on phone

### Optional but Recommended

- [ ] EAS CLI (`npm install -g eas-cli`)
- [ ] React DevTools browser extension
- [ ] Prettier extension configured
- [ ] ESLint extension active

## Quick Setup Commands

### First-Time Setup

```bash
# 1. Install Node.js from https://nodejs.org

# 2. Verify installation
node -v
npm -v

# 3. Clone/navigate to project
cd expo-crm-app

# 4. Install dependencies
npm install

# 5. Start development
npm start
```

### VS Code Setup

```bash
# Open project in VS Code
code .

# Install recommended extensions (when prompted)
# Or use the commands listed above
```

### Optional Tools

```bash
# EAS CLI for cloud builds
npm install -g eas-cli

# Yarn (alternative package manager)
npm install -g yarn

# Flipper (advanced debugging)
# Download from: https://fbflipper.com
```

## Troubleshooting Tools

### Check Installation

```bash
npx expo-doctor
```

This checks for common issues with your Expo setup.

### Clear Cache (if things break)

```bash
npx expo start --clear
```

### Reset Everything

```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Resources

- **Expo Docs:** https://docs.expo.dev
- **VS Code Expo:** https://docs.expo.dev/more/vscode
- **React Native Docs:** https://reactnative.dev
- **Expo Discord:** https://chat.expo.dev
