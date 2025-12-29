
export enum AppView {
  HOME = 'home',
  ASSISTANT = 'assistant',
  ICEBREAKER = 'icebreaker',
  SANDBOX = 'sandbox',
  VIBE_CHECK = 'vibe_check',
  HISTORY = 'history',
  AUTH = 'auth',
  ABOUT = 'about',
  CONTACT = 'contact'
}

export interface User {
  email: string;
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: string;
  age: string;
}

export interface StoredItem {
  id: string;
  type: 'reply' | 'vibe' | 'sandbox';
  timestamp: number;
  data: any;
}

export interface Suggestion {
  vibe: string;
  content: string;
  explanation: string;
}

export interface VibeAnalysis {
  tone: string;
  hiddenMeaning: string;
  suggestedAction: string;
  intensity: number;
}

export interface SandboxMessage {
  role: 'user' | 'ai' | 'coach';
  text: string;
}

export interface IcebreakerParams {
  context: string;
  relationship: string;
  intensity: 'casual' | 'meaningful' | 'funny';
}
