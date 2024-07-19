import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useQuery, useMutation } from "react-query";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../navigation/StackNavigator";
import { Film } from "../types/film";
import {
  createFilm,
  deleteFilm,
  getAllFilms,
  patchFilm,
} from "../services/film-service";















type DashboardScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Dashboard"
>;

const DashboardScreen: React.FC = () => {
  const navigation = useNavigation<DashboardScreenNavigationProp>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFilm, setCurrentFilm] = useState<Film | null>(null);
  const [newFilmTitle, setNewFilmTitle] = useState("");
  const [newFilmDirector, setNewFilmDirector] = useState("");
  const [newFilmduration, setNewFilmduration] = useState("");

  const { data: filmList, refetch: refetchFilmList } = useQuery({
    queryFn: getAllFilms,
  });
  const { mutate: createFilmMutate } = useMutation(createFilm, {
    onSuccess: () => {
      refetchFilmList();
    },
  });

  const { mutate: deleteFilmMutate } = useMutation(deleteFilm, {
    onSuccess: () => {
      refetchFilmList();
    },
  });

  const { mutate: patchFilmMutate } = useMutation(patchFilm, {
    onSuccess: () => {
      refetchFilmList();
    },
  });

  const handleEdit = (film: Film) => {
    setCurrentFilm(film);
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    // const newFilmList = filmList.filter((film) => film.id !== id);
    // setFilmList(newFilmList);
    deleteFilmMutate(Number(id));
  };

  const handleSave = () => {
    if (currentFilm) {
      // const newFilmList = filmList.map((film) =>
      //   film.id === currentFilm.id ? { ...currentFilm } : film
      // );
      //setFilmList(newFilmList);
      const updateFilm: Partial<Film> = { ...currentFilm, id: undefined };

      patchFilmMutate({ id: Number(currentFilm.id), film: { ...updateFilm } });
      setModalVisible(false);
      setCurrentFilm(null);
    }
  };

  const handleAddFilm = () => {
    // const newFilm: Film = {
    //   id: String(filmList.length + 1),
    //   title: newFilmTitle,
    //   director: newFilmDirector,
    //   duration: newFilmduration,
    // };
    // setFilmList([...filmList, newFilm]);
    setModalVisible(false);
    setNewFilmTitle("");
    setNewFilmDirector("");
    setNewFilmduration("");

    createFilmMutate({
      director: newFilmDirector,
      duration: Number(newFilmduration),
      title: newFilmTitle,
      id: "",
    });
  };

  const renderItem = ({ item }: { item: Film }) => (
    <TouchableOpacity onPress={() => navigation.navigate("Scenes")}>
      <View style={styles.card}>
        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardSubtitle}>{item.director}</Text>
          <Text style={styles.cardSubtitle}>{item.duration}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <MaterialCommunityIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <MaterialCommunityIcons name="delete" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.header}>DASHBOARD</Text>
      <Text style={styles.subHeader}>FILMS</Text>
      <FlatList
        data={filmList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setCurrentFilm(null);
        }}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalText}>
            {currentFilm ? "Edit Film" : "Add New Film"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Title"
            value={currentFilm ? currentFilm.title : newFilmTitle}
            onChangeText={(text) =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, title: text })
                : setNewFilmTitle(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Director"
            value={currentFilm ? currentFilm.director : newFilmDirector}
            onChangeText={(text) =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, director: text })
                : setNewFilmDirector(text)
            }
          />
          <TextInput
            style={styles.input}
            placeholder="duration"
            value={currentFilm ? String(currentFilm.duration) : newFilmduration}
            onChangeText={(text) =>
              currentFilm
                ? setCurrentFilm({ ...currentFilm, duration: Number(text) })
                : setNewFilmduration(text)
            }
          />
          <TouchableOpacity
            style={styles.saveButton}
            onPress={currentFilm ? handleSave : handleAddFilm}
          >
            <Text style={styles.saveButtonText}>
              {currentFilm ? "Save" : "Add Film"}
            </Text>
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
  header: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "bold",
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
    width: 60,
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
  backButton: {
    position: "absolute",
    top: 70,
    left: 100,
    zIndex: 10,
  },
});

export default DashboardScreen;
