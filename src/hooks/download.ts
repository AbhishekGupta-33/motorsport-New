import { Platform, Alert } from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';
import Share from 'react-native-share';

export const downloadAndShareMP3 = async (fileName: string, t: any, title: string) => {
  try {
    console.log('Starting downloadAndShareMP3 function for file:', fileName);

    // Save directly into DocumentDirectoryPath (visible in Files app)
    const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    let sourcePath = '';

    if (Platform.OS === 'ios') {
      console.log('Platform is iOS. Copying file to Documents folder...');
      sourcePath = `${RNFS.MainBundlePath}/${fileName}`; 
      // ⚠️ Make sure file is added to Xcode → Build Phases → Copy Bundle Resources

      const exists = await RNFS.exists(destPath);
      if (!exists) {
        await RNFS.copyFile(sourcePath, destPath);
        console.log('File successfully copied to Documents folder.');
      } else {
        console.warn('File already exists at destination.');
      }

      // Optional: Open share sheet so user can "Save to Files" or "Open in GarageBand"
      await Share.open({
        url: 'file://' + destPath,
        title: title,
        filename: title,
        type: 'audio/mpeg',
        failOnCancel: false,
      });

      Alert.alert(
        t('alertTitles.fileSaved'),
        `The file has been saved. You can find it in:\n\nFiles app → On My iPhone → ${t(
          'appName'
        )} → ${fileName}`
      );
    } else if (Platform.OS === 'android') {
      console.log('Platform is Android. Writing file...');
      const assetFilePath = `audio/${fileName}`;

      const exists = await RNFS.existsAssets(assetFilePath);
      if (!exists) {
        Alert.alert(t('alertTitles.error'), t('alertMessages.assetNotFound'));
        return;
      }

      const assetData = await RNFS.readFileAssets(assetFilePath, 'base64');
      await RNFS.writeFile(destPath, assetData, 'base64');
      console.log('File successfully written to Documents directory.');

      Alert.alert(
        t('alertTitles.fileSaved'),
        `File saved successfully. Path:\n${destPath}`
      );
    }
  } catch (error: any) {
    console.error('An error occurred during file operation:', error);
    Alert.alert(
      t('alertTitles.error'),
      error?.message || t('alertMessages.somethingWentWrong')
    );
  }
};
