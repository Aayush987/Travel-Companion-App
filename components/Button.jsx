import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

const Button = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => {
        router.navigate('/Sections');
      }}>
      <Entypo name="briefcase" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20, // Adjust bottom position as needed
    right: 20, // Adjust right position as needed
    zIndex: 999, // Ensure the button appears on top of other content
  },
  button: {
    backgroundColor: 'orange',
    borderRadius: 50,
    paddingVertical: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
});

export default Button;
