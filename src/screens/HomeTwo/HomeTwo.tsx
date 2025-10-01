import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {APP_IMAGE} from '../../../assets/images';
import {useGyroSound} from '../../hooks/useGyroSound';
import Controller from '../../components/Controller';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';
import {
  ControllerButtonId,
  NavgationNames,
} from '../../constants/NavgationNames';
import {isTablet} from 'react-native-device-info';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const imageGroups = [
  [
    APP_IMAGE.BMW_1_1,
    APP_IMAGE.BMW_1_2,
    APP_IMAGE.BMW_1_3,
    APP_IMAGE.BMW_1_4,
    APP_IMAGE.BMW_1_5,
    APP_IMAGE.BMW_1_6,
    APP_IMAGE.BMW_1_7,
    APP_IMAGE.BMW_1_8,
    APP_IMAGE.BMW_1_9,
    APP_IMAGE.BMW_1_10,
    APP_IMAGE.BMW_1_11,
  ],
  [
    APP_IMAGE.BMW_2_1,
    APP_IMAGE.BMW_2_2,
    APP_IMAGE.BMW_2_3,
    APP_IMAGE.BMW_2_4,
    APP_IMAGE.BMW_2_5,
    APP_IMAGE.BMW_2_6,
    APP_IMAGE.BMW_2_7,
    APP_IMAGE.BMW_2_8,
  ],
  [
    APP_IMAGE.BMW_3_1,
    APP_IMAGE.BMW_3_2,
    APP_IMAGE.BMW_3_3,
    APP_IMAGE.BMW_3_4,
    ,
    APP_IMAGE.BMW_3_5,
    APP_IMAGE.BMW_3_6,
    APP_IMAGE.BMW_3_7,
    APP_IMAGE.BMW_3_8,
  ],
  [
    APP_IMAGE.BMW_4_1,
    APP_IMAGE.BMW_4_2,
    APP_IMAGE.BMW_4_3,
    APP_IMAGE.BMW_4_4,
    APP_IMAGE.BMW_4_5,
    APP_IMAGE.BMW_4_6,
    APP_IMAGE.BMW_4_7,
    APP_IMAGE.BMW_4_8,
    APP_IMAGE.BMW_4_9,
    APP_IMAGE.BMW_4_10,
  ],
  [
    APP_IMAGE.BMW_5_1,
    APP_IMAGE.BMW_5_2,
    APP_IMAGE.BMW_5_3,
    APP_IMAGE.BMW_5_4,
    APP_IMAGE.BMW_5_5,
    APP_IMAGE.BMW_5_6,
    APP_IMAGE.BMW_5_7,
    APP_IMAGE.BMW_5_8,
    APP_IMAGE.BMW_5_9,
    APP_IMAGE.BMW_5_10,
    APP_IMAGE.BMW_5_11,
    APP_IMAGE.BMW_5_12,
    APP_IMAGE.BMW_5_13,
  ],
  [
    APP_IMAGE.BMW_10_1,
    APP_IMAGE.BMW_10_2,
    APP_IMAGE.BMW_10_3,
    APP_IMAGE.BMW_10_4,
    APP_IMAGE.BMW_10_5,
    APP_IMAGE.BMW_10_6,
    APP_IMAGE.BMW_10_7,
    APP_IMAGE.BMW_10_8,
    APP_IMAGE.BMW_10_9,
    APP_IMAGE.BMW_10_10,
  ],
  [
    APP_IMAGE.BMW_6_1,
    APP_IMAGE.BMW_6_2,
    APP_IMAGE.BMW_6_3,
    APP_IMAGE.BMW_6_4,
    APP_IMAGE.BMW_6_5,
  ],
  [
    APP_IMAGE.BMW_7_1,
    APP_IMAGE.BMW_7_2,
    APP_IMAGE.BMW_7_3,
    APP_IMAGE.BMW_7_4,
    APP_IMAGE.BMW_7_5,
    APP_IMAGE.BMW_7_6,
    APP_IMAGE.BMW_7_7,
    APP_IMAGE.BMW_7_8,
    APP_IMAGE.BMW_7_9,
    APP_IMAGE.BMW_7_10,
  ],
  [
    APP_IMAGE.BMW_8_1,
    APP_IMAGE.BMW_8_2,
    APP_IMAGE.BMW_8_3,
    APP_IMAGE.BMW_8_4,
    APP_IMAGE.BMW_8_5,
    APP_IMAGE.BMW_8_6,
    APP_IMAGE.BMW_8_7,
    APP_IMAGE.BMW_8_8,
    APP_IMAGE.BMW_8_9,
    APP_IMAGE.BMW_8_10,
    APP_IMAGE.BMW_8_11,
    APP_IMAGE.BMW_8_12,
    APP_IMAGE.BMW_8_13,
    APP_IMAGE.BMW_8_14,
    APP_IMAGE.BMW_8_15,
    APP_IMAGE.BMW_8_16,
  ],
  [
    APP_IMAGE.BMW_9_1,
    APP_IMAGE.BMW_9_2,
    APP_IMAGE.BMW_9_3,
    APP_IMAGE.BMW_9_4,
    APP_IMAGE.BMW_9_5,
    APP_IMAGE.BMW_9_6,
    APP_IMAGE.BMW_9_7,
  ],
];

const sounds = [
  ['bmw_1.mp3', 'bmw_2.mp3'],
  ['bmw_2.mp3'],
  ['bmw_3.mp3'],
  ['bmw_4.mp3'],
  ['bmw_5.mp3'],
  ['bmw_10.mp3'],
  ['bmw_6.mp3'],
  ['bmw_7.mp3'],
  ['bmw_8.mp3'],
  ['bmw_9.mp3'],
];

const HomeTwo = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const [currentID, setCurrentID] = useState<string | null>(null);

  const motorsportData = useMemo(() => {
    return imageGroups.map((images, index) => {
      const key = `moterListText.${index}`;
      return {
        id: Object.values(ControllerButtonId)[index],
        title: t(`${key}.title`),
        model: t(`${key}.model`),
        engine: t(`${key}.engine`),
        enginDetail: t(`${key}.enginDetail`),
        topSpeed: t(`${key}.topSpeed`),
        yearRange: t(`${key}.yearRange`),
        power: t(`${key}.power`),
        chassis: t(`${key}.chassis`),
        images,
        sound: sounds[index],
      };
    });
  }, [t]);

  const {startSound, stop, isPlaying} = useGyroSound(
    motorsportData.find(elem => elem.id === currentID)?.sound[0] || '',
  );

  const anim = {
    childrenOpacity: useSharedValue(1),
    middleImageScale: useSharedValue(1),
    middleImageTop: useSharedValue(SCREEN_HEIGHT * 0.2),
    middleImageWidth: useSharedValue(SCREEN_WIDTH * 0.35),
    middleImageHeight: useSharedValue(SCREEN_HEIGHT * 0.35),
    middleImageOpacity: useSharedValue(1),
    topImageScale: useSharedValue(1),
  };

  const applyAnimation = useCallback((expanded: boolean) => {
    const duration = 800;
    const easing = Easing.inOut(Easing.ease);

    anim.childrenOpacity.value = withTiming(expanded ? 1 : 0, {duration: 300});
    anim.middleImageScale.value = withTiming(1, {duration, easing});
    anim.middleImageTop.value = withTiming(
      expanded ? isTablet() ? SCREEN_HEIGHT * 0.15 : SCREEN_HEIGHT * 0.09 : 0,
      {
        duration,
        easing,
      },
    );
    anim.middleImageWidth.value = withTiming(
      expanded
        ? isTablet()
          ? SCREEN_WIDTH * 0.43
          : SCREEN_WIDTH * 0.38
        : SCREEN_WIDTH,
      {duration, easing},
    );
    anim.middleImageHeight.value = withTiming(
      expanded ? isTablet() ? SCREEN_HEIGHT * 0.34 :  SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT,
      {duration, easing},
    );
    anim.topImageScale.value = withTiming(expanded ? 1 : 0, {duration, easing});
    anim.middleImageOpacity.value = withTiming(expanded ? 1 : 0, {
      duration,
      easing,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params?.noAnimation) {
        applyAnimation(true);
      } else {
        applyAnimation(true); // Animate in normally
      }

      return () => {
        navigation.setParams({noAnimation: false});
        stop();
      };
    }, [route.params?.noAnimation]),
  );

  useEffect(() => {
    if (currentID) startSound();
  }, [currentID]);

  const childrenAnimStyle = useAnimatedStyle(() => ({
    opacity: anim.childrenOpacity.value,
  }));

  const middleImageAnimStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    top: anim.middleImageTop.value,
    width: anim.middleImageWidth.value,
    height: anim.middleImageHeight.value,
    transform: [{scale: anim.middleImageScale.value}],
    opacity: anim.middleImageOpacity.value,
  }));

  const topImageAnimStyle = useAnimatedStyle(() => ({
    transform: [{scale: anim.topImageScale.value}],
  }));

  const handleNextPageNavigation = (buttonId: string) => {
    applyAnimation(false);
    setTimeout(() => {
      const selectedCar = motorsportData.find(elem => elem.id === buttonId);
      navigation.navigate(NavgationNames.EngineDetail, {selectedCar});
    }, 400);
  };

  const handleButtonPress = (buttonId: string) =>
    handleNextPageNavigation(buttonId);

  const handleButtonLongPress = (buttonId: string) => {
    setCurrentID(prev => (prev === buttonId ? null : buttonId));
  };

  const handleOnPressOut = () => {
    if (isPlaying) stop();
  };

  return (
    <StackedFastImageLayout
      backgroundImage={APP_IMAGE.HomeBG}
      middleImage={APP_IMAGE.border_2}
      topImage={APP_IMAGE.FullController}
      containerStyle={{height: '100%'}}
      childrenStyle={styles.viewStyle}
      childrenAnimStyle={childrenAnimStyle}
      middleImageAnimStyle={middleImageAnimStyle}
      topImageAnimStyle={topImageAnimStyle}>
      <Controller
        onButtonPress={handleButtonPress}
        onButtonLongPress={handleButtonLongPress}
        onPressOut={handleOnPressOut}
        disabled={false}
      />
    </StackedFastImageLayout>
  );
};

const styles = StyleSheet.create({
  viewStyle: {
    top: '0%',
  },
});

export default HomeTwo;
