# 🍽️ Meal Planner

A modern, beautiful, and intuitive meal planning mobile app built with **Expo Router**, **React Native**, and **TypeScript**.

Plan your weekly meals, add dishes by meal type (Breakfast, Lunch, Dinner), copy meals between days, and manage your menu effortlessly.

## ✨ Features

- **Weekly View** — Clean calendar-style layout showing 3 weeks
- **Daily Meal Planning** — Add, view, and organize dishes by Breakfast, Lunch, and Dinner
- **Dish Categories** — Staple, Main, Side, Soup
- **Copy Meals** — Easily copy a day's menu to the next day
- **Delete Functionality** — Remove entire day menus or individual dishes
- **Dark Mode Support** — Fully responsive to system appearance
- **Modern UI** — Beautiful cards, floating action button, smooth animations
- **Backend Integration** — Ready to connect with your Node.js/Express API

## 🚀 Tech Stack

- **Framework**: Expo (React Native)
- **Navigation**: Expo Router (File-based routing)
- **Language**: TypeScript
- **Styling**: StyleSheet with modern design system
- **HTTP Client**: Axios
- **Date Handling**: dayjs
- **Modals**: Native modal presentation

## 📱 Screenshots

*(Add screenshots here once you have them)*

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- Expo CLI
- Yarn or npm

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/meanev56/meal-planner.git
   cd meal-planner
2. Install dependencies
   npm install

# or

yarn install

1. Fix Axios compatibility issue
Fix Axios compatibility issueBashnpm install axios@1.7.2
Start the development serverBashnpx expo start
Run on device/emulator
Press a for Android
Press i for iOS
Scan QR code with Expo Go app

📁 Project Structure
textapp/
├── _layout.tsx                 # Root layout with Stack + Modals
├── index.tsx                   # Home Screen (Weekly View)
├── menu.tsx                    # Menu Screen (Add/Edit dishes)
├── copy-modal.tsx              # Copy menu modal
└── delete-modal.tsx            # Delete confirmation modal

components/                     # (Optional future folder)
api/                            # (Recommended for future)
🔌 Backend API Endpoints
The app expects the following endpoints:

GET /menu/all — Fetch all menu data
POST /menu/addDish — Add a new dish
DELETE /deleteItems/:date — Delete all items for a specific date
POST /copyItems — Copy items from one date to another

Example request body for /copyItems:
JSON{
  "prevDate": "Mon 15",
  "nextDate": "Tue 16"
}
🎨 Design Highlights

Floating Action Button (FAB) for quick meal addition
Per-day quick add buttons
Smooth modal animations
Consistent color scheme (#FF6B6B accent)
Responsive dark/light mode

🛠️ Future Enhancements

 Recipe details and ingredients
 Shopping list generation
 Drag & drop to reorder dishes
 Meal images
 Notifications & reminders
 Export/Import meal plans
 User authentication

📄 License
This project is open source and available under the MIT License.

Made with ❤️ for food lovers
text---
