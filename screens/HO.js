import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const [imageUri, setImageUri] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access media library is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      setResults(null);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return;

    setLoading(true);
    const formData = new FormData();

    const fileName = imageUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('image', {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,
    });

    try {
      const response = await fetch('http://\"your_IPV4":5000/extract_text', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#C7B7A3', '#6D2932']}
      style={styles.gradient}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Animated.Image
          source={require('./ho.png')}
          style={[styles.banner, { transform: [{ translateY: bounceAnim }] }]}
          resizeMode="contain"
        />

        <Text style={styles.title}>Got an image? Let’s see what’s inside!</Text>

        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an Image</Text>
        </TouchableOpacity>

        {imageUri && (
          <>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity style={styles.uploadBtn} onPress={uploadImage}>
              <Text style={styles.uploadText}>Extract Text</Text>
            </TouchableOpacity>
          </>
        )}

        {loading && <ActivityIndicator size="large" color="#F0E7D5" style={{ marginTop: 20 }} />}

        {results && (
          <View style={styles.resultCard}>
            <Text style={[styles.heading, { color: '#f2dca8ff',textAlign:"center",fontSize:30,fontFamily: 'BebasNeue-Regular' }]}>Raw Results</Text>
            {results.raw_results.map((item, idx) => (
              <Text key={idx} style={styles.rawText}>
                {item.text} ({item.confidence})
              </Text>
            ))}

            <Text style={[styles.heading, { color: '#f2dca8ff', marginTop: 20,textAlign:"center",fontSize:30,fontFamily: 'BebasNeue-Regular' }]}>Enhanced Results</Text>
            {results.enhanced_results.map((item, idx) => {
              let color = '#F0E7D5';
              if (item.confidence < 0.4) {
                color = '#F0E7D5';
              } else if (item.confidence < 0.7) {
                color = '#F0E7D5';
              }

              return (
                <Text key={idx} style={[styles.enhancedText, { color }]}>
                  {item.text} ({item.confidence})
                </Text>
              );
            })}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 60,
  },
  banner: {
    width: 250,
    height: 250,
    marginTop: 30,
  },
  title: {
    fontSize: 30,
    color: '#000000ff',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'BebasNeue-Regular'
  },
  button: {
    backgroundColor: '#6D2932',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#F0E7D5',
    fontSize: 23,
    fontWeight: '600',
    fontFamily: 'BebasNeue-Regular',
  },
  preview: {
    width: 300,
    height: 300,
    marginVertical: 20,
    resizeMode: 'contain',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  uploadBtn: {
    backgroundColor: '#6D2932',
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  uploadText: {
    color: '#F0E7D5',
    fontWeight: '600',
    fontSize: 23,
    fontFamily: 'BebasNeue-Regular'
  },
  resultCard: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#722f37',
    borderRadius: 16,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'BebasNeue-Regular',
  },
  rawText: {
    fontSize: 23,
    color: '#F0E7D5',
    marginBottom: 6,
    fontFamily: 'BebasNeue-Regular',
  },
  enhancedText: {
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 8,
    fontFamily: 'BebasNeue-Regular',
  },
});
