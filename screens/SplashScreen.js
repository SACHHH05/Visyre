import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Animated as RNAnimated } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

const SplashScreen = ({ navigation }) => {
  const translateX = useSharedValue(-200);
  const fadeAnim = new RNAnimated.Value(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(200, {
        duration: 2000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );

    RNAnimated.timing(fadeAnim, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('HomeScreen');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const animatedGradientStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <LinearGradient
      colors={['#1a0004', '#33000a']} 
      style={styles.background}
    >
      <View style={styles.container}>
        <MaskedView
          style={{ height: 100 }}
          maskElement={
            <View style={styles.centered}>
              <Text style={styles.text}>Visyre</Text>
            </View>
          }
        >
          <AnimatedLinearGradient
            colors={['#66000E', '#FFF9F2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.gradient, animatedGradientStyle]}
          />
        </MaskedView>

        <RNAnimated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.tagline}>What You See is What We Decode</Text>
        </RNAnimated.View>
      </View>
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 60,
    fontWeight: 'bold',
    fontFamily: 'BebasNeue-Regular',
    color: 'black',
    letterSpacing: 2,
  },
  tagline: {
    marginTop: 20,
    fontSize: 18,
    color: '#FFF9F2',
    fontWeight: '300',
    fontFamily: 'BebasNeue-Regular',
    letterSpacing: 1,
  },
  gradient: {
    width: 400,
    height: 100,
  },
});


