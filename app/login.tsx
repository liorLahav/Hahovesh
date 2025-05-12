import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
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
      Alert.alert("שדות חסרים", "אנא מלא את כל השדות");
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
        setLoginError("מספר הטלפון או תעודת הזהות שגויים. אנא נסה שוב.");
        return;
      }

      // Get the volunteer data from the first matching document
      const volunteerData = querySnapshot.docs[0].data();
      
      // Check if user's account is pending approval
      if (volunteerData.permissions && 
          (volunteerData.permissions.includes("pending") || volunteerData.permissions.includes("Pending"))) {
        // Show pending approval message
        setLoginError("חשבונך עדיין בבדיקה וממתין לאישור מנהל. נא לנסות שוב מאוחר יותר.");
        return;
      }
      
      // User has proper permissions, proceed with login
      setLoginStatus("התחברות הצליחה!");
      setWelcomeName(volunteerData.first_name);
      
      // Use setTimeout to give the user time to see the success message before navigation
      setTimeout(() => {
        // Placeholder for future navigation logic
        console.log("Navigation logic will be implemented here.");
      }, 1500); // 1.5 second delay
    } catch (err) {
      console.error("שגיאת התחברות:", err);
      setLoginError("משהו השתבש במהלך ההתחברות. אנא נסה שוב.");
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
        <Text style={styles.title}>התחברות</Text>
        <Text style={styles.subtitle}>התחבר למשתמש שלך</Text>
        
        {/* Show success message if login was successful */}
        {loginStatus ? (
          <View style={styles.statusContainer}>
            <Text style={styles.successText}>{loginStatus}</Text>
            <Text style={styles.welcomeText}>ברוך הבא, {welcomeName}!</Text>
          </View>
        ) : null}
        
        {/* Show error message if login failed */}
        {loginError ? (
          <View style={styles.statusContainer}>
            <Text style={styles.errorText}>{loginError}</Text>
          </View>
        ) : null}
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>מספר טלפון</Text>
            <TextInput
            style={styles.input}
            placeholder="הכנס את מספר הטלפון שלך"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              // Clear error message when user starts typing
              if (loginError) setLoginError("");
            }}
            textAlign="right"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>מספר תעודת זהות</Text>
            <TextInput
            style={styles.input}
            placeholder="הכנס את תעודת הזהות שלך"
            placeholderTextColor="#666"
            value={identifier}
            onChangeText={(text) => {
              setIdentifier(text);
              // Clear error message when user starts typing
              if (loginError) setLoginError("");
            }}
            textAlign="right"
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
            <Text style={styles.buttonText}>התחבר</Text>
          )}
        </TouchableOpacity>

        {/* Modified footer structure */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>אין לך חשבון?</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/register')} style={styles.registerLink}>
          <Text style={styles.link}>הרשמה כאן</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>חזרה לדף הבית</Text>
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
    writingDirection: 'rtl',
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    marginBottom: 32,
    alignSelf: 'center',
    writingDirection: 'rtl',
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
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
    textAlign: 'right',
    writingDirection: 'rtl',
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
    textAlign: 'right',
    writingDirection: 'rtl',
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
    writingDirection: 'rtl',
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  registerLink: {
    marginTop: 8,
    alignItems: 'center',
  },
  link: {
    color: '#3b82f6',
    fontWeight: '500',
    fontSize: 16,
    writingDirection: 'rtl',
  },
  backButton: {
    marginTop: 40,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#aaa',
    fontSize: 16,
    writingDirection: 'rtl',
  }
});