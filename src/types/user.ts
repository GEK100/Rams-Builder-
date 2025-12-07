export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
