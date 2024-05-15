import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { SafeAreaView } from 'react-native-safe-area-context';

const TodoList = () => {
  const params = useLocalSearchParams();
  console.log(params);
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [paramsArray, setParamsArray] = useState([]);
  const itemsArray = params.items ? params.items.split(',') : [];
  console.log(itemsArray);

  useEffect(() => {
    const storeParams = async () => {
      try {
        await AsyncStorage.setItem(`${params.title}`, JSON.stringify(itemsArray));
        setParamsArray(itemsArray);
        console.log('Params stored successfully');
      } catch (error) {
        console.error('Error storing params:', error);
      }
    }
    storeParams();
    retrieveTasks();
  }, []);

  const storeTasks = async () => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error storing tasks:', error);
    }
  };

  const retrieveTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error retrieving tasks:', error);
    }
  };

  const addTask = () => {
    if (task.trim() !== '') {
      const newTasks = [...tasks, task];
      setTasks(newTasks);
      setTask('');
      storeTasks();
    }
  };


  const removeTask = async (index) => {
    const completedTask = tasks[index];
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
    storeTasks();
    showToast(`Task "${completedTask}" completed`);
  };

  const removeParamsTask = async (index) => {
    const completedTask = paramsArray[index];
    const newParamsArray = [...paramsArray];
    newParamsArray.splice(index, 1);
    setParamsArray(newParamsArray);
    // storeTasks();
    showToast(`Task "${completedTask}" completed`);
  }
  

//   const removeTask = (index) => {
//     const completedTask = tasks[index];
//     const newTasks = [...tasks];
//     newTasks.splice(index, 1);
//     setTasks(newTasks);
//     storeTasks();
//     showToast(`Task "${completedTask}" completed`);
// };

  const showToast = (message) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  return (
    <View style={styles.container}>
      <Text style= {{fontSize: 40, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>{params.title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add a task"
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <ScrollView>
      <View style = {{flex: 1, flexWrap: 'wrap', flexDirection: 'row'}}>
      {paramsArray?.map((item, index) => (
        <View key={index} style={{paddingVertical: 15, paddingHorizontal: 30, borderWidth: 2, margin: 5, borderRadius: 20, borderColor: 'lightgray'}}>
          <Text style={{fontSize: 19, marginBottom: 8, alignItems: 'flex-start'}}>{item}</Text>
          <TouchableOpacity style={styles.deleteButton} onPress={() => removeParamsTask(index)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View> 
      ))}
        {tasks.map((task, index) => (
          <View key={index} style={{paddingVertical: 15, paddingHorizontal: 30, borderWidth: 2, margin: 5, borderRadius: 20,borderColor: 'lightgray'}}>
            <Text style={styles.taskText}>{task}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => removeTask(index)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    paddingVertical: 5,
  },
  taskText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  deleteButtonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TodoList;