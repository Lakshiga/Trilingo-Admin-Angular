import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LanguageCode } from '../types/navigation';

const API_BASE_URL = 'http://localhost:5069/api'; // Update with your backend URL

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nativeLanguage: LanguageCode;
  targetLanguage: LanguageCode;
}

interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private static instance: AuthService;
  private token: string | null = null;

  private constructor() {
    this.loadToken();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private async loadToken(): Promise<void> {
    try {
      this.token = await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error loading token:', error);
    }
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password,
      });

      if (response.data.result) {
        this.token = response.data.result.token;
        await AsyncStorage.setItem('authToken', this.token);
        return response.data.result;
      }
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);

      if (response.data.result) {
        this.token = response.data.result.token;
        await AsyncStorage.setItem('authToken', this.token);
        return response.data.result;
      }
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      this.token = null;
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  async updateLanguagePreference(language: LanguageCode): Promise<void> {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/language-preference`,
        { currentLearningLanguage: language },
        { headers: this.getHeaders() }
      );

      if (!response.data.result) {
        throw new Error('Failed to update language preference');
      }
    } catch (error) {
      console.error('Error updating language preference:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: this.getHeaders(),
      });

      return response.data.result;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const AuthService = AuthService.getInstance();
