import { Platform, Alert } from 'react-native';
import * as RNFS from '@dr.pogodin/react-native-fs';

export const downloadAndShareMP3 = async (fileName: string, t:any) => {

  try {
    console.log('Starting downloadAndShareMP3 function for file:', fileName);

    const destPath = `${RNFS.TemporaryDirectoryPath}/${fileName}`;
    let sourcePath = '';

    console.log('Destination path:', destPath);

    if (Platform.OS === 'ios') {
      console.log('Platform is iOS. Starting file operation...');
      sourcePath = `${RNFS.MainBundlePath}/${fileName}`;
      console.log('Source path:', sourcePath);

      const fileAlreadyExists = await RNFS.exists(destPath);
      console.log('Checking if file already exists at destination. Exists:', fileAlreadyExists);

      if (fileAlreadyExists) {
        console.warn('File already exists. Bypassing copy operation.');
        Alert.alert(t('alertTitles.fileSaved'), t('alertMessages.fileAlreadyExists', { destPath }));
        return;
      }

      await RNFS.copyFile(sourcePath, destPath);
      console.log('File successfully copied to temporary directory.');
    } else if (Platform.OS === 'android') {
      console.log('Platform is Android. Starting file operation...');
      const assetFilePath = `audio/${fileName}`;
      console.log('Asset path:', assetFilePath);

      const exists = await RNFS.existsAssets(assetFilePath);
      console.log('Checking if asset exists. Exists:', exists);

      if (!exists) {
        console.error('Asset not found:', assetFilePath);
        Alert.alert(t('alertTitles.error'), t('alertMessages.assetNotFound'));
        return;
      }

      const assetData = await RNFS.readFileAssets(assetFilePath, 'base64');
      console.log('Asset read successfully. Starting write operation...');
      await RNFS.writeFile(destPath, assetData, 'base64');
      console.log('File successfully written to temporary directory.');
    }

    console.log('File operation completed successfully. Showing alert to user.');
    Alert.alert(t('alertTitles.fileSaved'), t('alertMessages.fileSavedInstructions', { fileName, destPath }));
  } catch (error: any) {
    console.error('An error occurred during file operation:', error);
    Alert.alert(t('alertTitles.error'), error?.message || t('alertMessages.somethingWentWrong'));
  }
};