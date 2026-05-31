export interface Voice {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'non-binary';
  language: string;
  category: 'narration' | 'commercial' | 'video-games' | 'audiobooks' | 'characters' | 'professional';
  accent: string;
  style: string;
  age: 'child' | 'youth' | 'adult' | 'senior';
  isPremium?: boolean;
  avatarUrl?: string;
  accentColor?: string;
  rating: number;
  downloads: number;
  useCount: number;
  description: string;
  sampleText: string;
}

export interface Generation {
  id: string;
  text: string;
  voiceId: string;
  voiceName: string;
  timestamp: string;
  audioUrl?: string; // Speaking blob
  settings: {
    speed: number;
    pitch: number;
    volume: number;
    effects?: string;
  };
  characterCount: number;
  tags?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  date: string;
  readTime: string;
  image: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  views: number;
}

export interface SystemLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'synth' | 'auth' | 'admin' | 'download';
}

export interface UserStats {
  generationsCount: number;
  charactersCount: number;
  savedVoices: string[]; // Voice IDs
  likedBlogs: string[]; // Blog IDs
  tier: 'Free' | 'Pro' | 'Enterprise';
  apiCallsUsed: number;
  apiCallsLimit: number;
}
