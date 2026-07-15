export interface Project {
  ID: number;
  Name: string;
  RepoUrl: string;
  CreatedAt: string;
  UserID?: number;
}

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type DeploymentStatus = "queued" | "running" | "success" | "failed";

export interface Deployment {
  ID: number;
  ProjectID: number;
  Status: DeploymentStatus;
  CreatedAt: string;
  Port: number | null;
  ContainerRunning: boolean;
  DeploymentType: "dockerfile" | "compose";
}

export interface DeploymentLogsResponse {
  logs: string;
}

export interface EnvironmentKeysResponse {
  keys: string[];
}
