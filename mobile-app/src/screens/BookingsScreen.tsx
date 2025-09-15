import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";

type JwtPayload = { sub: number; email: string; role: "customer" | "washer" };

export default function BookingsScreen() {
  const [selectedType, setSelectedType] = useState<"dropoff" | "pickup_return">(
    "dropoff"
  );
  const [role, setRole] = useState<"customer" | "washer">("customer");
  const queryClient = useQueryClient();

  // Get role from token on mount
  useEffect(() => {
    const getRole = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded: JwtPayload = jwtDecode(token);
        setRole(decoded.role);
      }
    };
    getRole();
  }, []);

  // Query: get all bookings
  const {
    data: bookings,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const res = await api.get("/bookings");
      return res.data;
    },
  });

  // Mutation: create a new booking (customer only)
  const createBooking = useMutation({
    mutationFn: async () => {
      const res = await api.post("/bookings", { type: selectedType });
      return res.data;
    },
    onSuccess: () => {
      alert("Booking created!");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      alert("Failed to create booking");
    },
  });

  // Mutation: update booking status (washer only)
  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await api.patch(`/bookings/${id}/status`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: () => {
      alert("Failed to update status");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4D96FF" />
        <Text>Loading bookings...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>Failed to load bookings.</Text>
        <Pressable style={styles.createButton} onPress={() => refetch()}>
          <Text style={styles.createButtonText}>Retry</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Customer flow */}
      {role === "customer" && (
        <>
          <View style={styles.row}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "dropoff" && styles.active,
              ]}
              onPress={() => setSelectedType("dropoff")}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedType === "dropoff" && styles.activeText,
                ]}
              >
                Dropoff
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeButton,
                selectedType === "pickup_return" && styles.active,
              ]}
              onPress={() => setSelectedType("pickup_return")}
            >
              <Text
                style={[
                  styles.btnText,
                  selectedType === "pickup_return" && styles.activeText,
                ]}
              >
                Pickup Return
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom rounded blue button */}
          <Pressable
            onPress={() => createBooking.mutate()}
            disabled={createBooking.isPending}
            style={({ pressed }) => [
              styles.createButton,
              pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
              createBooking.isPending && styles.disabledButton,
            ]}
          >
            <Text style={styles.createButtonText}>
              {createBooking.isPending ? "Creating..." : "Create Booking"}
            </Text>
          </Pressable>
        </>
      )}

      {/* Shared section: list bookings */}
      <Text style={styles.title}>
        {role === "washer" ? "Available Jobs" : "My Bookings"}
      </Text>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id.toString()}
        refreshing={isRefetching}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <View style={styles.bookingItem}>
            <Text>
              #{item.id} - {item.type} ({item.status})
            </Text>

            {/* Washer-only controls */}
            {role === "washer" && (
              <TouchableOpacity
                disabled={item.status === "complete"}
                style={[
                  styles.updateButton,
                  item.status === "complete" && styles.disabledButton,
                ]}
                onPress={() =>
                  updateStatus.mutate({
                    id: item.id,
                    status: getNextStatus(item.status),
                  })
                }
              >
                <Text style={styles.updateText}>
                  {item.status === "complete"
                    ? "Completed"
                    : `Mark as ${getNextStatus(item.status)}`}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

// Status transition helper
function getNextStatus(current: string) {
  const nextMap: Record<string, string | null> = {
    pending: "accepted",
    accepted: "on_the_way",
    on_the_way: "washing",
    washing: "complete",
    complete: null,
  };
  return nextMap[current] || "complete";
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    marginTop: 20,
    marginHorizontal: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  active: { backgroundColor: "#4D96FF" },
  btnText: { color: "#333", fontWeight: "bold" },
  activeText: { color: "white" },
  bookingItem: {
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
    marginBottom: 8,
  },
  updateButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: "#4D96FF",
    borderRadius: 6,
    alignItems: "center",
  },
  updateText: { color: "white", fontWeight: "bold" },
  disabledButton: { backgroundColor: "gray" },
  createButton: {
    backgroundColor: "#4D96FF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
