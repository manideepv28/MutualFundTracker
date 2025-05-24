import type { User, InsertUser } from "@shared/schema";

const STORAGE_KEYS = {
  USERS: 'mutualTracker_users',
  CURRENT_USER: 'mutualTracker_currentUser',
};

export interface AuthUser extends User {
  id: number;
}

export class AuthService {
  static getCurrentUser(): AuthUser | null {
    const savedUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return savedUser ? JSON.parse(savedUser) : null;
  }

  static setCurrentUser(user: AuthUser): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }

  static logout(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }

  static getAllUsers(): AuthUser[] {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: AuthUser[]): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  static register(userData: InsertUser): { success: boolean; message: string; user?: AuthUser } {
    const users = this.getAllUsers();
    
    if (users.find(user => user.email === userData.email)) {
      return { success: false, message: 'User already exists. Please sign in.' };
    }

    const newUser: AuthUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return { success: true, message: 'Registration successful!', user: newUser };
  }

  static login(email: string, password: string): { success: boolean; message: string; user?: AuthUser } {
    const users = this.getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      this.setCurrentUser(user);
      return { success: true, message: 'Login successful!', user };
    } else {
      return { success: false, message: 'Invalid credentials. Please try again.' };
    }
  }
}
