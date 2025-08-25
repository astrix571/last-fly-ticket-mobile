import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{t('about.description')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
});
