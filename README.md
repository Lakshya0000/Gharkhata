# GharKhata 📓

GharKhata is a React Native mobile application built with Expo that helps you manage your daily household finances entirely locally on your device. Whether it's tracking your daily milk deliveries, everyday expenses, or money lent and borrowed, GharKhata keeps everything organized in one place with a beautiful, fast, and offline-first experience.

## ✨ Features

*   **🥛 Milk Tracker**
    *   Log daily milk quantities and adjust rates per entry.
    *   Distinguish between Morning and Evening shifts.
    *   Automatically generate and manage monthly milk bills.
*   **💸 Expense Tracker**
    *   Record daily expenses with categories and notes.
    *   View your spending grouped by month.
*   **🤝 Lending & Borrowing**
    *   Keep track of money you've lent (Given) or borrowed (Taken).
    *   Mark entries as settled/paid.
*   **📊 Monthly Summary**
    *   Get a high-level overview of your total expenses and milk bills for any given month.
    *   View a unified transaction timeline.
*   **🌐 Bilingual Support**
    *   Fully localized in **English** and **Hindi** (हिंदी).
*   **🔔 Reminders**
    *   Set daily local notifications to remind you to log your expenses or milk.
*   **🔒 Privacy First (Offline)**
    *   Powered by a local SQLite database (via Drizzle ORM). Your financial data never leaves your device!

## 🛠️ Tech Stack

*   **Framework:** [React Native](https://reactnative.dev/) & [Expo](https://expo.dev/) (SDK 57)
*   **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
*   **Database:** [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
*   **ORM:** [Drizzle ORM](https://orm.drizzle.team/) (with live migrations)
*   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
*   **Localization:** [react-i18next](https://react.i18next.com/)
*   **Styling:** Custom Design System (`lib/theme.ts`)

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) installed on your machine.
*   [Android Studio](https://developer.android.com/studio) (for emulator testing) or the **Expo Go** app on your physical device.

### Installation

1.  **Clone the repository** (if applicable):
    ```bash
    git clone https://github.com/yourusername/GharKhata.git
    cd GharKhata
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npm start
    ```

4.  **Run the app**:
    *   Press `a` in the terminal to open on an Android Emulator.
    *   Scan the QR code with your Expo Go app (on Android) to run it on a physical device.

## 📦 Building the APK

You can build a standalone Android APK using EAS (Expo Application Services).

1.  Install the EAS CLI:
    ```bash
    npm install -g eas-cli
    ```
2.  Login to your Expo account:
    ```bash
    eas login
    ```
3.  Trigger the build:
    ```bash
    eas build -p android --profile preview
    ```
4.  Once the build finishes, EAS will provide a link to download the `.apk` file to install on your device.

## 📁 Project Structure

```text
GharKhata/
├── app/                  # Expo Router screens (Tabs, Modals, Settings)
├── assets/               # Splash screens, icons, and fonts
├── components/           # Reusable UI components (Cards, Inputs, etc.)
├── db/                   # Database configuration, schema, and queries
├── drizzle/              # Drizzle ORM generated SQL migrations
├── hooks/                # Zustand state stores and business logic
├── i18n/                 # Localization files (en.json, hi.json)
└── lib/                  # Utilities, theme tokens, and notifications
```

## 📜 License

This project is licensed under the MIT License.
