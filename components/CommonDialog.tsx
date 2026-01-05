import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../app/context/ThemeContext";

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
  const { COLORS } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.box,
            {
              backgroundColor: COLORS.card,
            },
          ]}
        >
          <Text style={[styles.title, { color: COLORS.text }]}>
            {title}
          </Text>

          <Text style={[styles.message, { color: COLORS.muted }]}>
            {message}
          </Text>

          {/* CENTERED OK BUTTON */}
          <TouchableOpacity
            style={[
              styles.okBtn,
              { backgroundColor: COLORS.primary },
            ]}
            onPress={onClose}
          >
            <Text style={styles.okText}>OK</Text>
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
    padding: 24,
  },

  box: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },

  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 22,
  },

  okBtn: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 14,
  },

  okText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
});
