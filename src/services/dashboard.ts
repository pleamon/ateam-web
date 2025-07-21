import { request } from '@umijs/max';

export interface DashboardStats {
  overview: {
    projectCount: number;
    teamCount: number;
    memberCount: number;
    totalTasks: number;
    totalSprints: number;
    totalDocs: number;
  };
  taskStats: {
    total: number;
    todo: number;
    inProgress: number;
    testing: number;
    done: number;
    completionRate: number;
  };
  sprintStats: {
    total: number;
    active: number;
    completed: number;
  };
  docStats: {
    total: number;
    overview: number;
    technical: number;
    design: number;
  };
  recent: {
    projects: any[];
    tasks: any[];
    activeSprints: any[];
  };
  charts: {
    taskStatusDistribution: Array<{ status: string; count: number; color: string }>;
    docTypeDistribution: Array<{ type: string; count: number; color: string }>;
  };
}

// 获取仪表板统计数据
export async function getDashboardStats() {
  return request<{
    success: boolean;
    data?: DashboardStats;
    message?: string;
  }>('/api/dashboard', {
    method: 'GET',
  });
}

// 获取项目仪表板数据
export async function getProjectDashboard(projectId: string) {
  return request<{
    success: boolean;
    data?: DashboardStats;
    message?: string;
  }>(`/api/dashboard/projects/${projectId}`, {
    method: 'GET',
  });
}