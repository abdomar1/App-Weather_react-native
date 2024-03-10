import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Image,
  TextInput,
  Text,
} from 'react-native'; // Importez Text depuis react-native
import {theme} from '../theme';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {debounce} from 'lodash';
import {fetchLocations, fetchWeatherForecast} from '../api/weather';
import {weatherImages} from '../constants';
import * as Progress from 'react-native-progress';

export default function HomeScreen() {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setlocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoding] = useState(true);

  const handleLocations = loc => {
    // console.log('location', loc);
    setlocations([]);
    toggleSearch(false);
    setLoding(true);
    fetchWeatherForecast({
      cityName: loc.name,
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoding(false);
      // console.log('got forecast:', data);
    });
  };
  const handleSearch = value => {
    // console.log('value: ',value);
    // fetch locations
    if (value.length > 2) {
      fetchLocations({cityName: value}).then(data => {
        // console.log('got locations:',data);
        setlocations(data);
      });
    }
  };

  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  const fetchMyWeatherData = async () => {
    fetchWeatherForecast({
      cityName: 'casablanca',
      days: '7',
    }).then(data => {
      setWeather(data);
      setLoding(false);
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  const {current, location} = weather;

  return (
    <View style={{flex: 1, position: 'relative'}}>
      <StatusBar style="dark" />
      <Image
        blurRadius={70}
        source={require('../assets/images/bg.jpg')}
        style={{position: 'absolute', height: '100%', width: '100%'}}
      />
      {loading ? (
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Progress.Bar progress={0.3} width={200} />
          {/* <Text>loading</Text> */}
        </View>
      ) : (
        <SafeAreaView style={{flex: 1}}>
          <View
            style={{
              height: '7%',
              marginHorizontal: 16,
              position: 'relative',
              zIndex: 60,
              marginTop: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: 999,
                backgroundColor: showSearch
                  ? theme.bgwhite(0.2)
                  : 'transparent',
              }}>
              {showSearch ? (
                <TextInput
                  onChangeText={handleTextDebounce}
                  placeholder="Search city"
                  placeholderTextColor="lightgray"
                  style={{flex: 1, paddingHorizontal: 12, paddingTop: 10}}
                />
              ) : null}

              <TouchableOpacity
                onPress={() => toggleSearch(!showSearch)}
                style={{
                  backgroundColor: theme.bgwhite(0.3),
                  borderRadius: 999,
                  padding: 8,
                  margin: 4,
                  flexDirection: 'row', // Ensure items are arranged horizontally
                  alignItems: 'center', // Align items vertically in the center
                }}>
                <Image
                  source={require('../assets/images/search.png')}
                  style={{width: 20, height: 20}}
                />
              </TouchableOpacity>
            </View>
            {locations.length > 0 && showSearch ? (
              <View style={{position: 'absolute', width: '100%', top: 50}}>
                <View style={{backgroundColor: 'white', borderRadius: 20}}>
                  {locations.map((loc, index) => {
                    let showBorder = index + 1 !== locations.length;
                    let borderStyle = showBorder
                      ? {borderBottomWidth: 2, borderBottomColor: 'gray'}
                      : {};
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocations(loc)}
                        key={index}
                        style={{
                          padding: 10,
                          ...borderStyle,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={require('../assets/images/map.png')}
                          style={{width: 15, height: 15}}
                        />
                        <View style={{marginLeft: 10}}>
                          <Text style={{color: 'black', fontSize: 15}}>
                            {loc?.name}, {loc?.country}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ) : null}
          </View>
          {/* forecast section */}
          <View
            style={{
              marginLeft: 4,
              marginRight: 4,
              display: 'flex',
              justifyContent: 'space-around',
              flex: 1,
              margintop: '70px',
            }}>
            {/* location */}
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
              {location?.name},
              <Text style={{fontSize: 14, fontWeight: '600', color: '#718096'}}>
                {' ' + location?.country}
              </Text>
            </Text>
            {/* weather image */}
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  width: 200, // Définissez la taille souhaitée ici
                  height: 200, // Définissez la taille souhaitée ici
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  // source={weatherImages[current?.condition?.text]}
                  source={{uri: 'https:' + current?.condition?.icon}}
                  style={{
                    width: '100%',
                    height: '90%',
                    resizeMode: 'contain', // Pour conserver le rapport d'aspect
                  }}
                />
              </View>
              {/* degree celcius */}
              <View style={{marginBottom: 10}}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    fontSize: 48,
                  }}>
                  {current?.temp_c}°
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 28,
                    letterSpacing: 2,
                  }}>
                  {current?.condition?.text}
                </Text>
              </View>
            </View>
            {/* other stats */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                <Image
                  source={require('../assets/images/wind.png')}
                  style={{height: 24, width: 24, tintColor: 'white'}}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginLeft: 4,
                  }}>
                  {current?.wind_kph}Km
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 8,
                }}>
                <Image
                  source={require('../assets/images/drop.png')}
                  style={{height: 24, width: 24, tintColor: 'white'}}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginLeft: 4,
                  }}>
                  {current?.humidity}%
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../assets/images/sun.png')}
                  style={{height: 24, width: 24, tintColor: 'white'}}
                />
                <Text
                  style={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginLeft: 4,
                  }}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                </Text>
              </View>
            </View>
          </View>
          {/* forecast for next days */}
          <View style={{marginBottom: 20, marginTop: 30}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: 20,
                marginRight: 10,
              }}>
              <Image
                source={require('../assets/images/calendar.png')}
                style={{height: 24, width: 24, tintColor: 'white'}}
              />
              <Text style={{color: 'white', marginLeft: 10}}>
                daily forecast
              </Text>
            </View>

            <ScrollView
              horizontal
              contentContainerStyle={{paddingHorizontal: 15}}
              showsHorizontalScrollIndicator={false}>
              {weather?.forecast?.forecastday?.map((item, index) => {
                let date = new Date(item.date);
                let options = {weekday: 'long'};
                let dayName = date.toLocaleDateString('en-US', options);
                dayName = dayName.split(',')[0];
                return (
                  <View
                    key={index}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 80,
                      borderRadius: 12,
                      paddingVertical: 6,
                      marginRight: 4,
                      marginTop: 20,
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    }}>
                    <Image
                      // source={weatherImages[item?.day?.condition?.text]}
                      source={{uri: 'https:' + current?.condition?.icon}}
                      style={{height: 44, width: 44}}
                    />
                    <Text style={{color: 'white'}}>{dayName}</Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        fontWeight: 'bold',
                      }}>
                      {item?.day?.avgtemp_c}&#176;
                    </Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </SafeAreaView>
      )}
    </View>
  );
}
