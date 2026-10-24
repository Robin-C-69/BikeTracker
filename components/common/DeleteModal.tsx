import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@/hooks/useThemedStyles";

type Props = {
  text: string;
  onClick: () => void;
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const DeleteModal = ({
  text,
  onClick,
  showDeleteModal,
  setShowDeleteModal,
}: Props) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={showDeleteModal}
      onRequestClose={() => {
        setShowDeleteModal(false);
      }}
    >
      <View style={styles.modalWrapper}>
        <View style={styles.modalContainer}>
          <View style={styles.deleteTextWrapper}>
            <Text style={styles.deleteText}>{text}</Text>
            <Text style={styles.deleteText}>{t("irreversible_action")}</Text>
          </View>
          <View style={styles.modalButtonsWrapper}>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.modalCancel,
                pressed && styles.pressed,
              ]}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.modalCancelText}>{t("Cancel")}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                styles.modalDelete,
                pressed && styles.pressed,
              ]}
              onPress={onClick}
            >
              <Text style={styles.modalDeleteText}>{t("Delete")}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const useStyles = makeStyles((theme) => ({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)", // scrim: same in light and dark
  },
  modalContainer: {
    padding: theme.spacing(2),
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    width: "80%",
    borderRadius: theme.spacing(0.5),
    borderColor: theme.colors.border.default,
    borderWidth: 1,
  },
  deleteTextWrapper: { justifyContent: "center", alignItems: "center" },
  deleteText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    textAlign: "center",
  },
  modalButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  button: {
    width: "45%",
    height: theme.spacing(7),
    borderRadius: theme.spacing(0.5),
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  modalCancel: {
    backgroundColor: "transparent",
    borderColor: theme.colors.border.disabled,
  },
  modalCancelText: {
    color: theme.colors.text.tertiary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
  modalDelete: {
    backgroundColor: theme.colors.errorDark,
    borderColor: theme.colors.border.error,
  },
  modalDeleteText: {
    color: theme.colors.text.error,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
}));