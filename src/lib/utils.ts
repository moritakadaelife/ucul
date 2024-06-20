import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// import fs from 'fs';
// import path from 'path';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export const getProjects = (): { [key: string]: {} } => {
//   const projectConfigPath = path.resolve(process.cwd(), 'project.config.json');
//   const fileContent = fs.readFileSync(projectConfigPath, 'utf-8');
//   const config = JSON.parse(fileContent);
//   return config.project;
// };
