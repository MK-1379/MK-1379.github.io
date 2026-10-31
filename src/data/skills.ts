
import type { Skill } from '@/types'

export const skills: Skill[] = [
  { name: 'HTML', level: 'con-proyectos', icon: 'html5' },
  { name: 'CSS', level: 'con-proyectos', icon: 'css3' },
  { name: 'JavaScript', level: 'con-proyectos', icon: 'javascript' },
  { name: 'TypeScript', level: 'con-proyectos', icon: 'typescript' },
  { name: 'Tailwind CSS', level: 'con-proyectos', icon: 'tailwindcss' },
  { name: 'Vue.js', level: 'con-proyectos', icon: 'vuejs' },
  { name: 'React.js', level: 'con-proyectos', icon: 'react' },
  { name: { es: 'Java (POO, JDBC)', en: 'Java (OOP, JDBC)' }, level: 'con-proyectos', icon: 'java', iconDark: 'java-dark' },
  { name: 'Node.js (Express)', level: 'con-proyectos', icon: 'nodejs' },
  { name: 'PHP (MVC, PDO)', level: 'con-proyectos', icon: 'php' },
  { name: 'MySQL / SQL Server', level: 'con-proyectos', icon: 'mysql', iconDark: 'mysql-dark' },
  { name: 'Git', level: 'con-proyectos', icon: 'git' },
  { name: 'Docker', level: 'con-proyectos', icon: 'docker' },

  { name: 'Linux', level: 'conocimientos-base', icon: 'linux', iconDark: 'linux-dark' },
  { name: 'Azure', level: 'conocimientos-base', icon: 'azure' },
  { name: 'Apache', level: 'conocimientos-base', icon: 'apache' },
  { name: 'Bootstrap', level: 'conocimientos-base', icon: 'bootstrap' },
  { name: 'Vagrant', level: 'conocimientos-base', icon: 'vagrant' },

  { name: 'Next.js', level: 'siguiente-paso', icon: 'nextjs', iconDark: 'nextjs-dark' },
  { name: 'Laravel', level: 'siguiente-paso', icon: 'laravel' },
  { name: 'Angular', level: 'siguiente-paso', icon: 'angular' },
]