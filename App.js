import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, Button, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { PERMISSIONS, check, request, RESULTS } from 'react-native-permissions'

const App = () => {

  const [location, setLocation] = useState(false);

  const handleLocationPermission = async () => {
    try {
      const res = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      console.log(res);
      
      if (res === RESULTS.GRANTED) {
        return true;
      } else if (res === RESULTS.DENIED) {
        const res2 = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (res2 === RESULTS.GRANTED){
          return true;
        } else {
          return false;
        }
      }
      console.log(res === RESULTS.UNAVAILABLE);
      console.log("Error 49");
    } catch(error){
      console.log(error)
    }
  };
  
  useEffect(() => {
    handleLocationPermission(); 
  }, []);

  const getLocation = () => {
    const result = handleLocationPermission();
    result.then(res => {
      console.log('res is:', res);
      if (res) {
        Geolocation.getCurrentPosition(
          position => {
            console.log(position);
            setLocation(position);
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setLocation(false);
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text>React Native Geolocation Demo</Text>
      <View
        style={{marginTop: 10, padding: 10, borderRadius: 10, width: '40%'}}>
        <Button title="Get Location" onPress={getLocation} />
      </View>
      <Text>Latitude: {location ? location.coords.latitude : null}</Text>
      <Text>Longitude: {location ? location.coords.longitude : null}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;