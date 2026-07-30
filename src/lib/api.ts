import type {
  Deployment,
  DeploymentLogsResponse,
  EnvironmentKeysResponse,
  Project,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new ApiError(
      text || `Request to ${path} failed with status ${res.status}`,
      res.status
    );
  }

  // Some endpoints (deploy) return a single object even on 200 with
  // no body in edge cases; guard against empty responses.
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as T);
}

export const api = {
  listProjects: () =>
    request<Project[] | null>("/projects").then((projects) => projects ?? []),

  getProject: (id: number) => request<Project>(`/projects/${id}`),

  getProjectEnvironment: (projectId: number) =>
    request<EnvironmentKeysResponse>(`/projects/${projectId}/environment`),

  setProjectEnvironmentVariable: (
    projectId: number,
    name: string,
    value: string
  ) =>
    request<void>(
      `/projects/${projectId}/environment/${encodeURIComponent(name)}`,
      {
        method: "PUT",
        body: JSON.stringify({ value }),
      }
    ),

  deleteProjectEnvironmentVariable: (projectId: number, name: string) =>
    request<void>(
      `/projects/${projectId}/environment/${encodeURIComponent(name)}`,
      { method: "DELETE" }
    ),

  createProject: (name: string, repoUrl: string) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify({ name, repo_url: repoUrl }),
    }),

  deploy: (projectId: number) =>
    request<Deployment>(`/projects/${projectId}/deploy`, {
      method: "POST",
    }),

  listDeployments: () =>
    request<Deployment[] | null>("/deployments").then(
      (deployments) => deployments ?? []
    ),

  deleteProject: (projectId: number) =>
    request<void>(`/projects/${projectId}`, {
      method: "DELETE",
    }),

  restartDeployment: (deploymentId: number) =>
    request<Deployment>(`/deployments/${deploymentId}/restart`, {
      method: "POST",
    }),

  stopDeployment: (deploymentId: number) =>
    request<Deployment>(`/deployments/${deploymentId}/stop`, {
      method: "POST",
    }),

  getDeploymentLogs: (deploymentId: number) =>
    request<DeploymentLogsResponse>(`/deployments/${deploymentId}/logs`),
};

export { ApiError };
