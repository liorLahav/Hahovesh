import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../FirebaseConfig";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // New states for success and error messages
  const [loginStatus, setLoginStatus] = useState("");
  const [welcomeName, setWelcomeName] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = async () => {
    if (!phone || !identifier) {
      Alert.alert("Missing fields", "Please enter both phone number and ID.");
      return;
    }

    // Clear previous status messages
    setLoginStatus("");
    setWelcomeName("");
    setLoginError("");
    setIsLoading(true);
    
    try {
      // Query Firestore for a volunteer with matching phone and ID
      const volunteersRef = collection(db, "volunteers");
      const q = query(
        volunteersRef, 
        where("phone", "==", phone),
        where("id", "==", identifier)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        // Show error message on the page
        setLoginError("Phone number or ID is wrong. Please try again.");
        return;
      }

      // Get the volunteer data from the first matching document
      const volunteerData = querySnapshot.docs[0].data();
      
      // Show success message on the page
      setLoginStatus("Login successful!");
      setWelcomeName(volunteerData.first_name);
      
    // Use setTimeout to give the user time to see the success message before navigation
    setTimeout(() => {
      // Placeholder for future navigation logic
      console.log("Navigation logic will be implemented here.");
    }, 1500); // 1.5 second delay
    } catch (err) {
      console.error("Login error:", err);
      setLoginError("Something went wrong while logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.formContainer}
      >
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Access your volunteer account</Text>
        
        {/* Show success message if login was successful */}
        {loginStatus ? (
          <View style={styles.statusContainer}>
            <Text style={styles.successText}>{loginStatus}</Text>
            <Text style={styles.welcomeText}>Welcome, {welcomeName}!</Text>
          </View>
        ) : null}
        
        {/* Show error message if login failed */}
        {loginError ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>{loginError}</Text>
          </View>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              // Clear error message when user starts typing
              if (loginError) setLoginError("");
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>ID Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your ID"
            placeholderTextColor="#666"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              // Clear error message when user starts typing
              if (loginError) setLoginError("");
            }}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading ? styles.buttonDisabled : null]}
          onPress={handleLogin}
          disabled={isLoading || loginStatus !== ""}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.link}>Register here</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
  },
  formContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 32,
    alignSelf: 'center',
  },
  statusContainer: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    padding: 16,
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  successText: {
    color: '#4ade80',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1c1c1c',
    borderRadius: 8,
    height: 50,
    padding: 10,
    color: '#fff',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#64748b',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#aaa',
    marginRight: 6,
  },
  link: {
    color: '#3b82f6',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 40,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#aaa',
    fontSize: 16,
  }
});