import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import { api } from "../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type JwtPayload = {
  sub: number;
  email: string;
  role: "customer" | "washer";
};

export default function LoginScreen() {
  const [email, setEmail] = useState("customer@test.com");
  const [password, setPassword] = useState("1234");
  const navigation = useNavigation();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    },
    onSuccess: async (data) => {
      await AsyncStorage.setItem("token", data.access_token);

      const decoded: JwtPayload = jwtDecode(data.access_token);
      Alert.alert("Login Successful", `Welcome ${decoded.email} (${decoded.role})`);

      navigation.navigate("Bookings" as never);
    },
    onError: () => {
      Alert.alert("Login Failed", "Please check your email and password.");
    },
  });

  return (
    <View style={styles.container}>
      {/* Logo + Tagline */}

       <View style={styles.logoContainer}>
  <MaterialCommunityIcons 
    name="washing-machine" 
    size={50} 
    color="#4A90E2" 
    style={{ marginRight: 8 }}
  />
  <Text style={styles.logo}>DOOVO</Text>
</View>
  <Text style={styles.subtitle}>Laundry made simple</Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#888" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => loginMutation.mutate()}
        disabled={loginMutation.isPending}
      >
        <Text style={styles.loginButtonText}>
          {loginMutation.isPending ? "Logging in..." : "Login"}
        </Text>
      </TouchableOpacity>

      {/* Links */}
      <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "Forgot Password flow")}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => Alert.alert("Coming Soon", "Signup flow")}>
          <Text style={styles.signupLink}> Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7faff",
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 10,
},
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#4D96FF",
    lineHeight: 40,
    marginLeft: -10,
    marginBottom: -22,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#4D96FF",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#4D96FF",
    textAlign: "center",
    fontSize: 14,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    fontSize: 14,
    color: "#555",
  },
  signupLink: {
    fontSize: 14,
    color: "#4D96FF",
    fontWeight: "bold",
  },
});
