export interface Project {
  id: string
  title: string
  subtitle?: string
  description: string
  fullDescription: string
  problem?: string
  outcomes?: string[]
  tags: string[]
  year: string
  role: string
  team?: string
  industry?: string
  discipline?: string
  timeline?: string
  bg: string
  href: string
  externalHref?: string
}

export const projects: Project[] = [
  {
    id: 'd-heart-redesign',
    title: 'D-Heart Redesign',
    subtitle: 'Portable ECG · Medical Device + App',
    description: 'D-Heart is a portable ECG device that connects to smartphones, offering reliable and affordable heart monitoring for both professionals and non-experts.',
    fullDescription: 'The redesign effort involved task analysis, user testing, and prototyping to address identified issues. The final design incorporates dual interfaces for patients and doctors, AR-guided electrode placement, integrated tutorials, and enhanced usability features.',
    problem: 'The current system lacks scalability concerning various users with varying degrees of knowledge and experience and has a high entry barrier regarding the complexity of performing an ECG.',
    outcomes: [
      'Extended electrode cables for accessibility and comfort',
      'Color-coded electrode indicators and ergonomic dial',
      'Dual UI — distinct interfaces for patients and health professionals',
      'AR camera overlay for real-time electrode placement guidance',
      'Integrated step-by-step tutorials with skip options for experienced users',
    ],
    tags: ['Healthcare', 'Redesign', 'UX Research'],
    year: '2026',
    role: 'UX Research, UI Design, Digital Prototyping',
    team: 'Joana Bento, Ariana Cisternas, Sarah Cosentino',
    industry: 'Medical',
    discipline: 'UX Research & UI Design',
    timeline: '2025 – 2026',
    bg: '#E8DDD7',
    href: '/projects/d-heart-redesign',
    externalHref: 'https://designbymeysa.framer.website/d-heart-redesign',
  },
  {
    id: 'art-beyond-dimension',
    title: 'Art Beyond Dimension',
    subtitle: 'Interactive Museum Experience',
    description: 'Reimagining the museum visit as an interactive, creative journey where visitors explore artworks and use generative AI to transform paintings based on custom prompts.',
    fullDescription: 'Visitors explore artworks, ask personalised questions, and use generative AI to transform paintings based on custom prompts. Created works display on projection screens and can be downloaded or printed. The final exhibition integrated a collective digital gallery where visitor creations become part of an evolving museum narrative.',
    problem: 'Static museum displays and lack of engagement at Museo del Novecento were identified as key pain points, particularly for younger audiences disconnected from traditional institutions.',
    outcomes: [
      'User testing with 30 participants yielded 4.33/5 average rating',
      'Transformation feature was the most appreciated aspect',
      'Collective digital gallery where visitor creations evolve the museum narrative',
    ],
    tags: ['UX Research', 'Interaction Design', 'UI Design'],
    year: '2026',
    role: 'UX Research, Interaction Design, UI Design, Prototyping, Video Editing',
    team: 'Lucia Medina, Marjan Mehrabi, Razieh Soleimani',
    industry: 'Museum / Cultural Institution',
    discipline: 'Interaction Design & Prototyping',
    timeline: '2025 – 2026',
    bg: '#DCDFE5',
    href: '/projects/art-beyond-dimension',
    externalHref: 'https://designbymeysa.framer.website/art-beyond-dimension',
  },
  {
    id: 'demos',
    title: 'Dèmos',
    subtitle: 'AI-Powered Voting Advisory App',
    description: 'An AI-powered voting advisory application designed to increase political engagement among young European voters.',
    fullDescription: 'Addresses declining voter turnout among young people in Europe caused by disconnection, insufficient political knowledge, and apathy toward civic participation. Uses BERT-based sentiment analysis, Retrieval Augmented Generation, and cosine similarity analysis to match voters with aligned candidates.',
    problem: 'Declining voter turnout among young Europeans caused by disconnection, insufficient political knowledge, and apathy toward civic participation.',
    outcomes: [
      'Single Ease Question scores improved from 5.7 (mid-fidelity) to 6.5 (high-fidelity)',
      '11 participants aged 18–27 validated the high-fidelity prototype',
      'Enhanced usability and user satisfaction in the final iteration',
    ],
    tags: ['UX Research', 'UI Design', 'Civic Tech'],
    year: '2024',
    role: 'User Research, Ideation, UI Design',
    team: 'Joana Bento, Alessandro Cesa, Simone de Marchi, Martina Ricca',
    industry: 'Politics / Civic Technology',
    discipline: 'User Research & UI Design',
    timeline: '2023 – 2024',
    bg: '#E6E2FF',
    href: '/projects/demos',
    externalHref: 'https://designbymeysa.framer.website/demos',
  },
  {
    id: 'horizon',
    title: 'Horizon',
    subtitle: 'Autonomous Urban Mobility Concept',
    description: 'A self-driving vehicle concept balancing user control with relaxation, transforming commuting into a pleasant adaptive journey.',
    fullDescription: 'Explored fundamental autonomous vehicle needs, specifically balancing Competence vs. Relaxation — enabling user control while promoting stress-free travel. The scenario follows a user booking an autonomous taxi during a transit strike, experiencing personalised lighting, calming audio, and wellness features.',
    problem: 'The brief explored the tension between Competence (sense of control over the environment) and Relaxation (feeling free from strain) in autonomous vehicle experiences.',
    outcomes: [
      'Interface screens mapping the full emotional journey',
      'Personalised lighting and calming audio for a stress-free ride',
      'Accessibility and wellness features for diverse passengers',
      'Emotional journey documentation using the Premo assessment tool',
    ],
    tags: ['UX Research', 'Interaction Design', 'Concept'],
    year: '2025',
    role: 'User Research, Ideation',
    team: 'Joana Bento, Gloria Gaggelli, Alice Kafrune, Marika Latini',
    industry: 'Autonomous Vehicles',
    bg: '#C4B5FD',
    href: '/projects/horizon',
    externalHref: 'https://designbymeysa.framer.website/horizon',
  },
]

export const bio = {
  name: 'Meysa',
  fullName: 'Fatemeh Khosh',
  tagline: 'A multidisciplinary designer who transforms research into experiences people actually enjoy using.',
  location: 'Milan, Italy',
  email: 'designbymeysa@gmail.com',
  linkedin: 'https://www.linkedin.com/in/fatemeh-khosh/',
  behance: 'https://www.behance.net/designbymeysa',
}
