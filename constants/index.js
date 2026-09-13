const navLinks = [
  {
    name: 'Home',
    href: '#home',
  },
  {
    name: 'About',
    href: '#about',
  },
  {
    name: 'Projects',
    href: '#projects',
  },
  {
    name: 'Contact',
    href: '#contact',
  },
];

const socialLinks =[
  {
    name:'Github',
    link:'https://github.com/Insaf-Finser',
    svg:'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'
  },
  {
    name:'LinkedIn',
    link:'https://www.linkedin.com/in/insaf-finser/',
    svg:'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667h-3.554v-11.453h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 9.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 10.019h-3.555v-11.453h3.555v11.453zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z'
  },
  {
    name:'Instagram',
    link:'https://instagram.com/__insaffinser_',
    svg:'M7.75 2C4.57 2 2 4.57 2 7.75v8.5C2 19.43 4.57 22 7.75 22h8.5C19.43 22 22 19.43 22 16.25v-8.5C22 4.57 19.43 2 16.25 2h-8.5zm0 2h8.5A3.75 3.75 0 0120 7.75v8.5A3.75 3.75 0 0116.25 20h-8.5A3.75 3.75 0 014 16.25v-8.5A3.75 3.75 0 017.75 4zm8.75 1a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z'
  },
  {
    name:'Email',
    link:'mailto:insaffinser@gmail.com',
    svg:'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z'
  },
  {
    name:'Resume',
    link:'/assets/Latest_Resume.pdf',
    svg:'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z'
  },
]


                    
                    
                    
                  

const projects = [
  {
    id: 'questora',
    title: 'Questora',
    year: '2025',
    role: 'Full-Stack Developer',
    theme: '#8b5cf6',
    description:
      'An AI-powered interactive storytelling platform where user choices dynamically shape the narrative, creating unique adventures with generated story paths and immersive experiences.',
    longDescription:
      'Questora lets readers steer a story instead of just following one. Every choice is sent to a generation pipeline that extends the narrative in real time, so no two playthroughs look the same. The hardest part was keeping generated branches coherent with everything that came before — I built a running context/state layer that summarizes prior choices before each generation call so the story stays consistent instead of drifting.',
    highlights: [
      'Designed a branching-narrative engine backed by AI generation APIs',
      'Built state tracking so generated content stays consistent across branches',
      'Shipped a cross-platform Flutter client backed by a Node.js/MongoDB API'
    ],
    tags: ['Flutter', 'Node.js', 'MongoDB', 'AI APIs'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  },
  {
    id: 'hidden-spots',
    title: 'Hidden Spots',
    year: '2025',
    role: 'Full-Stack Developer',
    theme: '#22c55e',
    description:
      'A location-based community platform for discovering meaningful hidden places through stories, ratings, maps, and user-generated experiences.',
    longDescription:
      'Hidden Spots is built around the idea that the best local recommendations come from people, not algorithms. Users drop pins for places that matter to them, attach a short story, and others discover them on a map browsed by mood or theme rather than just distance. I focused on making the map interaction itself feel alive — clustering, smooth camera moves between pins, and a lightweight rating system.',
    highlights: [
      'Built a map-first discovery UI with clustering and smooth camera transitions',
      'Designed a schema supporting stories, ratings, and media per location',
      'Implemented geo-queries for "near me" and mood-based discovery'
    ],
    tags: ['React Native', 'MongoDB', 'Maps API', 'Node.js'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  },
  {
    id: 'secure-messaging',
    title: 'Secure Messaging App',
    year: '2024',
    role: 'Mobile Developer',
    theme: '#ef4444',
    description:
      'A decentralized offline messaging application using Bluetooth mesh networking and hybrid RSA-AES encryption for secure communication without internet access.',
    longDescription:
      'Built for situations where the internet is unavailable, unreliable, or untrusted. Messages hop device-to-device over a Bluetooth mesh until they reach their recipient, with no server in the middle. Every message is encrypted with a hybrid RSA/AES scheme — RSA to exchange a session key, AES to actually encrypt the payload — so the mesh nodes relaying a message can never read it.',
    highlights: [
      'Implemented Bluetooth mesh relaying with store-and-forward routing',
      'Designed a hybrid RSA (key exchange) + AES (payload) encryption scheme',
      'Handled flaky peer-to-peer connections with retry and ack logic'
    ],
    tags: ['Flutter', 'Dart', 'RSA', 'AES'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  },
  {
    id: 'elegance',
    title: 'Elegance',
    year: '2024',
    role: 'Full-Stack Developer',
    theme: '#eee3c0',
    description:
      'A modern tailoring service platform that enables online bookings, custom measurements, order tracking, and seamless customer-tailor interactions.',
    longDescription:
      'Elegance digitizes the back-and-forth that usually happens over phone calls at a tailoring shop. Customers submit measurements and reference designs online, track order status through each stage, and message the tailor directly — while the shop gets a queue view of every active order instead of a notebook.',
    highlights: [
      'Built an order pipeline with stage tracking (measured → cutting → stitching → ready)',
      'Designed a structured measurement form replacing manual paper records',
      'Added real-time order status updates for customers'
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  },
  {
    id: 'omr-reader',
    title: 'OMR Sheet Reader',
    year: '2024',
    role: 'Computer Vision Engineer',
    theme: '#ef4444',
    visual: 'scanner',
    description:
      'An AI-powered Optical Mark Recognition system that automatically detects, analyzes, and evaluates marked answer sheets from uploaded images using computer vision techniques.',
    longDescription:
      'Takes a photo of a filled answer sheet — often slightly rotated or unevenly lit — and grades it automatically. The pipeline corrects perspective and rotation, locates each bubble grid, and classifies which bubbles are marked, then scores against an answer key. The main challenge was making detection robust to phone-camera photos rather than clean scans.',
    highlights: [
      'Built a perspective-correction + grid-detection pipeline with OpenCV',
      'Handled uneven lighting and camera skew for real-world phone photos',
      'Exposed results through a React dashboard for instant grading'
    ],
    tags: ['Python', 'OpenCV', 'Computer Vision', 'React'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  },
  {
    id: 'repo-scanner',
    title: 'GitHub Repo Scanner & README Generator',
    year: '2024',
    role: 'Developer Tools Engineer',
    theme: '#3b82f6',
    description:
      'A developer productivity tool that analyzes GitHub repositories and automatically generates professional README files with project insights and documentation.',
    longDescription:
      'Points at any public repo, walks the file tree and commit history through the GitHub API, and produces a structured README draft — tech stack, setup instructions, and a project summary — instead of a developer starting from a blank file every time.',
    highlights: [
      'Built repo analysis using the GitHub REST API to infer stack and structure',
      'Used AI generation to draft README sections from repo context',
      'Shipped an editable preview so users can tweak before exporting'
    ],
    tags: ['React', 'TypeScript', 'GitHub API', 'AI'],
    liveUrl: '',
    githubUrl: 'https://github.com/Insaf-Finser'
  }
];

const skills = ['React', 'Vue.js', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'AWS', 'GraphQL', 'REST API', 'Tailwind CSS', 'Next.js', 'Python', 'Java']

const courses = ['DSA', 'AI', 'ML', 'Web Development', 'DBMS']

export {
  projects,
  skills,
  courses,
  navLinks,
  socialLinks
}