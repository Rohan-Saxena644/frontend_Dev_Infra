export interface Project {
  ID: number;
  Name: string;
  RepoUrl: string;
  CreatedAt: string;
}

export type DeploymentStatus = "queued" | "running" | "success" | "failed";

export interface Deployment {
  ID: number;
  ProjectID: number;
  Status: DeploymentStatus;
  CreatedAt: string;
  Port: number | null;
}
