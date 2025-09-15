# Doovo – Laundry Booking App

## Overview
Doovo is a laundry booking platform where:
- Customers can create bookings (`dropoff` or `pickup_return`).
- Washers can update booking statuses through the flow:

This repository contains:
- **Backend**: NestJS API (`/backend`)
- **Frontend**: React Native (Expo) app (`/mobile-app`)

## 🌐 Hosted API
- **Base URL**: https://your-api-domain.com/api
- **Swagger Docs**: https://your-api-domain.com/api/docs

## 👤 Test Users
Use these demo accounts to log in and test flows:

**Customer**
email: customer@test.com
password: 1234

**Washer**
email: washer@test.com
password: 1234


---

## 🚀 Run Locally

## Backend

cd backend
npm install
npm run start:dev
API available at: https://doovo-assignment-production.up.railway.app/api
Swagger docs: https://doovo-assignment-production.up.railway.app/api/docs

**Frontend**
cd mobile-app
npm install
npx expo start
scan QR code with Expo Go (on iOS/Android) or run in emulator.

**TESTS**
Backend

cd backend
npm run test:e2e

Frontend

cd mobile-app
npm test

**Tradeoffs & Notes**

**In-memory DB**
Bookings are currently stored in memory (reset on restart). This was chosen for simplicity during MVP development.
Next step: use PostgreSQL + Prisma for persistence.

**Auth**
JWT authentication implemented. For testing purposes, AsyncStorage and JWT are mocked in frontend tests.

**CI/CD**
Not yet implemented, but repo is structured to easily add GitHub Actions or similar.

**UI/UX**
Focused on core functionality first. Future improvements can polish the UX/UI experience.





