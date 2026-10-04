import type { Project } from '@/types'

export const projects: Project[] = [
  {
    slug: 'medicita',
    title: 'MediCita',
    context: 'Proyecto de clase',
    summary:
      'Aplicación web de gestión de citas médicas con dos roles, médico y paciente. Los médicos publican huecos de citas y los pacientes los reservan',
    highlights: [
      'Patrón MVC propio en PHP, sin framework',
      'Contraseñas con bcrypt y migración automática desde MD5 en el siguiente inicio de sesión',
      'Consultas con PDO y sentencias preparadas; sesión regenerada al iniciar sesión',
    ],
    stack: ['PHP', 'PDO', 'MariaDB / MySQL', 'HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/MK-1379/medicita',
    image: {
      src: '/img/projects/medicita.webp',
      alt: 'Panel del paciente en MediCita con el resumen de citas y el historial',
      width: 1108,
      height: 410,
    },
  },
  {
    slug: 'kumafy',
    title: 'Kumafy',
    context: 'Proyecto personal',
    summary:
      'Reproductor de música de escritorio con ventana propia y tres listas por género',
    highlights: [
      'Controles de reproducción, barra de progreso y avance automático',
      'Proceso principal y página separados, comunicados por un puente seguro (preload)',
      'Instalador para Windows publicado en Releases',
    ],
    stack: ['Electron', 'JavaScript', 'HTML', 'CSS', 'electron-builder'],
    repo: 'https://github.com/MK-1379/kumafy',
    download: 'https://github.com/MK-1379/kumafy/releases',
    image: {
      src: '/img/projects/kumafy.webp',
      alt: 'Ventana de Kumafy reproduciendo una canción de la lista de piano',
      width: 399,
      height: 716,
    },
  },
  {
    slug: 'hospital-jdbc',
    title: 'HospitalJDBC',
    context: 'Proyecto de clase',
    summary:
      'Aplicación Java que gestiona médicos y pacientes de un hospital sobre una base de datos MySQL, accedida con JDBC',
    highlights: [
      'Separación en capas: DAO y repositorios',
      'Excepción propia (DataAccessException) en lugar de propagar errores de SQL',
      'Configuración de la base de datos fuera del código, en un archivo de propiedades',
    ],
    stack: ['Java 21', 'Maven', 'JDBC', 'MySQL'],
    repo: 'https://github.com/MK-1379/hospital-jdbc',
  },
]