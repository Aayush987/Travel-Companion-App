import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Linking, ScrollView, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
// import { AntDesign } from '@expo/vector-icons';

const index = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [arr, setArr] = useState({});
  const [bookingarr, setBookingarr] = useState([]);


  

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const options = {
  //       method: 'GET',
  //       url: 'https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary',
  //       params: {
  //         tr_longitude: '77.21126344612007',
  //         tr_latitude: '28.688268570195152',
  //         bl_longitude: '78.17852132968679',
  //         bl_latitude: '26.22083801001755',
  //         currency: 'USD',
  //         lunit: 'km',
  //         lang: 'en_US'
  //       },
  //       headers: {
  //         'X-RapidAPI-Key': '7d1c974449msh80a181e004dbd09p1a38e9jsn5a493656c296',
  //         'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
  //       }
  //     };
    
  //     try {
  //       const response = await axios.request(options);
  //       setData(response.data.data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  const fetchData = async () => {
    try {
      // Check if data exists in AsyncStorage
      const storedData = await AsyncStorage.getItem('travelData');
      if (storedData !== null) {
        console.log('Data fetched from AsyncStorage');
        // If data exists, parse and set it to state
        setData(JSON.parse(storedData));
      } else {
        // If data doesn't exist, fetch it from the API
        const response = await axios.get('https://travel-advisor.p.rapidapi.com/attractions/list-in-boundary', {
          params: {
            tr_longitude: '91.29662486728293',
            tr_latitude: '27.82391354728484',
            bl_longitude: '76.72581936927968',
            bl_latitude: '9.397184310473113',
            currency: 'USD',
            lunit: 'km',
            lang: 'en_US'
          },
          // params: {
          //   tr_longitude: '77.21126344612007',
          //   tr_latitude: '28.688268570195152',
          //   bl_longitude: '78.17852132968679',
          //   bl_latitude: '26.22083801001755',
          //   currency: 'USD',
          //   lunit: 'km',
          //   lang: 'en_US'
          // },
          headers: {
            'X-RapidAPI-Key': '7d1c974449msh80a181e004dbd09p1a38e9jsn5a493656c296',
            'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
          }
        });
        setData(response.data.data);
        // Store the fetched data in AsyncStorage
        await AsyncStorage.setItem('travelData', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const onRefresh = () => {
    // Set refreshing to true when refreshing starts
    setRefreshing(true);
  };

  useEffect(() => {
    if (refreshing) {
      if (data.length !== 0) {
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomAttraction = data[randomIndex];
        setArr(randomAttraction);
        const bookingArray = randomAttraction?.offer_group?.offer_list || [];
        setBookingarr(bookingArray);
      }

      // Set refreshing to false after the timeout to mimic data fetching
      const timeout = setTimeout(() => {
        setRefreshing(false);
      }, 2000); // Adjust the timeout duration as needed

      // Cleanup function to clear the timeout when the component unmounts or the effect runs again
      return () => clearTimeout(timeout);
    }
  }, [refreshing, data]);

    
  // useEffect(() => {
  //   if(data.length !== 0) {
  //     const randomIndex = Math.floor(Math.random() * data.length);
  //     const randomAttraction = data[randomIndex];
  //     setArr(randomAttraction);
  //     const bookingArray = randomAttraction?.offer_group?.offer_list || [];
  //     setBookingarr(bookingArray);
  //   }
  // }, [data]);

  const openUrl = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}
    >
    {data.length === 0 ? (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Loading...</Text>
      </View>
    ) : (
      <>
        <SafeAreaView style={styles.imageContainer}>
          <Image source={{ uri: arr?.photo?.images?.large?.url }} style={styles.attractionImage} />
        </SafeAreaView>
        <Button />
      <ScrollView 
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1DA1F2" // Adjust color as needed
            />
          }
      >
        <View style={styles.attractionDetails}>
          <Text style={styles.attractionName}>{arr.name}</Text>
          <Text style={styles.attractionLocation}>{arr.location_string}</Text>
          <Text style={styles.attractionRating}>Rating: {arr.rating}</Text>
          {/* <AntDesign name="staro" size={24} color="black" /> */}
          
        </View>
        <SafeAreaView style={styles.bookingContainer}>
         
          <Text style={styles.bookingHeaderText}>Bookings and Hotel</Text>
          {bookingarr.length !== 0 ? (
        <ScrollView>
          <FlatList
              data={bookingarr}
              keyExtractor={(item) => item.product_code}
              renderItem={({ item }) => (
                <View style={styles.bookingItem}>
                  <Text style={styles.bookingTitle}>{item.title}</Text>
                  <Image source={{ uri: item.image_url }} style={styles.bookingImage} />
                  <Text style={styles.bookingPartner}>{item.partner}</Text>
                  <Text style={styles.bookingPrice}>{item.price}</Text>         
                  <Text style={styles.bookNowLink} onPress={() => openUrl(item.url)}>Book Now</Text>
                </View>
              )}
              horizontal
            />
        </ScrollView>
          ) : (
            <Text>No booking status for now</Text>
          )}
        </SafeAreaView>
        </ScrollView>
      </>
    )}
  </ScrollView>
);
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 0,
      },
    imageContainer: {
      width: '110%',
      height: '50%',
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 5,
      backgroundColor: '#fff',
      borderRadius: 10,
      borderBottomColor: 'lightgray',
      borderBottomWidth: 10,
      borderTopWidth: 5,
      borderTopColor: 'lightgray',
    //   position: 'absolute', // Add absolute positioning
    //   top: 0, // Position at the top
    },
    attractionImage: {
      width: '100%',
      height: '100%',
     
    },
    attractionDetails: {
      padding: 20,
      backgroundColor: '#f9f9f9',
      marginBottom: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    attractionName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    attractionLocation: {
      fontSize: 18,
      color: '#555',
      marginBottom: 5,
    },
    attractionRating: {
      fontSize: 16,
      color: '#777',
      marginBottom: 5,
    },
    aboutLink: {
      color: 'blue',
      textDecorationLine: 'underline',
    },
    bookingContainer: {
      padding: 20,
      backgroundColor: '#f9f9f9',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      marginBottom: 20,
      width: '100%',
    },
    bookingHeaderText: {
      fontSize: 30,
      textAlign: 'center',  
      fontWeight: 'bold',
      marginBottom: 10,
    },
    bookingItem: {
      backgroundColor: '#fff',
      marginRight: 10,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      width: 250,
      padding: 10,
    },
    bookingTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      padding: 10,
    },
    bookingImage: {
      width: '100%',
      height: 150,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    bookingPartner: {
      marginTop: 5,
      fontSize: 14,
      color: '#555',
      paddingLeft: 10,
    },
    bookingPrice: {
      fontSize: 14,
      color: '#777',
      paddingLeft: 10,
    },
    bookNowLink: {
      marginTop: 5, 
      fontSize: 14,
      color: 'white',
      backgroundColor: 'blue',
      textDecorationLine: 'none',
      // paddingLeft: 10,
      // paddingBottom: 10,
      textAlign: 'center',
      borderRadius: 10,
      padding: 7
    },

});

export default index;
