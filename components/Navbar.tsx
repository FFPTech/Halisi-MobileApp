import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../assets/images/halisi-logo.png";
import { useUser } from "../Hooks/useUserGlobal";

export default function Navbar({ title }: { title?: string }) {
  const { user, logout } = useUser(); // ensure logout exists in global store
  const router = useRouter();

  const [menuVisible, setMenuVisible] = useState(false);

  

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#2e7d32" barStyle="dark-content" />

      <View style={styles.navbar}>
        {/* Left: Logo */}
        <View style={styles.leftContainer}>
          <Image
            source={require("../assets/images/halisi-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Center: Title */}
        {title && <Text style={styles.title}>{title}</Text>}

        {/* Right: Avatar + Hamburger */}
        <View style={styles.rightItems}>
          <TouchableOpacity style={styles.avatarWrapper}>
            <Image
              source={
                user?.image ? { uri: user.image } : logo
              }
              style={styles.avatar}
            />
          </TouchableOpacity>

          {/* Hamburger Button */}
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <MaterialIcons name="menu" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal for Menu */}
      <Modal
        transparent
        animationType="fade"
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={logout}>
              <MaterialIcons name="logout" size={22} color="#d32f2f" />
              <Text style={styles.menuText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  rightItems: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    width: 160,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  menuText: {
    fontSize: 16,
    color: "#d32f2f",
    fontWeight: "600",
  },
});
