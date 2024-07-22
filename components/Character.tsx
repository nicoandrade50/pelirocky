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
import { Character } from "../types/character";
import { useMutation, useQuery } from "react-query";
import {
  createNewCharacter,
  deleteCharacterById,
  getAllCharactersBySceneId,
  patchCharacter,
} from "../services/character-service";

type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Characters"
>;

type DashboardScreenRouteProp = RouteProp<RootStackParamList, "Characters">;

type Props = {
  route: DashboardScreenRouteProp;
  navigation: DashboardScreenNavigationProp;
};

const DashboardCharacter: React.FC<Props> = ({ route }) => {
  const sceneId = route.params?.sceneId;

  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(
    null
  );
  const [editedDescription, setEditedDescription] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedStatus, setEditedStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const {
    data: characterList,
    refetch: refetchCharacterList,
    isRefetching: isRefetchingCharacterList,
  } = useQuery({
    queryFn: () => getAllCharactersBySceneId(Number(sceneId)),
    queryKey: ["characters", sceneId],
  });

  const { mutate: createNewCharacterMutate } = useMutation(createNewCharacter, {
    onSuccess: () => {
      refetchCharacterList();
    },
  });

  const { mutate: patchCharacterMutate } = useMutation(patchCharacter, {
    onSuccess: () => {
      refetchCharacterList();
    },
  });

  const { mutate: deleteCharacterByIdMutate } = useMutation(
    deleteCharacterById,
    {
      onSuccess: () => {
        refetchCharacterList();
      },
    }
  );

  const handleEdit = (character: Character) => {
    setCurrentCharacter(character);
    setEditedDescription(character.description);
    setEditedGender(String(character.gender));
    setEditedStatus(String(character.status));
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteCharacterByIdMutate(Number(id));
  };

  const handleSave = () => {
    if (isEditing && currentCharacter) {
      const updatedCharacter: Partial<Character> = {
        ...currentCharacter,
        id: undefined,
        scene: undefined,
        sceneId: undefined,
      };

      patchCharacterMutate({
        id: Number(currentCharacter.id),
        character: { ...updatedCharacter },
      });
    } else {
      createNewCharacterMutate({
        id: "",
        gender: String(editedGender),
        description: editedDescription,
        status: String(editedStatus),
        sceneId,
      });
    }
    setModalVisible(false);
    setCurrentCharacter(null);
    setEditedDescription("");
    setEditedGender("");
    setEditedStatus("");
    setIsEditing(false);
  };

  const renderItem = ({ item }: { item: Character }) => (
    <TouchableOpacity onPress={() => handleEdit(item)}>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.description}</Text>
          <Text style={styles.cardSubtitle}>{item.gender}</Text>
          <Text style={styles.cardSubtitle}>{item.status}</Text>
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
    setCurrentCharacter(null);
    setEditedDescription("");
    setEditedGender("");
    setEditedStatus("");
    setIsEditing(false);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.header}>Scene 1 🥊</Text>
      </View>
      {isRefetchingCharacterList && <ActivityIndicator size="large" />}
      {!isRefetchingCharacterList && (
        <FlatList
          data={characterList}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
      <TouchableOpacity style={styles.fab} onPress={handleAdd}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentCharacter(null);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {isEditing ? "Editar Personaje" : "Agregar Personaje"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Description"
            value={
              currentCharacter
                ? currentCharacter.description
                : editedDescription
            }
            onChangeText={(text) =>
              currentCharacter
                ? setCurrentCharacter({
                    ...currentCharacter,
                    description: text,
                  })
                : setEditedDescription(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="gender"
            value={
              currentCharacter ? String(currentCharacter.gender) : editedGender
            }
            onChangeText={(text) =>
              currentCharacter
                ? setCurrentCharacter({
                    ...currentCharacter,
                    gender: String(text),
                  })
                : setEditedGender(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="status"
            value={
              currentCharacter ? String(currentCharacter.status) : editedStatus
            }
            onChangeText={(text) =>
              currentCharacter
                ? setCurrentCharacter({
                    ...currentCharacter,
                    status: String(text),
                  })
                : setEditedStatus(text)
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

export default DashboardCharacter;
