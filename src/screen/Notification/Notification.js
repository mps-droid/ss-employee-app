import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { apiGet, apiPost } from "../../ApiServices/ApiService";
import { base } from "../../Api/Constants";
import moment from "moment";
import { SwipeListView } from "react-native-swipe-list-view";

import images from "../../assets/images";

const { height, width } = Dimensions.get("window");
const Notification = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [loader, setLoader] = useState(true)

  const openOptionsModal = () => setModalVisible(true);
  const closeOptionsModal = () => setModalVisible(false);
  const [showOptions, setShowOptions] = useState(false);
  useFocusEffect(
    React.useCallback(() => {
      notificationHandler()
    }, [])
  )

  const notificationHandler = async () => {
    setLoader(true);
    try {
      const response = await apiGet(base.getNotificationList);
      const notifications = response.data?.data?.notifications;
      if (response.status == 200) {
        setData(Array.isArray(notifications) ? notifications : []);
      }
    } catch (error) {
      setData([]);
    } finally {
      setLoader(false);
    }
  };
  const deleteNotificationHandler = async (id) => {
    try {
      const response = await apiPost(base.deleteNotification, {
        notification_id: id,
      });
      if (response.status == 200) {
        const updated = data.filter((item) => item?.id !== id);
        setData(updated);
      }
    } catch (error) {
      console.log(
        "Error deleting notification:",
        error.response?.data || error.message
      );
    }
  };
  const deleteAllNotificationHandler = async () => {
    try {
      const response = await apiPost(base.deleteAllNotification);
      if (response.status == 200) {
        setData([]);
        setModalVisible(false);
      }
    } catch (error) {
      console.log(
        "Error deleting notifications:",
        error.response?.data || error.message
      );
    }
  };

  const renderHiddenItem = (data, rowMap) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => deleteNotificationHandler(data?.item?.id)}
      >

        <Image source={images.delete} style={{ height: 24, width: 24 }} />

      </TouchableOpacity>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.notification}</Text>
      <Text style={styles.time}>{moment(item.created_at).format('YYYY-MM-DD')} | {moment(item.created_at).format('hh:mm A')}</Text>
    </View>

  );

  if (loader) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingTop: 10

        }}
      >
        <TouchableOpacity
          style={[styles.headerBackBtn]}
          onPress={() => navigation.goBack()}
        >
          <Image source={images.back} style={{ height: 20, width: 20 }} />
        </TouchableOpacity>
        <Text style={styles.titleTxt}>Notifications</Text>
        <TouchableOpacity style={{ right: 0 }} onPress={openOptionsModal}>

          <Image source={images.threeDot} style={{ height: 24, width: 24, tintColor: '#000' }} />
        </TouchableOpacity>
      </View>
      {data.length > 0 ?
        <SwipeListView
          data={data}
          keyExtractor={(item, index) => String(item?.id ?? index)}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          style={{ paddingVertical: 20 }}
        />
        :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#000', fontSize: 16 }}>No Notification Here...</Text>
        </View>
      }
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeOptionsModal}>
        <TouchableWithoutFeedback onPress={closeOptionsModal}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity onPress={deleteAllNotificationHandler}>
                <Text style={styles.deleteAllText}>Delete All </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,

  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
    color: "#000",
    marginBottom: "7%",
    marginTop: "5%",
  },
  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 20
  },
  notificationMessage: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: "#888888",
  },
  headerBackBtn: {
    height: height / 50,
    width: width / 20,

  },
  titleTxt: {
    fontSize: width / 20,
    color: "#432C1F",
    fontWeight: "700",
    alignSelf: "center",

  },
  notificationItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: 20
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  optionMenu: {
    position: 'absolute',
    right: 20,
    top: 70,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    elevation: 5,
    zIndex: 20,
  },
  deleteAllText: {
    color: '#e60000',
    fontWeight: 'bold',
  },
  modalOverlay: {

    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    top: 90,

    alignSelf: 'flex-end',
    zIndex: 1000,
    borderColor: '#000',
    borderWidth: 2,
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10

  },
  rowBack: {
    alignItems: 'center',

    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',

  },
  deleteBtn: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default Notification;
