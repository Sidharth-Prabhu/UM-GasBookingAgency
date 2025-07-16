# Gas Agency Booking System

A web-based gas cylinder booking system built with HTML, CSS, JavaScript, and Firebase. Supports user and admin accounts, user registration, cylinder booking, payment options (Cash on Delivery, Paytm QR), booking history, and email notifications.

## Features
- **User and Admin Accounts**: Separate logins for users and admins. Admins can verify user info and manage booking requests.
- **User Registration**: Users must register with name, email, and password before using the system.
- **Cylinder Booking**: Users can book cylinders with payment options (Cash on Delivery or Paytm QR).
- **Booking History**: Users can view their booking history.
- **Email Notifications**: Users receive emails for account creation, booking confirmations, and admin actions (mocked in code).
- **Admin Dashboard**: Admins can approve/deny bookings and view user details.

## Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase (Authentication, Firestore, Hosting)
- **Dependencies**: Firebase SDK (v10.12.2)

## Project Structure
```
gas-booking-system/
├── index.html          # Login page
├── register.html       # User registration page
├── user.html           # User dashboard
├── admin.html          # Admin dashboard
├── styles.css          # CSS styles
├── firebase.js         # Firebase configuration
├── auth.js             # Authentication logic
├── user.js             # User dashboard logic
├── admin.js            # Admin dashboard logic
├── firebase.json       # Firebase hosting configuration
```

## Prerequisites
- Node.js
- Firebase CLI (`npm install -g firebase-tools`)
- Firebase project with Authentication, Firestore, and Hosting enabled
- Paytm QR code image or API integration for payments

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gas-booking-system.git
cd gas-booking-system
```

### 2. Configure Firebase
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Authentication (Email/Password), Firestore, and Hosting.
3. Update `firebase.js` with your Firebase project configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
4. (Optional) Set up Firebase Cloud Functions for email notifications (e.g., using SendGrid).

### 3. Run Locally
1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
2. Log in to Firebase:
   ```bash
   firebase login
   ```
3. Start Firebase Emulator:
   ```bash
   firebase emulators:start
   ```
4. Install and run a local server:
   ```bash
   npm install -g http-server
   http-server -p 8080
   ```
5. Open `http://localhost:8080` in your browser.

### 4. Deploy to Firebase
1. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   Select your Firebase project and set the public directory to `./`.
2. Deploy:
   ```bash
   firebase deploy
   ```
3. Access the app at the provided Firebase Hosting URL.

## Firebase Configuration
- **Firestore Structure**:
  - `users` collection: `{ uid: { name, email, role (user/admin), balance } }`
  - `bookings` collection: `{ userId, cylinders, paymentMethod, cost, status (pending/approved/denied), timestamp }`
- **Security Rules**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /users/{userId} {
        allow read: if request.auth != null && (request.auth.uid == userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
        allow write: if request.auth != null && request.auth.uid == userId;
      }
      match /bookings/{bookingId} {
        allow read, write: if request.auth != null && (request.auth.uid == resource.data.userId || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      }
    }
  }
  ```

## Notes
- **Email Notifications**: The `sendEmail` function is a placeholder. Integrate with Firebase Cloud Functions and a service like SendGrid for production.
- **Paytm QR**: Replace `paytm-qr.png` with your Paytm QR code or integrate with Paytm API.
- **Admin Account**: Manually set a user’s `role` to `admin` in Firestore for admin access.
- **Testing**: Use Firebase Emulator Suite for local testing to avoid production costs.

## Troubleshooting
- Check browser console for errors.
- Verify Firebase configuration and emulator ports (`8080` for Firestore, `9099` for Authentication).
- Ensure `paytm-qr.png` exists or update `user.html` with a valid image path.

## Author
Sidharth P L
