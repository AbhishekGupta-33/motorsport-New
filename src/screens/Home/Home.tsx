import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {APP_IMAGE} from '../../../assets/images';
import {useTranslation} from 'react-i18next';
import LanguageDropdown from '../../components/LanguageDropdown';
import StackedFastImageLayout from '../../components/StackedFastImageLayout';
import AppText from '../../components/AppText';
import {theme} from '../../constants/theme';
import { isTablet } from 'react-native-device-info';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

const Home = () => {
  const {t} = useTranslation();

  const [intialLoad, setIntialLoad] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIntialLoad(true);
    }, 1000);
  }, []);

  return (
    <>
      <StackedFastImageLayout
        backgroundImage={APP_IMAGE.HomeBG}
        middleImage={APP_IMAGE.border_2}
        topImage={APP_IMAGE.FullController}
        containerStyle={{height: '100%'}}
        middleImageStyle={{
          top: isTablet() ? SCREEN_HEIGHT * 0.17 : SCREEN_HEIGHT * 0.1,
          width: isTablet() ?  SCREEN_WIDTH * 0.4 : SCREEN_WIDTH * 0.36,
          height: isTablet() ?  SCREEN_HEIGHT * 0.32 : SCREEN_HEIGHT * 0.4,
        }}
        childrenStyle={styles.viewStyle}>
        {!intialLoad ? (
          <AppText size={'xs'} style={styles.title}>
            {t('home_button').toUpperCase()}
          </AppText>
        ) : (
          <LanguageDropdown />
        )}
      </StackedFastImageLayout>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontWeight: '400',
    textAlign: 'center',
  },
  viewStyle: {
    top: isTablet() ? '30%' : '23%',
  },
});

export default Home;
