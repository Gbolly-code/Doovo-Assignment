// src/screens/BookingsScreen.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BookingsScreen from "./BookingsScreen";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(() => Promise.resolve("fake-jwt-token")),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(() => ({ userId: 123, name: "Test User" })),
}));

// Mock API module
jest.mock("../api", () => ({
  api: {
    get: jest.fn(() =>
      Promise.resolve({
        data: [{ id: 1, type: "dropoff", status: "pending" }],
      })
    ),
  },
}));

describe("BookingsScreen", () => {
  it("renders booking data from API", async () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <BookingsScreen />
      </QueryClientProvider>
    );

    // Check that mocked booking appears
    const bookingItem = await screen.findByText(/#1 - dropoff \(pending\)/i);
    expect(bookingItem).toBeTruthy();

    // Check that title renders too
    const title = await screen.findByText(/bookings/i);
    expect(title).toBeTruthy();
  });
});
