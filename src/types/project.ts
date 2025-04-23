
// Define types for Project-related data structures

export interface ProjectTask {
  id: number;
  title: string;
  completed: boolean;
}

export interface Project {
  id: number;
  name: string;
  clientId: string; // String type for consistency
  client: string;
  deadline: string;
  team: number;
  status: string;
  tasks: ProjectTask[];
  progress: number;
}

// Status mapping utilities
export const statusMapping: {[key: string]: string} = {
  "Готов": "Ready",
  "В процессе": "In Progress",
  "Заморожен": "Frozen",
  "Отменен": "Canceled"
};

export const reverseStatusMapping: {[key: string]: string} = {
  "Ready": "Готов",
  "In Progress": "В процессе",
  "Frozen": "Заморожен",
  "Canceled": "Отменен",
  "Completed": "Готов" // For backward compatibility
};

// List of all available statuses in Russian
export const projectStatuses = ["Готов", "В процессе", "Заморожен", "Отменен"];

// Status including "All" for filtering
export const projectStatusesWithAll = ["Все", ...projectStatuses];

// Get display text for a status
export const getStatusDisplayText = (status: string): string => {
  return reverseStatusMapping[status] || status;
};
