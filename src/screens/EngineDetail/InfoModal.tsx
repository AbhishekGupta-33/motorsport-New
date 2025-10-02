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
  t: any;
}

const InfoModal: React.FC<InfoModalProps> = ({
  visible,
  onClose,
  onDownload,
  t,
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
            <Text style={styles.title}>🎵 {t('iosRingtoneTitle')}</Text>
            <TouchableOpacity onPress={onClose}>
              <AppText size={isTablet() ? 'md' : 'xs'} style={styles.closeIcon}>
                ✕
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Steps */}
          <View style={styles.content}>
            {t('iosRingtoneSteps', {returnObjects: true}).map((step, index) => (
              <Text style={styles.step} key={index}>
                {step.plain}
                <Text style={styles.bold}>{step.bold}</Text>
                {step.after}
              </Text>
            ))}
          </View>

          {/* Footer Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>{t('gotIt')} ✨</Text>
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
