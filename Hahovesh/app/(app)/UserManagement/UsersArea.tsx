import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  LayoutChangeEvent,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import User from "./User";
import { DocumentData } from "firebase/firestore";
import { TextInput } from "react-native-gesture-handler";

type UsersAreaProps = {
  type: string;
  users: DocumentData[];
  refresh: () => void;
};

const UsersArea = (props: UsersAreaProps) => {
  const [expanded, setExpanded] = useState(true); // Start expanded by default
  const [contentHeight, setContentHeight] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const maxHeightAnim = useRef(new Animated.Value(2000)).current; // Start with a large value
  const opacityAnim = useRef(new Animated.Value(1)).current; // For content fade effect

  // Get content height on layout
  const onContentLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
      // No need to update the animation value here
    }
  };

  // Toggle expanded state
  const toggleExpand = () => {
    setExpanded(!expanded);

    // Animate max height instead of fixed height
    Animated.parallel([
      Animated.timing(maxHeightAnim, {
        toValue: expanded ? 60 : 2000, // Collapsed: just the header, Expanded: large enough for any content
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: expanded ? 0 : 1,
        duration: 200,
        useNativeDriver: false,
        delay: expanded ? 0 : 100, // Delay opacity when expanding
      }),
    ]).start();
  };

  // Debug logging
  useEffect(() => {
    console.log(`${props.type} - User count:`, props.users.length);
    if (props.users.length > 0) {
      console.log("First user sample:", props.users[0]);
    }
  }, [props.users]);

  const filteredUsers =
    searchQuery.trim() === ""
      ? props.users
      : props.users.filter((user) => {
          const userQuery = searchQuery.toLowerCase();
          return (
            user.first_name?.toLowerCase().includes(userQuery) ||
            user.last_name?.toLowerCase().includes(userQuery) ||
            user.id?.includes(userQuery) ||
            user.phone?.includes(userQuery)
          );
        });

  return (
    <>
      <Animated.View
        className="w-full bg-gray-50 rounded-xl my-2.5 p-4 overflow-hidden border border-gray-200 shadow-sm"
        style={{
          maxHeight: maxHeightAnim,
          // Only keep animation-specific styles inline
          elevation: 2,
        }}
      >
        {/* Header with toggle button */}
        <TouchableOpacity
          onPress={toggleExpand}
          className="flex-row justify-between items-center pb-2 border-b border-gray-200 min-h-[40px]"
        >
          <Text className="text-lg font-bold text-gray-800 text-right flex-1">
            {props.type} ({props.users.length})
          </Text>
          <Text className="text-xl text-gray-500 ml-2">
            {expanded ? "▲" : "▼"}
          </Text>
        </TouchableOpacity>
        <TextInput
          placeholder="🔍 חפש שם, מייל, טלפון או תעודת זהות"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
          className="border border-gray-300 rounded-md px-4 py-2 mb-2 text-right"
        />

        {/* Content area - add opacity animation */}
        <Animated.View
          className="mt-2"
          style={{
            opacity: opacityAnim,
          }}
          onLayout={onContentLayout}
        >
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <User
                user={user}
                key={user.id || index}
                refresh={props.refresh}
                isActive={props.type}
              />
            ))
          ) : (
            <Text className="text-center p-5 text-gray-400 italic">
              אין משתמשים להצגה
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </>
  );
};

export default UsersArea;
