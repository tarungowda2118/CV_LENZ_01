
export interface Experience {
  company: string;
  role: string;
  period: string;
  impact: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  surge: boolean;
  category: string;
}

export interface TrajectoryPoint {
  date: string;
  momentum: number;
  title: string;
  subtitle: string;
  description: string;
  milestone?: string;
}

export interface Connection {
  name: string;
  role: string;
  type: 'colleague' | 'mentor' | 'client' | 'referral';
  strength: number;
  roleHistory: string[];
  sharedConnections: string[];
}

export interface UserProfile {
  personal: {
    name: string;
    title: string;
    location: string;
    summary: string;
  };
  experience: Experience[];
  skills: Skill[];
  trajectory: TrajectoryPoint[];
  connections: Connection[];
  analysis: {
    salaryEstimate: string;
    wellBeingMetric: number;
    educationDeepDive: string;
    marketFit: string;
  };
}

export type ViewState = 'landing' | 'uploading' | 'dashboard' | 'portfolio';
