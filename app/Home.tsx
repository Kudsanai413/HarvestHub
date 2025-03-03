import {
  createDrawerNavigator,
  useDrawerProgress,
} from '@react-navigation/drawer';
import { View } from "react-native"
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

function HomeScreen() {
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * -100 }],
  }));

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={[
          {
            height: 100,
            aspectRatio: 1,
            backgroundColor: 'tomato',
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}