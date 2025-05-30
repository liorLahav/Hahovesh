// עדכון ב-VolunteerPicker.tsx כדי להדגיש את הבחירה

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useVolunteers } from './useVolData';
import { Volunteer } from './volApi';
import { Ionicons } from '@expo/vector-icons';

interface VolunteerPickerProps {
  selectedVolunteerName: string | null;
  onSelectVolunteer: (volunteerName: string | null) => void;
}

export default function VolunteerPicker({ selectedVolunteerName, onSelectVolunteer }: VolunteerPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { volunteers, loading, error } = useVolunteers();
    // רענון רשימת המתנדבים במקרה של שגיאה
  const refreshVolunteers = () => {
    console.log("Refreshing volunteers list");
    setSearchQuery(''); // איפוס החיפוש
    setModalVisible(false); // סגירת החלון הקופץ
    
    // Force a component refresh
    // This is a hack to force the useVolunteers hook to re-run
    const tempSelected = selectedVolunteerName;
    onSelectVolunteer(null);
    setTimeout(() => {
      if (tempSelected) {
        onSelectVolunteer(tempSelected);
      }
    }, 100);
  };
  
  // סינון מתנדבים לפי מחרוזת חיפוש
  const filteredVolunteers = searchQuery.trim() === '' 
    ? volunteers 
    : volunteers.filter(v => 
        v.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
      <Text className="text-lg font-bold text-blue-800 mb-3 text-right">
        בחירת מתנדב
      </Text>
      
      <TouchableOpacity 
        className={`border ${!selectedVolunteerName ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-3 flex-row justify-between items-center ${!selectedVolunteerName ? 'bg-blue-50' : 'bg-white'}`}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chevron-down" size={20} color={!selectedVolunteerName ? "#2563eb" : "#4B5563"} />
        
        <Text className={`text-right ${!selectedVolunteerName ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
          {selectedVolunteerName 
            ? selectedVolunteerName
            : loading 
              ? "טוען מתנדבים..." 
              : error 
                ? "שגיאה בטעינת מתנדבים" 
                : volunteers.length === 0
                  ? "לא נמצאו מתנדבים"
                  : "בחר מתנדב לצפייה בסטטיסטיקות"}
        </Text>
      </TouchableOpacity>
      
      {/* בחירת הצגת כל המתנדבים */}
      {selectedVolunteerName && (
        <TouchableOpacity 
          className="mt-2 flex-row justify-end items-center"
          onPress={() => onSelectVolunteer(null)}
        >
          <Text className="text-blue-600 font-medium">חזור לבחירת מתנדב</Text>
        </TouchableOpacity>
      )}
      
      {/* כפתור רענון במקרה של שגיאה */}
      {error && (
        <TouchableOpacity 
          className="mt-2 flex-row justify-end items-center"
          onPress={refreshVolunteers}
        >
          <Text className="text-red-600 font-medium">נסה שוב לטעון מתנדבים</Text>
        </TouchableOpacity>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl h-3/4 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
              
              <Text className="text-lg font-bold text-gray-800">בחירת מתנדב</Text>
            </View>
            
            {/* חיפוש */}
            <View className="mb-4 border border-gray-300 rounded-lg p-2 flex-row items-center">
              <TextInput
                className="flex-1 text-right mr-2"
                placeholder="חיפוש לפי שם"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#4B5563" />
            </View>
            
            {/* רשימת מתנדבים */}
            {loading ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#1d4ed8" />
                <Text className="mt-4 text-gray-500">טוען רשימת מתנדבים...</Text>
              </View>
            ) : error ? (
              <View className="items-center py-8">
                <Text className="text-center py-4 text-red-500">{error}</Text>
                <TouchableOpacity 
                  className="mt-2 bg-blue-600 py-2 px-4 rounded" 
                  onPress={refreshVolunteers}
                >
                  <Text className="text-white font-bold">נסה שוב</Text>
                </TouchableOpacity>
              </View>
            ) : filteredVolunteers.length === 0 ? (
              <Text className="text-center py-4 text-gray-500">לא נמצאו מתנדבים תואמים לחיפוש</Text>
            ) : (
              <FlatList
                data={filteredVolunteers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    className={`p-3 border-b border-gray-100 ${item.full_name === selectedVolunteerName ? 'bg-blue-50' : ''}`}
                    onPress={() => {
                      onSelectVolunteer(item.full_name);
                      setModalVisible(false);
                    }}
                  >
                    <Text className="text-right text-gray-800 font-medium">{item.full_name}</Text>
                    <Text className="text-right text-gray-500 text-sm">מזהה: {item.id}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}