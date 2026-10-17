import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import images from "../../assets/images";
import LinearGradient from "react-native-linear-gradient";
import { apiPost } from "../../ApiServices/ApiService";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ImagePicker from 'react-native-image-crop-picker';
import database from '@react-native-firebase/database';

const getMimeTypeFromUri = (uri) => {
  const ext = uri.split('.').pop()?.toLowerCase();
  const types = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    heic: 'image/heic',
  };
  return types[ext] || 'image/jpeg';
};
import { db } from "../../utils/firebase";
import moment from "moment";
import { base, imgURL } from "../../Api/Constants";
import Carousel from "react-native-snap-carousel";
import Toast from "react-native-toast-message";

const ChatDetail = () => {
  const carouselRef = useRef();
  const route = useRoute();
  const navigation = useNavigation()
  const { chatData, receiverId, senderId, isGroup = false } = route.params || {};
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  console.log(chatData, "-=-=-=", receiverId, "-=-=-=senderid", senderId);
  const [imageList, setImageList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const flatListRef = useRef();
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const messagesPath = isGroup
      ? `GroupChats/${receiverId}/messages`
      : `EMPLOYEE_ADMIN_CHAT/messages/USER_${senderId}/ADMIN_${receiverId}`;
    const messagesRef = db.ref(messagesPath);

    const unsubscribe = messagesRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const items = Object.entries(data);
        items.sort(([, itemA], [, itemB]) => {
          const timeA = new Date(itemA.timestamp).getTime();
          const timeB = new Date(itemB.timestamp).getTime();
          return timeA - timeB;
        });

        if (!isGroup) {
          const lastUnreadReceivedMessage = items.find(
            ([, item]) => item.source === "RECEIVER" && item.read === false
          );
          if (lastUnreadReceivedMessage) {
            const [key] = lastUnreadReceivedMessage;
            messagesRef.child(key).update({ read: true });
          }
        }

        setMessages(items.map(([, value]) => value));
        flatListRef.current?.scrollToEnd({ animated: true });
      } else {
        setMessages([]);
      }
    });

    return () => messagesRef.off("value", unsubscribe);
  }, [receiverId, senderId, isGroup]);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const fetchSendMessage = async () => {
    if (!message.trim()) {
      return;
    }

    if (isGroup) {
      try {
        const userName = await AsyncStorage.getItem("userName");
        await db.ref(`GroupChats/${receiverId}/messages`).push({
          message,
          sender: `user_${senderId}`,
          timestamp: new Date().toISOString(),
          sender_name: userName || "Employee",
        });
        setMessage("");
      } catch (error) {
        Toast.show({ type: "error", text1: "Unable to send message" });
      }
      return;
    }

    try {
      const response = await apiPost(base.sendMessage, {
        receiverUserId: receiverId,
        message: message,
      });
      console.log("response of data on message screen", response);
      if (response.status === 200) {
        console.log("🟢 message sent successfully:", response.data);

        const newMessage = {
          id: String(new Date().getTime()),
          source: "SENDER",
          message: message,
          timestamp: moment.now(),
        };

        flatListRef.current?.scrollToEnd({ animated: true });

        setMessage("");
      }
    } catch (error) {
      console.log("❌ Error sending message:", error.response?.data || error.message);
    }
  };

  const sendImages = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      imageList.forEach((image) => {
        const newImageUri = "file:///" + image.path.split("file:/").join("");
        formData.append("images", {
          uri: newImageUri,
          type: getMimeTypeFromUri(newImageUri),
          name: newImageUri.split("/").pop(),
        });
      });
      formData.append("receiverUserId", receiverId);
      formData.append("message", "");
      await apiPost(base.sendImages, formData);
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
      Toast.show({ type: "success", text1: "Images sent successfully" });
      setImageList([]);
      setModalOpen(false);
    } catch (error) {
      setLoading(false);
      setImageList([]);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Unable to send images",
      });
    }
  };
  const add_image = async () => {
    try {
      const res = await ImagePicker.openPicker({
        mediaType: 'photo',
        multiple: true,
        compressImageQuality: 0.8,
        compressImageMaxWidth: 1000,
        compressImageMaxHeight: 1000,
      });
      setModalOpen(true);

      setImageList(res);
    } catch (error) {
      console.log(error);

    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setImageList([]);
  };
  const renderModalItem = (item, index) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',

        }}>
        <TouchableOpacity
          style={{
            padding: 12,
            backgroundColor: '#086FB1',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            removeImage(index);
          }}>
          <Image source={images.close} style={{ height: 20, width: 20 }} />

        </TouchableOpacity>
        <Image
          source={{ uri: item.path }}
          style={{
            height: 400,
            width: 350,
            marginHorizontal: 10,
            borderRadius: 8,
          }}
        />
      </View>
    );
  };
  const removeImage = index => {
    const newList = [...imageList];
    newList.splice(index, 1);
    setImageList(newList);
    setCurrentIndex(0);
    carouselRef.current.snapToItem(currentIndex - 1);
    if (newList.length == 0) {
      setModalOpen(false);
    }
  };
  const { height, width } = Dimensions.get("window");

  const renderItem = ({ item, index }) => {
    const isOwnMessage = isGroup
      ? item.sender === `user_${senderId}`
      : item.source === "SENDER";
    const isReceiver = !isOwnMessage;

    const imageUrls = isGroup
      ? item.image_url
        ? [item.image_url]
        : []
      : Array.isArray(item?.imageUrls)
        ? item.imageUrls
        : [];
    const isImageMessage = imageUrls.length > 0;

    if (isImageMessage) {
      return (
        <View
          key={index}
          style={{
            marginHorizontal: 10,
            maxWidth: 250,
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
          }}>
          {imageUrls.map((image, imgIndex) => (
            <TouchableOpacity
              key={imgIndex}
              onPress={() => setSelectedImage(image)}
              style={{
                alignSelf: isReceiver ? 'flex-start' : 'flex-end',
                borderRadius: 12,
                marginTop: 5,

                flexDirection: 'row',
                shadowColor: '#333333',
                elevation: isReceiver ? 0 : 3,
                backgroundColor: isReceiver ? '#F7F3EF' : '#888',
              }}>
              <Image
                source={{ uri: image }}
                style={{
                  height: 150,
                  width: 150,
                  borderRadius:12,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          ))}
          <Text
            style={{
              color: '#818181',
              fontSize: 12,
              marginHorizontal: 7,
              alignSelf: isReceiver ? 'flex-start' : 'flex-end',
            }}>
            {moment(item.timestamp).format('LT')}
          </Text>
        </View>
      );
    }

    return (
      <View
        key={index}
        style={{
          marginHorizontal: 10,
          maxWidth: 250,
          alignSelf: isReceiver ? 'flex-start' : 'flex-end',
        }}>
        <TouchableOpacity
          onPress={() => { }}
          style={{
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
            borderRadius: 12,
            marginTop: 5,
            padding: 5,
            paddingVertical: 15,
            flexDirection: 'row',
            shadowColor: '#333333',
            elevation: isReceiver ? 0 : 3,

          }}>
              {isOwnMessage ? (
                <LinearGradient
                  colors={["#243352", "#08F624"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.myMessage}
                >
                  <Text style={[styles.messageText, { color: '#FFF' }]}>{item.message}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.otherMessage}>
                  <Text style={styles.messageText}>{item.message}</Text>
                </View>
              )}
        </TouchableOpacity>
        <Text
          style={{
            color: '#818181',
            fontSize: 12,
            marginHorizontal: 7,
            alignSelf: isReceiver ? 'flex-start' : 'flex-end',
          }}>
          {moment(item.timestamp).format('LT')}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",

          height: height / 13,
        }}
      >
        <TouchableOpacity
          style={[styles.headerBackBtn, {
            height: 20,
            width: 20,
          }]}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} style={styles.headerBackBtn} />
        </TouchableOpacity>
        <Text style={styles.header}>{chatData}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={[...messages].reverse()}

        keyExtractor={(item, index) => item?.id || index.toString()}

        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
        renderItem={renderItem}

        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity
          onPress={() => add_image()}
          style={styles.attachmentButton}>
          <Image source={images.attachment} style={styles.attachmentIcon} />
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Write a message..." value={message} onChangeText={(e) => setMessage(e)} />
        <TouchableOpacity style={styles.sendButton} onPress={fetchSendMessage}>
          <Image source={images.rightIcon} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
      {selectedImage && (
        <Modal
          transparent
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,.7)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: '22%',
                right: '10%',
                zIndex: 999,
              }}
              onPress={() => {
                setSelectedImage('');
              }}>

              <Image source={images.close} style={{ height: 20, width: 20 }} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                downloadImage(selectedImage);
              }}>
              <Image
                source={{ uri: selectedImage }}
                style={{
                  height: 400,
                  width: 330,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
      {
        <Modal
          visible={modalOpen}
          onRequestClose={() => {
            closeModal();
          }}
          transparent
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,.8)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <SafeAreaView
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,.6)',
              justifyContent: 'center',
            }}>
            {
              <>
                <TouchableOpacity
                  style={{
                    position: 'absolute',
                    top: Platform.OS === 'android' ? 20 : 100,
                    right: 20,
                    zIndex: 999,
                  }}
                  onPress={() => {
                    closeModal();
                    setImageList([]);
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      marginHorizontal: 16,
                    }}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                {loading ? (
                  <ActivityIndicator size={'large'} color={'#000'} />
                ) : (
                  <>
                    <Carousel
                      ref={carouselRef}
                      style={{}}
                      data={imageList}
                      renderItem={({ item, index }) =>
                        renderModalItem(item, index)
                      }

                      currentIndex={0}
                      sliderWidth={width}
                      itemWidth={width - 80}
                      layout={'default'}
                      firstItem={currentIndex}
                      onSnapToItem={index => setCurrentIndex(index)}
                    />
                  </>
                )}

                <TouchableOpacity
                  disabled={loading}
                  onPress={() => {
                    sendImages();
                  }}
                  style={{
                    backgroundColor: '#086FB1',
                    padding: 12,
                    position: 'absolute',
                    bottom: 20,

                    width: width - 32,
                    borderRadius: 20,
                    marginHorizontal: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 20,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: '700',
                      marginHorizontal: 16,
                    }}>
                    Send
                  </Text>
                </TouchableOpacity>
              </>
            }
          </SafeAreaView>
        </Modal>
      }
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 15, paddingBottom: 100 },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#3D2C1D",
    marginBottom: 10,
  },
  headerBackBtn: {
    height: 20, width: 20,
    position: "absolute",
    left: "3%",
  },
  time: { fontSize: 12, textAlign: "center", color: "#888", marginBottom: 10 },
  messageContainer: {
    padding: 10,
    marginVertical: 2,
    maxWidth: "70%",

  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  myMessage: { alignSelf: "flex-end" },
  otherMessageContainer: {
    alignSelf: "flex-start",
  },
  myMessage: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderBottomRightRadius: 0,
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DFE2E8",
    borderBottomLeftRadius: 0,
  },
  messageText: { fontSize: 14, color: "#000" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#EDEDED",
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DFE2E8",
    color: "#6F7380",
  },
  attachmentButton: {
    marginRight: 10,
  },

  attachmentIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },

  sendButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  sendIcon: {
    width: 24,
    height: 24,
    resizeMode: "cover",
  },
});

export default ChatDetail;
