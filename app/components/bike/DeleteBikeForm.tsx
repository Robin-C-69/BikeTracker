import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "@/app/constants/theme";
import { useCallback } from "react";
import { router } from "expo-router";
import { useBike } from "@/app/hooks/useBike";

interface DeleteBikeFormProps {
  bikeId: number;
  openDeleteDialog: boolean;
  setOpenDeleteDialog: Function;
}

export function DeleteBikeForm({
  bikeId,
  openDeleteDialog = false,
  setOpenDeleteDialog,
}: DeleteBikeFormProps) {
  const { deleteBike } = useBike();

  const onDelete = useCallback(
    async (bikeId: number) => {
      const { errors } = await deleteBike(bikeId);

      if (errors) {
        console.error("Error deleting bike:", errors);
        setOpenDeleteDialog(false);
        return;
      }

      router.navigate({ pathname: "/(tabs)/bike" });
    },
    [deleteBike, setOpenDeleteDialog],
  );

  return (
    <Modal
      transparent={true}
      visible={openDeleteDialog}
      onRequestClose={() => setOpenDeleteDialog(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Confirmer la suppression ?</Text>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={() => setOpenDeleteDialog(false)}
            >
              <Text style={styles.modalText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonDelete]}
              onPress={() => onDelete(bikeId)} // Replace 1 with the actual bike ID to delete
            >
              <Text style={styles.modalText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  blurView: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
  },
  buttonsContainer: {
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    borderRadius: 10,
    padding: 10,
  },
  buttonCancel: {
    borderStyle: "solid",
    borderWidth: 2,
    backgroundColor: "white",
  },
  buttonDelete: {
    backgroundColor: theme.colors.error,
  },
});
