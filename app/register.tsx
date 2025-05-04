import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { app, db } from "../FirebaseConfig";
import { router } from 'expo-router';

/**
 * Register screen ‑ adds a new volunteer document to the `volunteers` collection
 *
 * Firestore schema (per screenshot):
 *  └─ volunteers (collection)
 *        └─ <id> (document)
 *              • first_name : string
 *              • last_name  : string
 *              • id         : string | number (same as document id)
 *              • phone      : string
 *              • permissions: string[] (defaults to ["volunteer"])
 */
export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Validation states
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [idError, setIdError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  
  // Conflict message states
  const [conflictMessage, setConflictMessage] = useState("");
  const [conflictDetails, setConflictDetails] = useState("");

  // Validation handlers
  const validateName = (value: string, setError: React.Dispatch<React.SetStateAction<string>>, fieldName: string) => {
    // Only allow alphabetic characters (support for international characters)
    if (!/^[A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s]*$/.test(value)) {
      setError(`${fieldName} can only contain alphabetic characters`);
      return false;
    }
    setError("");
    return true;
  };

  const validateId = (value: string) => {
    // Check if ID is exactly 9 digits
    if (!/^\d{9}$/.test(value)) {
      setIdError("ID must be exactly 9 digits");
      return false;
    }
    setIdError("");
    return true;
  };

  const validatePhone = (value: string) => {
    // Check if phone starts with 05 and has exactly 10 digits
    if (!/^05\d{8}$/.test(value)) {
      setPhoneError("Phone must start with 05 and be exactly 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Input handlers with validation
  const handleFirstNameChange = (text: string) => {
    // Clear conflict message when changing forms
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    
    // Filter out non-alphabetic characters
    const filteredText = text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s]/g, '');
    setFirstName(filteredText.toLowerCase());
    validateName(filteredText, setFirstNameError, "First name");
  };

  const handleLastNameChange = (text: string) => {
    // Clear conflict message when changing forms
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    
    // Filter out non-alphabetic characters
    const filteredText = text.replace(/[^A-Za-z\u00C0-\u024F\u1E00-\u1EFF\s]/g, '');
    setLastName(filteredText.toLowerCase());
    validateName(filteredText, setLastNameError, "Last name");
  };

  const handleIdChange = (text: string) => {
    // Clear conflict message when changing forms
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    
    // Filter out non-digit characters
    const filteredText = text.replace(/[^\d]/g, '');
    setIdentifier(filteredText);
    validateId(filteredText);
  };

  const handlePhoneChange = (text: string) => {
    // Clear conflict message when changing forms
    if (conflictMessage) {
      setConflictMessage("");
      setConflictDetails("");
    }
    
    // Filter out non-digit characters
    const filteredText = text.replace(/[^\d]/g, '');
    setPhone(filteredText);
    validatePhone(filteredText);
  };

  const handleRegister = async () => {
    // Clear any previous conflict messages
    setConflictMessage("");
    setConflictDetails("");
    
    // Validate all fields before submission
    const isFirstNameValid = validateName(firstName, setFirstNameError, "First name");
    const isLastNameValid = validateName(lastName, setLastNameError, "Last name");
    const isIdValid = validateId(identifier);
    const isPhoneValid = validatePhone(phone);
  
    if (!isFirstNameValid || !isLastNameValid || !isIdValid || !isPhoneValid) {
      Alert.alert("Validation Error", "Please fix all form errors before submitting.");
      return;
    }
  
    if (!firstName || !lastName || !identifier || !phone) {
      Alert.alert("Missing fields", "Please fill in all the details.");
      return;
    }
    
    setIsLoading(true);
  
    try {
      console.log("Checking for existing records...");
      
      // Check if ID already exists in database
      const idDocRef = doc(db, "volunteers", identifier);
      const idDocSnap = await getDoc(idDocRef);
      
      if (idDocSnap.exists()) {
        const existingData = idDocSnap.data();
        // Set conflict message with details about the existing record
        setConflictMessage("ID Already Registered");
        setConflictDetails(`The ID ${identifier} is already registered to ${existingData.first_name} ${existingData.last_name}. If this is you, please try logging in instead.`);
        setIdError("ID already in use");
        setIsLoading(false);
        return;
      }
      
      // Check if phone number already exists in database
      const volunteersRef = collection(db, "volunteers");
      const phoneQuery = query(volunteersRef, where("phone", "==", phone));
      const phoneQuerySnapshot = await getDocs(phoneQuery);
      
      if (!phoneQuerySnapshot.empty) {
        const existingData = phoneQuerySnapshot.docs[0].data();
        // Set conflict message with details about the existing record
        setConflictMessage("Phone Already Registered");
        setConflictDetails(`The phone number ${phone} is already registered to ${existingData.first_name} ${existingData.last_name}. If this is you, please try logging in instead.`);
        setPhoneError("Phone number already in use");
        setIsLoading(false);
        return;
      }
      
      console.log("No duplicates found, proceeding with registration...");
      
      // Use the user‑supplied id as the document key for quick look‑up
      await setDoc(doc(db, "volunteers", identifier), {
        first_name: firstName,
        last_name: lastName,
        id: identifier,
        phone: phone,
        permissions: ["volunteer"],
        created_at: new Date().toISOString(),
      });
  
      console.log("Registration successful, showing welcome message");
      
      // Show enhanced success message with login instructions
      Alert.alert(
        "Registration Successful!", 
        `Thank you ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}, your volunteer account has been created successfully.\n\nPlease use your phone number (${phone}) and ID (${identifier}) to log in.`,
        [
          {
            text: "Log In Now",
            onPress: () => {
              // Clear form fields
              setFirstName("");
              setLastName("");
              setIdentifier("");
              setPhone("");
              setFirstNameError("");
              setLastNameError("");
              setIdError("");
              setPhoneError("");
              
              // Navigate to login with the credentials as params
              router.push({
                pathname: '/login',
                params: { phone: phone, id: identifier }
              });
            }
          }
        ]
      );
      
    } catch (err) {
      console.error("Registration error:", err);
      Alert.alert("Error", "Something went wrong while registering. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Volunteer Registration</Text>

        {conflictMessage ? (
          <View style={styles.conflictContainer}>
            <Text style={styles.conflictTitle}>{conflictMessage}</Text>
            <Text style={styles.conflictText}>{conflictDetails}</Text>
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Go to Login</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <Input 
          label="First Name" 
          value={firstName} 
          onChangeText={handleFirstNameChange} 
          error={firstNameError}
          placeholder="Enter first name (letters only)"
        />
        <Input 
          label="Last Name" 
          value={lastName} 
          onChangeText={handleLastNameChange} 
          error={lastNameError} 
          placeholder="Enter last name (letters only)"
        />
        <Input 
          label="ID" 
          keyboardType="numeric" 
          value={identifier} 
          onChangeText={handleIdChange} 
          maxLength={9}
          error={idError}
          placeholder="Enter 9-digit ID"
        />
        <Input 
          label="Phone" 
          keyboardType="phone-pad" 
          value={phone} 
          onChangeText={handlePhoneChange} 
          maxLength={10}
          error={phoneError}
          placeholder="Enter phone (05xxxxxxxx)"
        />

        <TouchableOpacity 
          style={[
            styles.button, 
            (isLoading || !firstName || !lastName || !identifier || !phone || 
             firstNameError || lastNameError || idError || phoneError || conflictMessage) && styles.buttonDisabled
          ]} 
          onPress={handleRegister}
          disabled={isLoading || !firstName || !lastName || !identifier || !phone || 
                  !!firstNameError || !!lastNameError || !!idError || !!phoneError || 
                  !!conflictMessage}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.buttonText}> Checking...</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/**
 * Enhanced input component with error display
 */
function Input({ label, error, ...props }: { label: string, error?: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#777"
        style={[styles.input, error ? styles.inputError : null]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
  },
  inner: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#ccc",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#1e1e1e",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  inputError: {
    borderColor: "#e53935",
    borderWidth: 1,
  },
  errorText: {
    color: "#e53935",
    fontSize: 12,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#64748b",
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  conflictContainer: {
    backgroundColor: "#4a1c40",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ff6b81",
  },
  conflictTitle: {
    color: "#ff6b81",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  conflictText: {
    color: "#f8f9fa",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#20203a",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  loginButtonText: {
    color: "#4ade80",
    fontSize: 14,
    fontWeight: "500",
  },
  backButton: {
    alignSelf: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  backButtonText: {
    color: "#aaa",
    fontSize: 16,
  }
});