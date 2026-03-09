# React Native Expo App

This project is a React Native application built with **Expo**. This README explains how to set up your environment and run the app locally.

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (LTS recommended)
- **npm** or **yarn**
- **Expo CLI**

Install Expo CLI globally (optional):

```bash
npm install -g expo-cli
```

> You can also use `npx expo` without installing Expo globally.

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/FFPTech/Halisi-MobileApp.git
cd  Halisi-Mobile-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

---

## Running the App

Start the development server:

```bash
npx expo start
# or
npm start
# or
yarn start
```

This will open Expo Dev Tools in your browser.

---

## Running on a Device

### Physical Device

1. Install **Expo Go** from the App Store (iOS) or Google Play (Android)
2. Scan the QR code shown in the terminal or browser

### Emulator / Simulator

**iOS Simulator (macOS only):**

```bash
npx expo start --ios
```

**Android Emulator:**

```bash
npx expo start --android
```

Make sure the emulator is running before executing the command.

---

## Project Structure

```text
.
├── assets/          # Images, fonts, and static files
├── components/      # Reusable components
├── screens/         # App screens
├── App.js           # Root component
├── app.json         # Expo configuration
├── package.json     # Dependencies and scripts
```

---

## Environment Variables

If your app uses environment variables, create a `.env` file in the root directory:

```env
API_URL=https://example.com
```

Ensure environment variables are properly configured in Expo.

---

## Useful Commands

- Start dev server:

  ```bash
  npx expo start
  ```

- Clear cache:

  ```bash
  npx expo start -c
  ```

- Run tests (if applicable):
  ```bash
  npm test
  ```

---

## Building for Production

To build the app using **EAS**:

```bash
npm install -g eas-cli
eas build
```

## Features

The following features have been implemented and completed in this application:

### 1. Farmer & Livestock Registration Flow ✅

The registration flow consists of multiple steps, all of which have been completed:

#### Farmer Registration

- Login
- Farmer authentication
- Farmer biometrics capture

#### Livestock Registration

- Livestock registration
- Livestock biometrics capture

---

### 2. Verification ✅

The following verification processes have been completed:

- Farmer verification
- Livestock verification

---

### 3. Loan Request ❌

- Loan request feature  
  _(Not implemented yet)_

## Next Steps

The following items are planned for the next phase of the application:

### 1. Loan Request

- Implement loan request flow
- Capture and validate loan details
- Submit loan request for processing

### 2. Code Quality Improvements

- Code cleaning
- Performance optimization
- Refactoring for maintainability and scalability

### 3. Deployment

- Prepare production build
- Deploy application to **Google Play Store**

## Troubleshooting

- Ensure Node.js is up to date
- Clear Expo cache if issues occur
- Restart Expo Go or the emulator

---

## Learn More

- https://docs.expo.dev/
- https://reactnative.dev/

---

## License

Add your license information here.
