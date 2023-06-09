import { View, Text, Image, ScrollView, TouchableOpacity, Modal, TextInput, DrawerLayoutAndroid, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BouncyCheckbox from "react-native-bouncy-checkbox";

export default function App() {
  const initialState = {
    id: 0,
    title: "",
    description: '',
    completed: false
  }
  const [todo, setTodo] = useState([]);
  const [newTodo, setNewTodo] = useState(initialState);
  const [showModal, setShowModal] = useState(false);

  const getTodos = async () => {
    const Todos = await AsyncStorage.getItem("todo");
    // console.log(Todos);
    setNewTodo(JSON.parse(Todos) ? JSON.parse(Todos) : []);
  }

  const updateTodo = item => {
    const itemToBeUpdated = todo.filter(todoItem => todoItem.id == item.id);
    itemToBeUpdated[0].completed = !itemToBeUpdated[0].completed;

    const remainingItems = todo.filter(todoItem => todoItem.id != item.id)
    const updatedTodo = [...itemToBeUpdated, ...remainingItems];

    setTodo(updatedTodo);
    AsyncStorage.setItem('todo', JSON.stringify(updateTodo));
  }

  useEffect(() => {
    getTodos()
  }, [])

  const clear = () => {
    setNewTodo(initialState);
  }
  const fieldcheck = () => {
    if (!newTodo.title || !newTodo.description) {
      alert("Enpty Values can't be entered");
      return;
    }
    newTodo.id = todo.length + 1;
    const updatedTodo = [newTodo, ...todo];
    setTodo(updatedTodo);
    AsyncStorage.setItem("todo", JSON.stringify(updatedTodo));
    setShowModal(false);
    clear();
  }


  const displayTodo = (item, index) => (
    <TouchableOpacity onPress={()=> Alert.alert(`${item.title}`,`${item.description}`,[{text:item.completed ? 'Mark in Progress' : 'Mark Completed', onPress: () => updateTodo(item)},{text:'ok', style:'cancel',},])} key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, }}>
      <BouncyCheckbox isChecked={item.completed ? true : false} fillColor="blue" onPress={() => updateTodo(item)} />
      <Text style={{ color: "#000", fontSize: 16, width: '90%', textDecorationLine: item.completed ? "line-through" : "none" }}>{item.title}</Text>
    </TouchableOpacity>
  )
  const handleChange = (title, Value) => setNewTodo({ ...newTodo, [title]: Value });
  return (
    <View style={{ marginHorizontal: 20 }}>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 }}>
        <View>
          <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>Hey User 😎</Text>
          <Text style={{ fontSize: 16 }}>{todo.length} {todo.length <= 1 ? 'task' : 'tasks'}</Text>
        </View>
        <Image source={require('./assets/Logo.png')} style={{ height: 60, width: 60, borderRadius: 10, marginRight: -10 }} />
      </View>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: "bold" }}>To do📄</Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {
            todo.map((item, index) => !item.completed ? displayTodo(item, index) : null)
          }
        </View>
      </ScrollView>
      <Text style={{ color: '#000', fontSize: 22, fontWeight: 'bold' }}>Completed ✅</Text>
      <ScrollView>
        <View style={{ height: 250 }}>
          {todo.map(item => (item.completed ? displayTodo(item) : null))}
        </View>
      </ScrollView>
      <View style={{ display: 'flex', flexDirection: 'row', justifyContent: "flex-end" }}>
        <TouchableOpacity onPress={() => setShowModal(true)} style={{ display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'lightblue', borderRadius: 100, height: 60, width: 60 }}>
          <Text style={{ fontSize: 40, fontWeight: 'bold' }}>+</Text>
        </TouchableOpacity>
      </View>
      <Modal visible={showModal} animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={{ marginHorizontal: 20 }}>
          <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20 }}>
            <View>
              <Text style={{ color: '#000', fontSize: 28, fontWeight: 'bold' }}>
                <TouchableOpacity onPress={() => setShowModal(false)}><Text style={{ fontSize: 20 }}>🔙</Text></TouchableOpacity>
                Hey User 😎</Text>
              <Text style={{ fontSize: 16 }}>By Prateek Takthar</Text>
            </View>
            <Image source={require('./assets/Logo.png')} style={{ height: 60, width: 60, borderRadius: 10, marginRight: -10 }} />
          </View>
          <Text style={{ marginVertical: 20, color: '#000', fontSize: 22, fontWeight: 'bold' }}>Add a Todo item</Text>
          <TextInput placeholder="Title" value={newTodo.title} onChangeText={title => handleChange('title', title)} style={{ backgroundColor: 'rgb(220,220,220)', borderRadius: 10, paddingHorizontal: 10, marginVertical: 10 }} />
          <TextInput placeholder="Description" value={newTodo.description} onChangeText={desc => handleChange('description', desc)} style={{ backgroundColor: 'rgb(220,220,220)', borderRadius: 10, paddingHorizontal: 10, marginVertical: 10 }} multiline={true} numberOfLines={6} />
        </View>
        <View style={{ width: '100%', alignItems: 'center' }}>
          <TouchableOpacity onPress={fieldcheck} style={{ backgroundColor: "blue", width: 100, borderRadius: 10, alignItems: 'center', padding: 10 }}>
            <Text style={{ color: "#fff", fontSize: 19 }}>Add</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  )
}