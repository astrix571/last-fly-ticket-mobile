import { Link } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import '../i18n';

export default function HomeScreen() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'he' ? 'en' : 'he';
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('home.welcome')}</Text>

      <Link href="/about" style={styles.link}>
        {t('home.about_link')}
      </Link>

      <Pressable onPress={toggleLanguage}>
        <Text style={styles.toggle}>{t('common.language_toggle')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  link: {
    fontSize: 18,
    color: 'blue',
    marginBottom: 20,
  },
  toggle: {
    fontSize: 16,
    color: '#555',
  },
});
