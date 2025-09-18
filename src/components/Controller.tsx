import React, {useRef, useEffect, useState, useCallback} from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {useTranslation} from 'react-i18next';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {theme} from '../constants/theme';
import {storage} from '../utils/storage';
import {ControllerButtonId, NavgationNames} from '../constants/NavgationNames';
import {isTablet} from 'react-native-device-info';
import AppText from './AppText';
import {APP_IMAGE} from '../../assets/images';
import Share from 'react-native-share';
import ArrowAnimated from './AnimatedArrow';

const LAST_PRESSED_BUTTON_ID_KEY = 'lastPressedButtonId';
const animatedBorderWidhValue = isTablet() ? 12 : 6;

const Controller = ({
  onButtonPress = (buttonId: string) => {},
  onButtonLongPress = (buttonId: string) => {},
  onPressOut = () => {},
  containerStyle = {},
  buttonStyle = {},
  disabled = false,
}) => {
  const {height: screenHeight} = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(0);
  const [lastSelectedButton, setLastSelectedButton] = useState<string | null>(
    null,
  );
  const {t} = useTranslation();
  const navigation = useNavigation();

  // ⭐️ ANIMATION LOGIC ⭐️
  const animatedValue = useRef(new Animated.Value(0)).current;

  // Animation for the pulsing white border
  const animateBorder = useCallback(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        animateBorder();
      }
    });
  }, [animatedValue]);

  // Start/stop animation based on lastSelectedButton state
  useEffect(() => {
    if (lastSelectedButton !== null) {
      animateBorder();
    } else {
      animatedValue.stopAnimation();
    }
  }, [lastSelectedButton, animateBorder, animatedValue]);

  // Restore last selected button whenever screen gains focus
  useFocusEffect(
    useCallback(() => {
      const storedButtonId = storage.getString(LAST_PRESSED_BUTTON_ID_KEY);
      if (storedButtonId) {
        setLastSelectedButton(storedButtonId);
      }
    }, []),
  );

  const animatedBorderWidth = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, animatedBorderWidhValue, 0],
  });

  const animatedBorderColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      theme.color.selectedListDotColor,
      theme.color.selectedDotColor,
      theme.color.pureMaroon,
    ],
  });

  // ⭐️ BUTTONS DATA ⭐️
  const buttonPositions = [
    {
      id: ControllerButtonId.LeftPaddle,
      left: isTablet() ? '27.5%' : '25%',
      top: isTablet() ? '30%' : '29%',
      arrowLeft: isTablet() ? '25%' : '21%',
      arrowTop: isTablet() ? '20%' : '13%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
    },
    {
      id: ControllerButtonId.LeftWhite,
      left: isTablet() ? '35.1%' : '33.2%',
      top: isTablet() ? '48%' : '48.5%',
      arrowLeft: isTablet() ? '33%' : '28%',
      arrowTop: isTablet() ? '39%' : '31%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
    },
    {
      id: ControllerButtonId.LeftBlue,
      left: isTablet() ? '34.8%' : '33%',
      top: isTablet() ? '58.8%' : '60.5%',
      arrowLeft: isTablet() ? '33%' : '28%',
      arrowTop: isTablet() ? '52%' : '44%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
    },
    {
      id: ControllerButtonId.LeftYellow,
      left: isTablet() ? '34.8%' : '33.2%',
      top: isTablet() ? '69.2%' : '72.5%',
      arrowLeft: isTablet() ? '32%' : '28%',
      arrowTop: isTablet() ? '60%' : '54%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
    },
    {
      id: ControllerButtonId.LeftBlack,
      left: isTablet() ? '34.6%' : '32.9%',
      top: isTablet() ? '79.3%' : '83.7%',
      arrowLeft: isTablet() ? '32%' : '28%',
      arrowTop: isTablet() ? '72%' : '67%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
    },
    {
      id: ControllerButtonId.RightWhite,
      left: isTablet() ? '60%' : '61%',
      top: isTablet() ? '48.5%' : '49.2%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '42%' : '31%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
    },
    {
      id: ControllerButtonId.RightYellow,
      left: isTablet() ? '60%' : '61%',
      top: isTablet() ? '59.5%' : '61.5%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '51%' : '44%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.12,
    },
    {
      id: ControllerButtonId.RightRed,
      left: isTablet() ? '60.4%' : '61.5%',
      top: isTablet() ? '69.9%' : '73.2%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '61%' : '54%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
    },
    {
      id: ControllerButtonId.RightGreen,
      left: isTablet() ? '60.4%' : '61.6%',
      top: isTablet() ? '80.2%' : '84.7%',
      arrowLeft: isTablet() ? '58%' : '56%',
      arrowTop: isTablet() ? '70%' : '67%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.11,
    },
    {
      id: ControllerButtonId.RightPaddle,
      left: isTablet() ? '67.5%' : '69.3%',
      top: isTablet() ? '30.5%' : '29.5%',
      arrowLeft: isTablet() ? '66%' : '65%',
      arrowTop: isTablet() ? '20%' : '13%',
      width: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
      height: isTablet() ? screenHeight * 0.1 : screenHeight * 0.115,
    },
  ];

  // ⭐️ HANDLERS ⭐️
  const handleLangugae = () => {
    navigation.navigate(NavgationNames.home);
  };

  const handleShare = async () => {
    const options = {
      title: t('share.title'),
      message: t('share.message'),
      subject: t('share.message'),
    };
    try {
      await Share.open(options);
    } catch (error: any) {}
  };

  const getLanguage = () => {
    const LANGUAGES = {
      en: t('languageList.english'),
      de: t('languageList.german'),
      es: t('languageList.spanish'),
    };
    const lang = storage.getString('lang') || 'en';
    return LANGUAGES[lang] || LANGUAGES.en;
  };

  useEffect(() => {
    const firstLoaded = storage.getString('isFirstLoaded');
    if (firstLoaded) {
      setCurrentStep(-1);
    } else {
      setCurrentStep(0);
      setLastSelectedButton(null);
    }
  }, []);

  const handleOnPress = (button: any) => {
    if (currentStep === 0) {
      storage.set('isFirstLoaded', 'true');
      setCurrentStep(-1);
    }

    onButtonPress(button.id);
    storage.set(LAST_PRESSED_BUTTON_ID_KEY, button.id);
    setLastSelectedButton(button.id);
  };

  const handleOnLongPress = (button: any) => {
    onButtonLongPress(button.id);
  };

  const renderArrow = () => {
    if (currentStep !== 0) {
      return null;
    }

    const button = buttonPositions[0];
    return (
      <ArrowAnimated
        style={{
          position: 'absolute',
          left: button.arrowLeft,
          top: button.arrowTop,
          zIndex: 999,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.topleftView} onPress={handleShare}>
        <FastImage
          source={APP_IMAGE.shareIcon}
          style={styles.shareIconStyle}
          tintColor={theme.color.yellow}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.topRightView} onPress={handleLangugae}>
        <AppText size={isTablet() ? 'md' : 'xs'} style={styles.language}>
          {getLanguage()} ▼
        </AppText>
      </TouchableOpacity>
      <View style={styles.centerView}>
        <AppText size={'md'} style={styles.title}>
          {t('homeTwoTitle').toUpperCase()}
        </AppText>
        <AppText size={isTablet() ? 'xs' : 'xxs'} style={styles.description}>
          {t('homeTwoDes')}
        </AppText>
      </View>

      {renderArrow()}

      <View style={styles.buttonOverlay}>
        {buttonPositions.map(button => {
          const isLastSelected = button.id === lastSelectedButton;

          const animatedStyle = isLastSelected
            ? {
                borderWidth: animatedBorderWidth,
                borderColor: animatedBorderColor,
              }
            : {};

          return (
            <Animated.View
              key={button.id}
              style={[
                styles.buttonContainer,
                {
                  left: button.left,
                  top: button.top,
                  width: button.width,
                  height: button.height,
                },
                animatedStyle,
              ]}>
              <Pressable
                onPress={() => handleOnPress(button)}
                onLongPress={() => handleOnLongPress(button)}
                onPressOut={onPressOut}
                style={({pressed}) => [
                  styles.buttonPressable,
                  pressed && styles.pressedButton,
                  disabled && styles.disabledButton,
                ]}
                disabled={disabled}>
                <View style={styles.buttonInner} />
              </Pressable>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    aspectRatio: 2.5,
  },
  topRightView: {
    borderWidth: 1,
    borderColor: theme.color.borderLightGray,
    backgroundColor: theme.color.white + '60',
    padding: theme.spacing.sm,
    alignSelf: 'flex-end',
    borderRadius: 5,
    right: isTablet() ? '20%' : '12%',
    top: isTablet() ? '8%' : '5%',
  },
  topleftView: {
    padding: theme.spacing.sm,
    alignSelf: 'flex-start',
    position: 'absolute',
    left: isTablet() ? '20%' : '8%',
    top: isTablet() ? '8%' : '5%',
  },
  title: {
    color: theme.color.green,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontWeight: '400',
    color: theme.color.green,
    textAlign: 'center',
  },
  language: {
    fontWeight: 'bold',
    color: theme.color.red,
    textAlign: 'center',
  },
  centerView: {
    top: isTablet() ? '21%' : '11%',
  },
  buttonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  buttonContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  buttonPressable: {
    width: '80%',
    height: '80%',
    borderRadius: 9999,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  buttonInner: {
    width: '60%',
    height: '60%',
    borderRadius: 50,
    backgroundColor: 'transparent',
  },
  pressedButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{scale: 0.95}],
  },
  disabledButton: {
    opacity: 0.5,
  },
  shareIconStyle: {
    height: 30,
    width: 30,
    tintColor: theme.color.yellow,
  },
});

export default Controller;
