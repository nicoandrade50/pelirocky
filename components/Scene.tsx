import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/StackNavigator";
import { Scene } from "../types/scene";
import { useMutation, useQuery } from "react-query";
import {
  createNewScene,
  deleteSceneById,
  getAllScenesByFilmId,
  patchScene,
} from "../services/scene-service";
import showAlert from "../utils/alert";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Scenes"
>;

type DashboardScreenRouteProp = RouteProp<RootStackParamList, "Scenes">;

type Props = {
  route: DashboardScreenRouteProp;
  navigation: DashboardScreenNavigationProp;
};

const DashboardScene: React.FC<Props> = ({ route }) => {
  const filmId = route.params?.filmId;

  const navigation = useNavigation<DashboardScreenNavigationProp>();

  const [modalVisible, setModalVisible] = useState(false);
  const [currentScene, setCurrentScene] = useState<Scene | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedBudget, setEditedBudget] = useState("");
  const [editedMinutes, setEditedMinutes] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: sceneList,
    refetch: refetchSceneList,
    isRefetching: isRefetchingSceneList,
  } = useQuery({
    queryFn: () => getAllScenesByFilmId(filmId as number),
    queryKey: ["scenes", filmId],
  });

  const { mutate: createNewSceneMutate } = useMutation(createNewScene, {
    onSuccess: () => {
      refetchSceneList();
    },
    onError: (err) => {
      showAlert((err as any).message);
    },
  });

  const { mutate: deleteSceneByIdMutate } = useMutation(deleteSceneById, {
    onSuccess: () => {
      refetchSceneList();
    },
    onError: (err) => {
      showAlert((err as any).message);
    },
  });

  const { mutate: patchFilmMutate } = useMutation(patchScene, {
    onSuccess: () => {
      refetchSceneList();
    },
  });

  const handleEdit = (scene: Scene) => {
    setCurrentScene(scene);
    setEditedDescription(scene.description);
    setEditedBudget(String(scene.budget));
    setEditedMinutes(String(scene.minutes));
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteSceneByIdMutate(Number(id));
  };

  const handleSave = () => {
    if (isEditing && currentScene) {
      const updatedScene: Partial<Scene> = {
        ...currentScene,
        id: undefined,
        film: undefined,
        filmId: undefined,
      };

      patchFilmMutate({
        id: Number(currentScene.id),
        scene: { ...updatedScene },
      });
    } else {
      createNewSceneMutate({
        description: editedDescription,
        budget: Number(editedBudget),
        minutes: Number(editedBudget),
        id: "",
        filmId,
      });
    }
    setModalVisible(false);
    setCurrentScene(null);
    setEditedDescription("");
    setEditedBudget("");
    setEditedMinutes("");
    setIsEditing(false);
  };

  const renderItem = ({ item }: { item: Scene }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("Characters", { sceneId: Number(item.id) })
      }
    >
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.description}</Text>
          <Text style={styles.cardSubtitle}>{item.budget}</Text>
          <Text style={styles.cardSubtitle}>{item.minutes}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialIcons name="edit" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleAdd = () => {
    setCurrentScene(null);
    setEditedDescription("");
    setEditedBudget("");
    setEditedMinutes("");
    setIsEditing(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>FILM 1</Text>
      </View>
      <Text style={styles.subHeader}>SCENES</Text>
      {isRefetchingSceneList && <ActivityIndicator size="large" />}
      {!isRefetchingSceneList && (
        <FlatList
          data={sceneList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentScene(null);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {isEditing ? "Editar Escena" : "Agregar Escena"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={currentScene ? currentScene.description : editedDescription}
            onChangeText={(text) => {
              currentScene
                ? setCurrentScene({ ...currentScene, description: text })
                : setEditedDescription(text);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Costo"
            value={
              currentScene ? String(currentScene.budget) : String(editedBudget)
            }
            onChangeText={(text) =>
              currentScene
                ? setCurrentScene({ ...currentScene, budget: Number(text) })
                : setEditedBudget(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Minutos"
            value={
              currentScene
                ? String(currentScene.minutes)
                : String(editedMinutes)
            }
            onChangeText={(text) =>
              currentScene
                ? setCurrentScene({ ...currentScene, minutes: Number(text) })
                : setEditedMinutes(text)
            }
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    color: "white",
    fontWeight: "bold",
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 14,
    color: "black",
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 50,
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#800F2F",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 15,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: "100%",
  },
  saveButton: {
    backgroundColor: "#800F2F",
    padding: 10,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default DashboardScene;
