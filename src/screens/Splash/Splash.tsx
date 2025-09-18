import React, {useEffect, useCallback} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import {NavgationNames} from '../../constants/NavgationNames';

import AppBackground from '../../components/SplashBackground';
import ImageBackgroundImage from '../../components/ImageBackgroundImage';
import FastImage from '@d11/react-native-fast-image';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import {APP_IMAGE} from '../../../assets/images';
import {storage} from '../../utils/storage';
import AppText from '../../components/AppText';
import {theme} from '../../constants/theme';
import i18n from '../../localization/i18n';
import {isTablet} from 'react-native-device-info';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';

const {height, width} = Dimensions.get('window');
const AnimatedFastImage = Animated.createAnimatedComponent(FastImage);
const LAST_PRESSED_BUTTON_ID_KEY = 'lastPressedButtonId';


const SplashScreen = () => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const scale = useSharedValue(0.1);

  const animate = useCallback(() => {
    scale.value = withTiming(1.5, {
      duration: 1000,
      easing: Easing.out(Easing.linear),
    });

    setTimeout(() => {
      const isLangSelected = storage.getString('lang');
      storage.set(LAST_PRESSED_BUTTON_ID_KEY, '')
      isLangSelected && i18n.changeLanguage(isLangSelected);
      navigation.replace(
        isLangSelected ? NavgationNames.homeTwo : NavgationNames.home,
        {noAnimation: true},
      );
    }, 1200);
  }, []);

  useEffect(() => {
    storage.set('isFirstLoaded', '');
    setTimeout(() => {
      animate();
    }, 300);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <>
      {/* <AppBackground
        backgroundImage={APP_IMAGE.splashBG}
        controllerImage={APP_IMAGE.controler}
        style={styles.mainView}>
        <ImageBackgroundImage
          source={APP_IMAGE.CarbonLayer}
          imageStyle={styles.blurImage}
          resizeMode={'stretch'}
          style={styles.centeredContent}>
          <ImageBackgroundImage
            source={APP_IMAGE.RectangleBlur}
            imageStyle={styles.blurInnerImage}
            style={styles.centeredPurpleContent}>
            <AppText size={ isTablet() ? 'lg' : 'md'} style={styles.title}>
              {t('splash_title').toUpperCase()}
            </AppText>
          </ImageBackgroundImage>
        </ImageBackgroundImage>
      </AppBackground> */}
      <StackedFastImageLayout
        backgroundImage={APP_IMAGE.splashBG}
        middleImage={APP_IMAGE.CarbonLayer}
        topImage={APP_IMAGE.controler}
        topImageStyle={styles.topImageStyle}
        containerStyle={{height: '100%'}}
        middleImageStyle={styles.middleImageStyle}
        childrenStyle={{}}>
        <ImageBackgroundImage
          source={APP_IMAGE.RectangleBlur}
          imageStyle={styles.blurInnerImage}
          style={styles.centeredPurpleContent}>
          <AppText size={isTablet() ? 'lg' : 'md'} style={styles.title}>
            {t('splash_title').toUpperCase()}
          </AppText>
        </ImageBackgroundImage>
      </StackedFastImageLayout>

      <View style={styles.animatedLayer}>
        <AnimatedFastImage
          source={APP_IMAGE.Lineanimation}
          style={[styles.fullSize, animatedStyle]}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: theme.color.green,
    fontWeight: 'bold',
    textAlign: 'center',
    // top: height * 0.1,
  },
  mainView: {
    top: height * 0.6,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredPurpleContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurImage: {
    height: isTablet() ? height * 0.4 : height * 0.5,
    width: isTablet() ? height * 0.4 : width * 0.25,
    backgroundColor: 'red',
  },
  blurInnerImage: {
    height: height * 0.5,
    width: width * 0.5,
    // top: -height * 0.07,
    // backgroundColor:'red'
  },
  animatedLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullSize: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },

  topImageStyle: {
    width: '90%',
    height: '70%',
    alignSelf: 'center',
    bottom: 0,
  },
  middleImageStyle: {
    top: height * 0.33,
    width: isTablet() ? width * 0.45 : width * 0.25,
    height: height * 0.5,
  },
});

export default SplashScreen;
