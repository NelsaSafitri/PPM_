import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const SWIPE_LIMIT = width * 0.25;

const DATA = [
  { name: 'Charles Leclerc, 28', image: require('@/assets/images/img1.jpg') },
  { name: 'George Russell, 27', image: require('@/assets/images/img2.jpg') },
  { name: 'Jeon Jungkook, 28', image: require('@/assets/images/img3.jpg') },
  { name: 'Vincent Rompis, 25', image: require('@/assets/images/img4.jpg') },
  { name: 'Iqbaal Ramadhan, 25', image: require('@/assets/images/img5.jpg') },
  { name: 'Christian Yu, 34', image: require('@/assets/images/img6.jpg') },
];

function Card({ item, index, isTop, onSwipe }: any) {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  // GESTURE RINGAN
  const pan = Gesture.Pan()
    .onUpdate(e => {
      if (!isTop) return;
      x.value = e.translationX;
      y.value = e.translationY;
    })
    .onEnd(e => {
      if (!isTop) return;

      if (Math.abs(x.value) > SWIPE_LIMIT) {
        const dir = x.value > 0 ? 1 : -1;
        x.value = withSpring(
          dir * width * 1.3,
          { damping: 18, stiffness: 140 },
          () => runOnJS(onSwipe)()
        );
      } else {
        x.value = withSpring(0, { damping: 18 });
        y.value = withSpring(0);
      }
    });

  // ANIMASI RINGAN (NO SCALE, NO BLUR)
  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(x.value, [-width, 0, width], [-10, 0, 10]);

    return {
      transform: [
        { translateX: x.value },
        { translateY: y.value },
        { rotate: `${rotate}deg` },
      ],
    };
  });

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [40, 120], [0, 1], 'clamp'),
  }));

  const nopeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(x.value, [-120, -40], [1, 0], 'clamp'),
  }));

  const content = (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        { top: index * 8 }, // STACK RINGAN
      ]}
    >
      {/* FOTO FULL CARD */}
      <Image source={item.image} style={styles.image} resizeMode="cover" />

      {/* GRADIENT PALSU (RINGAN) */}
      <View style={styles.gradient} />

      {/* NAMA */}
      <Text style={styles.name}>{item.name}</Text>

      {/* ICON */}
      {isTop && (
        <>
          <Animated.Text style={[styles.like, likeStyle]}>❤️</Animated.Text>
          <Animated.Text style={[styles.nope, nopeStyle]}>❌</Animated.Text>
        </>
      )}
    </Animated.View>
  );

  return isTop ? (
    <GestureDetector gesture={pan}>{content}</GestureDetector>
  ) : (
    content
  );
}

export default function SwipeableCard() {
  const [cards, setCards] = useState(DATA);

  const handleSwipe = () => {
    setCards(prev => prev.slice(1));
  };

  return (
    <View style={styles.container}>
      {cards
        .slice(0, 3)
        .map((item, index) => (
          <Card
            key={item.name}
            item={item}
            index={index}
            isTop={index === 0}
            onSwipe={handleSwipe}
          />
        ))
        .reverse()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: width * 0.9,
    height: height * 0.65,
    borderRadius: 24,
    position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  gradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 160,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },

  name: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },

  like: {
    position: 'absolute',
    top: 50,
    left: 30,
    fontSize: 46,
  },

  nope: {
    position: 'absolute',
    top: 50,
    right: 30,
    fontSize: 46,
  },
});
