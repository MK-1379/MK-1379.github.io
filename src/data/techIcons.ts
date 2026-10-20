export interface TechIcon {
  icon: string
  iconDark?: string
}

const java: TechIcon = { icon: 'java', iconDark: 'java-dark' }
const php: TechIcon = { icon: 'php' }

export const techIcons: Record<string, TechIcon> = {
  'Vue': { icon: 'vuejs' },
  'Nuxt': { icon: 'nuxtjs', iconDark: 'nuxtjs-dark' },
  'React': { icon: 'react' },
  'TypeScript': { icon: 'typescript' },
  'JavaScript': { icon: 'javascript' },
  'HTML': { icon: 'html5' },
  'CSS': { icon: 'css3' },
  'Tailwind CSS': { icon: 'tailwindcss' },
  'TanStack Query': { icon: 'tanstack-query' },
  'Node.js': { icon: 'nodejs' },
  'Express': { icon: 'express', iconDark: 'express-dark' },
  'Prisma': { icon: 'prisma', iconDark: 'prisma-dark' },
  'MySQL': { icon: 'mysql', iconDark: 'mysql-dark' },
  'MariaDB / MySQL': { icon: 'mariadb', iconDark: 'mariadb-dark' },
  'PHP': php,
  'PDO': php,
  'Java 21': java,
  'JDBC': java,
  'Maven': { icon: 'maven', iconDark: 'maven-dark' },
  'Electron': { icon: 'electron', iconDark: 'electron-dark' },
  'electron-builder': { icon: 'electron-builder', iconDark: 'electron-builder-dark' },
  'Docker': { icon: 'docker' },
  'Git': { icon: 'git' },
}
