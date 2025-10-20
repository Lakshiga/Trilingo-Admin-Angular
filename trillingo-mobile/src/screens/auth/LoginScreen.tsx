import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login, isLoading } = useAuth();
  const { getText } = useLanguage();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'பயனர்பெயர் மற்றும் கடவுச்சொல் தேவை', 
          en: 'Username and password are required', 
          si: 'පරිශීලක නාමය සහ මුරපදය අවශ්‍යයි' 
        })
      );
      return;
    }

    try {
      const success = await login(username.trim(), password);
      if (success) {
        navigation.replace('MainTabs');
      } else {
        Alert.alert(
          getText({ ta: 'உள்நுழைவு தோல்வி', en: 'Login Failed', si: 'පුරන්නට අසමත්' }),
          getText({ 
            ta: 'தவறான பயனர்பெயர் அல்லது கடவுச்சொல்', 
            en: 'Invalid username or password', 
            si: 'වැරදි පරිශීලක නාමය හෝ මුරපදය' 
          })
        );
      }
    } catch (error) {
      Alert.alert(
        getText({ ta: 'பிழை', en: 'Error', si: 'දෝෂය' }),
        getText({ 
          ta: 'உள்நுழைவு செய்ய முடியவில்லை', 
          en: 'Unable to login', 
          si: 'පුරන්නට නොහැකි' 
        })
      );
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Title style={styles.logoTitle}>
              {getText({ ta: 'ட்ரில்லிங்கோ', en: 'Trillingo', si: 'ට්‍රිලින්ගෝ' })}
            </Title>
            <Paragraph style={styles.logoSubtitle}>
              {getText({ 
                ta: 'மூன்று மொழி கற்றல் தளம்', 
                en: 'Multilingual Learning Platform', 
                si: 'බහු භාෂා ඉගෙනීමේ වේදිකාව' 
              })}
            </Paragraph>
          </View>

          <Card style={styles.loginCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>
                {getText({ ta: 'உள்நுழைய', en: 'Login', si: 'පුරන්න' })}
              </Title>

              <TextInput
                label={getText({ ta: 'பயனர்பெயர்', en: 'Username', si: 'පරිශීලක නාමය' })}
                value={username}
                onChangeText={setUsername}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />

              <TextInput
                label={getText({ ta: 'கடவுச்சொல்', en: 'Password', si: 'මුරපදය' })}
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={isLoading}
                loading={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  getText({ ta: 'உள்நுழைய', en: 'Login', si: 'පුරන්න' })
                )}
              </Button>

              <Button
                mode="text"
                onPress={handleRegister}
                style={styles.registerButton}
              >
                {getText({ 
                  ta: 'புதிய கணக்கு உருவாக்கவா?', 
                  en: 'Create new account?', 
                  si: 'නව ගිණුමක් සාදන්නද?' 
                })}
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E3F2FD', // Light blue background
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B6B', // Fun red color
    marginBottom: 8,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  logoSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loginCard: {
    elevation: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontSize: 24,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 16,
    paddingVertical: 8,
  },
  registerButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
