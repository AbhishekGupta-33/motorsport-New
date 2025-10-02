import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AppText from '../../components/AppText';
import {isTablet} from 'react-native-device-info';

interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  onDownload?: () => void; // 👈 optional download callback
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  onDownload,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      supportedOrientations={['landscape']}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>🎵 Set Ringtone on iOS</Text>
            <TouchableOpacity onPress={onClose}>
              <AppText size={isTablet() ? 'md' : 'xs'} style={styles.closeIcon}>
                ✕
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Steps */}
          <View style={styles.content}>
            <Text style={styles.step}>
              1️⃣ Tap <Text style={styles.bold}>Download Sound</Text> below.
            </Text>
            <Text style={styles.step}>
              2️⃣ The <Text style={styles.bold}>MP3 file</Text> will be saved.
            </Text>
            <Text style={styles.step}>
              3️⃣ Open <Text style={styles.bold}>Files app</Text> → locate sound.
            </Text>
            <Text style={styles.step}>
              4️⃣ Open <Text style={styles.bold}>GarageBand</Text> (free on App Store).
            </Text>
            <Text style={styles.step}>
              5️⃣ Import the sound & export as <Text style={styles.bold}>Ringtone</Text>.
            </Text>
            <Text style={styles.step}>
              6️⃣ Go to <Text style={styles.bold}>Settings → Sounds → Ringtone</Text> and set it 🎶
            </Text>
          </View>

          {/* Download Button */}
          {onDownload && (
            <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
              <Text style={styles.downloadText}>⬇️ Download Sound</Text>
            </TouchableOpacity>
          )}

          {/* Footer Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Got it ✨</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.75,
    height: height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 8,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#222',
  },
  closeIcon: {
    fontSize: 20,
    color: '#888',
  },
  content: {
    flex: 1,
    marginTop: 20,
  },
  step: {
    fontSize: 16,
    marginBottom: 12,
    color: '#444',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: '#000',
  },
  downloadButton: {
    backgroundColor: 'linear-gradient(90deg, #28a745, #20c997)', // 👈 classy gradient
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#28a745',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  downloadText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  closeButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    shadowColor: '#007AFF',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  closeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default InfoModal;
