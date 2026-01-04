import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
};

export default function CommonDialog({
  visible,
  title,
  message,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  dialog: {
    width: "85%",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  message: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginBottom: 22,
  },

  button: {
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#2563eb",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
