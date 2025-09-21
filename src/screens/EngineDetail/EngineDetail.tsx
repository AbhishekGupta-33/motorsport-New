import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  Platform,
  StyleSheet,
  ListRenderItem,
  ViewToken,
} from 'react-native';
import FastImage from '@d11/react-native-fast-image';
import {APP_IMAGE} from '../../../assets/images';
import {useRoute} from '@react-navigation/native';
import {theme} from '../../constants/theme';
import {downloadAndShareMP3} from '../../hooks/download';
import {useTranslation} from 'react-i18next';
import {useRingtoneSetter} from '../../hooks/useSetRingtone';
import {isTablet} from 'react-native-device-info';
import AppText from '../../components/AppText';
import SoundListModel from '../../components/SoundListModel';
import {useGyroSound} from '../../hooks/useGyroSound';
import Share from 'react-native-share';
import {SafeAreaView} from 'react-native-safe-area-context';

const {height, width} = Dimensions.get('window');

// TypeScript interfaces
interface MotorsportItem {
  id: string;
  title: string;
  model: string;
  engine: string;
  enginDetail: string;
  topSpeed: string;
  yearRange: string;
  power: string;
  chassis: string;
  image: string;
  sound: string;
}

interface ViewableItemsChanged {
  viewableItems: ViewToken[];
  changed: ViewToken[];
}

const renderCarouselItem: ListRenderItem<MotorsportItem> = ({item}) => (
  // <View style={styles.carouselItem}>
  <FastImage
    source={item}
    style={styles.carImage}
    resizeMode={FastImage.resizeMode.contain}
  />
  // </View>
);

const EngineDetail: React.FC<any> = props => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSoundListModel, setIsSoundListModel] = useState(false);
  const [isPaymentModel, setIsPaymentModel] = useState(false);
  const [isDefaultPlay, setIsDefaultPlay] = useState(false);
  const [selectedSound, setSelectedSound] = useState('');
  const flatListRef = useRef<FlatList<any>>(null);
  const {t} = useTranslation();
  const {setRingtone} = useRingtoneSetter();
  const motorsportData = useRoute()?.params?.selectedCar;
  const {playSoundInFullVolume, stop} = useGyroSound(selectedSound);

  const onViewableItemsChanged = ({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  };

  const viewabilityConfig = {itemVisiblePercentThreshold: 50};

  const renderDot = (index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.dot,
        {
          backgroundColor:
            index === currentIndex
              ? theme.color.red
              : index < currentIndex
              ? theme.color.blue
              : theme.color.borderLightGray,
        },
      ]}
      onPress={() =>
        flatListRef.current?.scrollToIndex({index, animated: true})
      }
    />
  );

  const onClosePress = () => props.navigation.goBack();

  const onPlay = async () => {
    // if (motorsportData?.sound?.length > 1) {
    //   setIsSoundListModel(true);
    //   return;
    // }
    if (Platform.OS === 'ios') {
      await downloadAndShareMP3(motorsportData?.sound[0], t);
    } else {
      setRingtone(motorsportData?.sound[0]);
    }
  };

  const onPlayFromSoundList = async (item: string, isDefault: boolean) => {
    stop();
    setIsDefaultPlay(isDefault);
    setSelectedSound('');
    setTimeout(() => {
      setSelectedSound(item);
    }, 100);
  };

  const onPlayfullSound = async () => {
    const isPlayedThreeSecond = await playSoundInFullVolume(isDefaultPlay);
    if (isPlayedThreeSecond) {
      setIsPaymentModel(true);
    }
  };

  const onPurchase = () => {
    // Add purchase logic here
  };
  const handleShare = async () => {
    const options = {
      title: t('share.title'),
      message: t('share.message'),
      subject: t('share.message'),
      // url: 'https://www.bmw-m.com/en/index.html',
    };

    try {
      await Share.open(options);
    } catch (error: any) {
      // Alert.alert(error?.message);
    }
  };

  useEffect(() => {
    if (selectedSound) onPlayfullSound();
  }, [selectedSound]);

  return (
    <View style={styles.container}>
      <FastImage
        source={APP_IMAGE.CarbonBorder}
        style={styles.backgroundImage}
        resizeMode={FastImage.resizeMode.stretch}
        // tintColor={theme.color.white}
      />
      <SafeAreaView style={{flex: 1,}}>
        <View style={styles.topContainer}>
          <View style={styles.topView}>
            <TouchableOpacity style={styles.topleftView} onPress={handleShare}>
              <FastImage
                source={APP_IMAGE.shareIcon}
                style={styles.shareIconStyle}
                tintColor={theme.color.yellow}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClosePress}>
              <AppText  size={isTablet() ? 'md' : 'xs'} style={styles.closeText}>
                {t('close')} ✕
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.viewCOntainerStyle}>
            {/* Left Panel - Engine Details */}
            <View style={styles.leftPanel}>
              <View style={styles.listItemView}>
                <AppText size={'lg'} style={styles.listTitle}>
                  {t('enginRace')}
                </AppText>
                <AppText size={'md'} style={styles.listDesText}>
                  {motorsportData.engine}
                </AppText>
                <AppText size={'xs'} style={styles.listSubDesText}>
                  {motorsportData.enginDetail}
                </AppText>
              </View>
              <View style={styles.speedContainer}>
                <AppText size={'lg'} style={styles.listTitle}>
                  {t('topSpeedTitle')}
                </AppText>
                <AppText
                  size={isTablet() ? 'sm' : 'xs'}
                  style={styles.listDesText}>
                  {motorsportData.topSpeed}
                </AppText>
              </View>
              <View style={styles.listItemView}>
                <AppText size={'lg'} style={styles.listTitle}>
                  {t('yearRangeTitle')}
                </AppText>
                <AppText
                  size={isTablet() ? 'sm' : 'xs'}
                  style={styles.listDesText}>
                  {motorsportData.yearRange}
                </AppText>
              </View>
            </View>

            {/* Center Panel - Title and Carousel */}
            <View style={styles.centerPanel}>
              <View style={styles.titleContainer}>
                <AppText size={'title'} style={styles.mainTitle}>
                  {motorsportData.title}
                </AppText>
                <AppText size={'title'} style={styles.modelText}>
                  {motorsportData.model}
                </AppText>
              </View>

              {/* Car Carousel */}
              {/* <View style={styles.carouselContainer}> */}
              <FlatList
                ref={flatListRef}
                data={motorsportData.images}
                renderItem={renderCarouselItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item}`}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                style={styles.carousel}
              />
              {/* </View> */}

              {/* Dots Indicator */}
              <View style={styles.dotsContainer}>
                {motorsportData?.images?.map((_, index) => renderDot(index))}
              </View>
            </View>

            {/* Right Panel - Chassis and Powe */}
            <View style={styles.rightPanel}>
              <View style={styles.listItemView}>
                <AppText size={'lg'} style={styles.listTitle}>
                  {t('chassisTitle')}
                </AppText>
                <AppText
                  size={isTablet() ? 'sm' : 'xs'}
                  style={styles.listDesText}>
                  {motorsportData.chassis}
                </AppText>
              </View>

              <View style={styles.bhpContainer}>
                <AppText size={'lg'} style={styles.listTitle}>
                  {t('power')}
                </AppText>
                <AppText
                  size={isTablet() ? 'sm' : 'xs'}
                  style={styles.listDesText}>
                  {motorsportData.power}
                </AppText>
              </View>

              {/* Play Button */}
              <View
                style={[
                  styles.listItemView,
                  {
                    padding: theme.spacing.sm,
                    justifyContent: isTablet() ? 'center' : 'space-between',
                  },
                ]}>
                <AppText size={'xs'} style={styles.experienceText}>
                  {Platform.OS === 'android'
                    ? t('AndroidRingTone')
                    : t('IosSaveFile')}
                </AppText>
                <Pressable style={styles.playButtonStyle} onPress={onPlay}>
                  <AppText style={styles.startEngintext}>
                    {t('startEngine')}
                  </AppText>
                </Pressable>
              </View>
            </View>
          </View>

          {/* SoundList Modal */}
          <SoundListModel
            visible={isSoundListModel}
            isPaymentModel={isPaymentModel}
            data={motorsportData?.sound}
            onClose={() => setIsSoundListModel(false)}
            onPaymentClose={() => setIsPaymentModel(false)}
            onPlay={onPlayFromSoundList}
            onPurchase={onPurchase}
          />
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    justifyContent: isTablet() ? 'space-evenly' : 'flex-start',
    // flex: 1,
    height: isTablet() ? '95%'  : '100%',
    alignSelf: 'center',
    top: '2%',
    width: isTablet() ? '90%'  : '100%'
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
    padding: 10,
    paddingRight: '5%',
  },
  topleftView: {
    backgroundColor: theme.color.white + '50',
    padding: theme.spacing.sm,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  shareIconStyle: {
    height: isTablet() ? 30 : 25,
    width:  isTablet() ? 30 : 25,
    tintColor: theme.color.yellow,
  },
  viewCOntainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: '1%',
    width: '98%',
    height: isTablet() ? '85%' : '80%',
  },
  backgroundImage: {
    position: 'absolute',
    width: isTablet() ? '105%' : '105%' ,
    height: isTablet() ? '110%' : '115%',
    top: '-8%',
    alignSelf: 'center',
    backgroundColor: theme.color.white
  },
  closeButton: {},
  closeText: {
    color: theme.color.red,
    fontWeight: 'bold',
  },
  leftPanel: {
    width: isTablet() ? '30%' :   Platform.OS === 'ios' ?  '30%' : '26%',
    height: isTablet() ? '100%' :   Platform.OS === 'ios' ?  '98%' : '97%',
    borderWidth: 1,
    borderColor: theme.color.black,
    justifyContent: 'space-evenly',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -theme.spacing.md,
  },
  listItemView: {
    justifyContent: 'center',
    alignContent: 'center',
    flex: 1,
    padding: theme.spacing.md,
  },
  listTitle: {
    color: theme.color.black,
    letterSpacing: 1.1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listDesText: {
    color: theme.color.blue,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listSubDesText: {
    color: theme.color.blue,
    fontWeight: '500',
    textAlign: 'center',
  },
  bhpContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    padding: isTablet() ?  theme.spacing.md :  theme.spacing.sm,
    borderColor: theme.color.black,
  },
  speedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.color.black,
  },
  centerPanel: {
    width: '40%',
    height: isTablet() ? '100%' :   Platform.OS === 'ios' ?  '98%' : '97%',
    alignItems: 'center',
  },
  mainTitle: {
    color: theme.color.black,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  modelText: {
    color: theme.color.black,
    fontWeight: '600',
  },
  carousel: {
    width: isTablet() ? width * 0.34 : width * 0.32,
    height: isTablet() ? height * 0.6 : Platform.OS === 'ios' ? height * 0.53 : height * 0.50,
    // backgroundColor:'red'
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: isTablet() ? width * 0.34 : width * 0.32,
    height: isTablet() ? height * 0.6 :Platform.OS === 'ios' ? height * 0.53 : height * 0.50,
    // backgroundColor:'pink'
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  rightPanel: {
    width: isTablet() ? '30%' :   Platform.OS === 'ios' ?  '30%' : '26%',
    height: isTablet() ? '100%' :   Platform.OS === 'ios' ?  '98%' : '97%',
    borderWidth: 1,
    borderColor: theme.color.black,
    justifyContent: 'space-evenly',
  },
  playButton: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  experienceText: {
    color: theme.color.black,
    // paddingBottom: theme.spacing.md,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: isTablet() ? '5%' : 0
  },
  playButtonStyle: {
    width: isTablet() ? 100 : 50,
    height: isTablet() ? 100 : 50,
    borderRadius: isTablet() ? 100 : 50,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: theme.color.red,
    borderWidth: isTablet() ? 4 : 2,
    borderColor: theme.color.black,
  },
  startEngintext: {
    color: theme.color.white,
    textAlign: 'center',
    fontSize: isTablet() ? 16 : 8,
  },
});

export default EngineDetail;
