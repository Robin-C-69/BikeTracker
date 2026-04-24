import { Dimensions, Modal, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import React from "react";
import { theme } from "@/constants/theme";
import { useTranslation } from "react-i18next";

type Props = {
  text: string;
  onClick: () => {};
  showDeleteModal: boolean;
  setShowDeleteModal: any;
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const DeleteModal = ({
  text,
  onClick,
  showDeleteModal,
  setShowDeleteModal,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Modal
      animationType="fade"
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
            <Button
              style={styles.modalCancel}
              onPress={() => setShowDeleteModal(false)}
            >
              <Text style={styles.modalButtonText}>{t("Cancel")}</Text>
            </Button>
            <Button style={styles.modalDelete} onPress={onClick}>
              <Text style={styles.modalButtonText}>{t("Delete")}</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContainer: {
    padding: 10,
    backgroundColor: theme.colors.surfaceVariant,
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.5,
    borderRadius: theme.spacing(1.5),
    justifyContent: "center",
  },
  deleteTextWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
  },
  modalButtonsWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  modalCancel: {
    width: 130,
    height: 50,
    backgroundColor: "transparent",
    borderRadius: theme.spacing(1.5),
    borderWidth: 1,
  },
  modalDelete: {
    width: 130,
    height: 50,
    backgroundColor: theme.colors.error,
    borderRadius: theme.spacing(1.5),
  },
  modalButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
  },
});
