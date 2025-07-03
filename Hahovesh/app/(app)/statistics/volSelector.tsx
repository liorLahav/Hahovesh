// Updated VolunteerPicker to highlight selected volunteer

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, TextInput, ActivityIndicator } from 'react-native';
import { useVolunteers } from '../../../hooks/useVolData';
import { Volunteer } from "../../../services/volunteerAnalyticsService";
import { Ionicons } from '@expo/vector-icons';
import tw from "twrnc";

interface VolunteerPickerProps {
  selectedVolunteerName: string | null;
  onSelectVolunteer: (volunteerName: string | null) => void;
}

export default function VolunteerPicker({ selectedVolunteerName, onSelectVolunteer }: VolunteerPickerProps) {
  const [modalVisible, setModalVisible] = useState(false);  const [searchQuery, setSearchQuery] = useState('');
  const { volunteers, loading, error } = useVolunteers();
  // Refresh volunteers list in case of an error
  const refreshVolunteers = () => {
    console.log("Refreshing volunteers list");
    setSearchQuery(''); // Reset search
    setModalVisible(false); // Close modal
    
    // Force a component refresh
    // This is a hack to force the useVolunteers hook to re-run
    const tempSelected = selectedVolunteerName;
    onSelectVolunteer(null);
    setTimeout(() => {
      if (tempSelected) {
        onSelectVolunteer(tempSelected);
      }
    }, 100);  };
  
  // Filter volunteers by search string
  const filteredVolunteers = searchQuery.trim() === '' 
    ? volunteers 
    : volunteers.filter(v => 
        v.full_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  return (
    <View style={tw`bg-white rounded-lg p-4 mb-4 shadow-sm`}>
      <Text style={tw`text-lg font-bold text-blue-800 mb-3 text-right`}>
       סטטיסטיקות אישיות
      </Text>
      
      <TouchableOpacity 
        style={tw`border ${!selectedVolunteerName ? 'border-blue-500' : 'border-gray-300'} rounded-lg p-3 flex-row justify-between items-center ${!selectedVolunteerName ? 'bg-blue-50' : 'bg-white'}`}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="chevron-down" size={20} color={!selectedVolunteerName ? "#2563eb" : "#4B5563"} />
        
        <Text style={tw`text-right ${!selectedVolunteerName ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
          {selectedVolunteerName 
            ? selectedVolunteerName
            : loading 
              ? "טוען מתנדבים..." 
              : error 
                ? "שגיאה בטעינת מתנדבים" 
                : volunteers.length === 0
                  ? "לא נמצאו מתנדבים"
                  : "בחר מתנדב"}
        </Text>
      </TouchableOpacity>      
      {/* Option to clear volunteer selection */}
      {selectedVolunteerName && (
        <TouchableOpacity 
          style={tw`mt-2 flex-row justify-end items-center`}
          onPress={() => onSelectVolunteer(null)}
        >
          <Text style={tw`text-blue-600 font-medium`}>חזור לבחירת מתנדב</Text>
        </TouchableOpacity>
      )}
      
      {/* Refresh button for error cases */}
      {error && (
        <TouchableOpacity 
          style={tw`mt-2 flex-row justify-end items-center`}
          onPress={refreshVolunteers}
        >
          <Text style={tw`text-red-600 font-medium`}>נסה שוב לטעון מתנדבים</Text>
        </TouchableOpacity>
      )}
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={tw`flex-1 justify-end bg-black/50`}>
          <View style={tw`bg-white rounded-t-xl h-3/4 p-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#4B5563" />
              </TouchableOpacity>
              
              <Text style={tw`text-lg font-bold text-gray-800`}>בחירת מתנדב</Text>
            </View>            
            {/* Search box */}
            <View style={tw`mb-4 border border-gray-300 rounded-lg p-2 flex-row items-center`}>
              <TextInput
                style={tw`flex-1 text-right mr-2`}
                placeholder="חיפוש לפי שם"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <Ionicons name="search" size={20} color="#4B5563" />
            </View>
            
            {/* Volunteers list */}
            {loading ? (
              <View style={tw`items-center justify-center py-8`}>
                <ActivityIndicator size="large" color="#1d4ed8" />
                <Text style={tw`mt-4 text-gray-500`}>טוען רשימת מתנדבים...</Text>
              </View>
            ) : error ? (
              <View style={tw`items-center py-8`}>
                <Text style={tw`text-center py-4 text-red-500`}>{error}</Text>
                <TouchableOpacity 
                  style={tw`mt-2 bg-blue-600 py-2 px-4 rounded`}
                  onPress={refreshVolunteers}
                >
                  <Text style={tw`text-white font-bold`}>נסה שוב</Text>
                </TouchableOpacity>
              </View>
            ) : filteredVolunteers.length === 0 ? (
              <Text style={tw`text-center py-4 text-gray-500`}>לא נמצאו מתנדבים תואמים לחיפוש</Text>
            ) : (
              <FlatList
                data={filteredVolunteers}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={tw`p-3 border-b border-gray-100 ${item.full_name === selectedVolunteerName ? 'bg-blue-50' : ''}`}
                    onPress={() => {
                      onSelectVolunteer(item.full_name);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={tw`text-right text-gray-800 font-medium`}>{item.full_name}</Text>
                    <Text style={tw`text-right text-gray-500 text-sm`}>ID: {item.id}</Text>
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