import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiGet } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../../assets/images";
import moment from "moment";
import { base } from "../../Api/Constants";
import Toast from "react-native-toast-message";

const Chat = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [chatList, setChatList] = useState([]);
  const [senderId, setSenderId] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      chatDetails();
    }, [])
  );

  const chatDetails = async () => {
    setLoading(true);
    try {
      const userID = await AsyncStorage.getItem("userID");
      const response = await apiGet(base.chatList);

      if (response.status === 200) {
        const groups =
          response?.data?.data?.groups ||
          response?.data?.data ||
          [];
        setChatList(Array.isArray(groups) ? groups : []);
        setSenderId(userID);
      }
    } catch (error) {
      console.log("Error loading groups:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Unable to load group chats",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() =>
        navigation.navigate("ChatDetail", {
          chatData: item.name,
          receiverId: item.groupId || item.id,
          senderId,
          isGroup: true,
        })
      }
    >
      <Image source={images.groups} style={styles.avatar} />
      <View style={styles.chatDetails}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.message} numberOfLines={1}>
          {item?.last_message || item?.displayMessage || "No messages yet"}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.time}>
          {item.last_message_time || item.lastMessageTime
            ? moment(item.last_message_time || item.lastMessageTime).format(
                "hh:mm A"
              )
            : ""}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titleTxt}>Groups</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : chatList.length > 0 ? (
        <FlatList
          data={chatList}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            String(item.groupId || item.id || index)
          }
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No Group Chat Found</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 15 },
  titleTxt: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#3D2C1D",
    marginHorizontal: 20,
  },
  chatItem: {
    flexDirection: "row",
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  chatDetails: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold", color: "#000" },
  message: { fontSize: 14, color: "#777", marginTop: 2 },
  rightSection: { alignItems: "flex-end" },
  time: { fontSize: 12, color: "#999" },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: 18, color: "#000" },
});

export default Chat;
