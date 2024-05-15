import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter, router, Link } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
// import { useNavigation } from 'expo-router';

const headings = [
    { title: 'Basic Needs', items: "Water bottle,Snacks,First aid kit,Flashlight" },
    { title: 'Clothing', items: "T-shirts',Pants,Shirts,Socks,Jacket" },
    { title: 'Health', items: "Medications,Hand sanitizer,Sunscreen,Insect repellent" },
    { title: 'Technology', items: "Phone,Charger,Power bank, Earphones" },
    { title: 'Baby Needs', items: "Diapers,Baby wipes,Baby food,Toys" },
    { title: 'Personal Care', items: "Toothbrush,Toothpaste,Shampoo,Soap" },
  ];

const Sections = () => {
    const Navigation = useNavigation();
    const onPressSection = (title, items) => {
        Navigation.navigate('TodoList', { title: title, items: items });
    };
    return (
      <View style = {{flex: 1}}>
        <Text style={{fontSize: 40, fontWeight: 'bold', textAlign: 'center', padding: 20}}>Packing List</Text>
        <View style={{flex: 1, flexWrap: 'wrap',flexDirection: 'row'}}>
        {headings.map(({ title, items }) => (
          <TouchableOpacity
            key={title}
            style={{paddingTop: 35, paddingBottom: 35,paddingLeft: 30, paddingRight: 30, borderWidth: 2, marginVertical: 40, marginHorizontal: 10,  borderRadius: 20, backgroundColor: 'lightblue'}}
            onPress={() => onPressSection(title, items)}
          >
            <Link href = {{
                pathname: '/TodoList',
                params: {
                    title: title,
                    items: items
                }
            }}>
            <Text style={styles.sectionHeading}>{title}</Text>
            </Link>
          </TouchableOpacity>

        ))}
      </View>
    </View>
      );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
      flexDirection: 'row',
      flexWrap: 'wrap', // Items will wrap to the next line when there's not enough space
      justifyContent: 'space-between', // Align sections to the left and right
    },
    sectionHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      },
  });


export default Sections

