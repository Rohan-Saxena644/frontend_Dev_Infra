export interface Project {
  ID: number;
  Name: string;
  RepoUrl: string;
  CreatedAt: string;
  UserID?: number;
}

export type DeploymentStatus =
  | "queued"
  | "running"
  | "success"
  | "failed"
  | "expired";

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
