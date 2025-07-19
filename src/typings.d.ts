declare module 'slash2';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

declare namespace API {
  type CurrentUser = {
    id?: string;
    name?: string;
    avatar?: string;
    email?: string;
    phone?: string;
    access?: string;
  };

  type Project = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
    documentation?: Documentation[];
    Sprint?: Sprint[];
    Requirement?: Requirement[];
    DomainKnowledge?: DomainKnowledge[];
    SystemArchitecture?: SystemArchitecture[];
  };

  type Team = {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
    members?: TeamMember[];
    TeamMember?: TeamMember[];
    tasks?: Task[];
    Documentation?: Documentation[];
  };

  type TeamMember = {
    id: string;
    teamId: string;
    name: string;
    workPrompt?: string;
    userId?: string;
    role?: string;
    joinedAt?: string;
    responsibilities?: string[];
    skills?: string[];
    createdAt: string;
    updatedAt: string;
    user?: User;
  };

  type User = {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };

  type Task = {
    id: string;
    projectId: string;
    teamId: string;
    title: string;
    content?: string;
    status: 'todo' | 'in_progress' | 'testing' | 'done';
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
    team?: Team;
    TeamMemberTask?: TeamMemberTask[];
  };

  type TeamMemberTask = {
    id: string;
    teamMemberId: string;
    taskId: string;
    teamMember?: TeamMember;
    task?: Task;
  };

  type Documentation = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
  };

  type Sprint = {
    id: string;
    projectId: string;
    name: string;
    startDate: string;
    endDate: string;
    goal?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
  };

  type Requirement = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    priority: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
  };

  type DomainKnowledge = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
  };

  type SystemArchitecture = {
    id: string;
    projectId: string;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    project?: Project;
  };

  type ApiResponse<T> = {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
  };
}