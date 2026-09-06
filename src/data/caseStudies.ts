import { projects } from './projects'
import type { Project } from './projects'

/** A picture in a case study. Until real assets land, a figure with no `src` renders
 *  as a captioned placeholder at the right size, so the page reads correctly now. */
export interface Figure {
  caption: string
  src?: string
  /** 'half' pairs two figures on one row; anything else runs full width */
  span?: 'full' | 'half'
}

export interface CaseSection {
  /** anchor + sidebar key */
  id: string
  /** how it reads in the sidebar */
  label: string
  heading: string
  body?: string
  bullets?: string[]
  /** a single line pulled out in the accent colour — a headline number, usually */
  highlight?: string
  /** a closing paragraph, for sections that land on a thought after their list */
  outro?: string
  figures?: Figure[]
  /** put the pictures between the opening paragraph and the list, not after it */
  figuresFirst?: boolean
  action?: { label: string; href: string; download?: boolean }
}

export interface CaseStudy {
  /** the display headline, split so the middle run can be set in italic */
  headline?: [string, string, string]
  /** the saturated colour of the opening image block; the project's own `bg` is the
   *  lighter tint the figure placeholders take */
  accent?: string
  sections: CaseSection[]
}

/** Authored case studies, keyed by project id. A project without one still gets a
 *  page — `sectionsFor` falls back to the copy already on the project itself. */
export const caseStudies: Record<string, CaseStudy> = {
  'art-beyond-dimension': {
    headline: ['Turning the museum into a ', 'living', ' canvas.'],
    accent: '#3D52FF',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        heading: 'Introduction',
        body:
          'This project reimagines the museum visit as an interactive, creative journey. ' +
          'Visitors explore artworks and ask personalized questions to deepen their ' +
          'understanding. Through a generative AI system, they transform selected paintings ' +
          'using custom prompts, blending classic works with their imagination. Transformed ' +
          'creations are displayed on a projected screen, and visitors can download or print ' +
          'their artwork — turning engagement into a lasting memory.',
        figures: [{ caption: 'Storyboard — the visitor journey' }],
      },
      {
        id: 'design-focus',
        label: 'Design Focus',
        heading: 'Design Focus',
        body:
          'We began by exploring the future of museum experiences, bridging the gap between ' +
          'younger audiences and traditional institutions. Through field visits, literature ' +
          'reviews, and technology trend analysis, we identified key pain points such as ' +
          'static displays and low engagement at Museo del Novecento. User interviews and ' +
          'surveys surfaced three core values — personalization, emotional connection, and ' +
          'shared experiences — which guided our concepts.',
        figures: [{ caption: 'System architecture — AI (GAN + LLM) pipeline' }],
      },
      {
        id: 'impact',
        label: 'Impact',
        heading: 'Impact',
        body:
          'During the initial exhibition, 30 users interacted with the first MVP — exploring ' +
          'the UI, gathering information, and transforming a painting. We gathered feedback ' +
          'through a UEQ-based survey with 27 participants.',
        bullets: [
          'All users expressed some level of enjoyment in museum visits',
          'The transformation feature was the most appreciated aspect',
          'Users who valued education preferred asking their own questions',
          'Unpredictability added surprise and delight, enhancing engagement',
        ],
        highlight: 'Average user rating: 4.33 / 5',
      },
      {
        id: 'preview',
        label: 'Preview',
        heading: 'Preview',
        body:
          'The interface evolved through iterative testing from low to high fidelity in ' +
          'Figma — choosing artworks, getting information, transforming them, and projecting ' +
          'or printing the result.',
        figures: [
          { caption: 'Choose & explore artworks' },
          { caption: 'Transform artworks', span: 'half' },
          { caption: 'Project & print', span: 'half' },
        ],
      },
      {
        id: 'prototype',
        label: 'Prototype',
        heading: 'Prototype',
        body:
          'In the final Design Studio exhibition at Politecnico di Milano, each visitor’s ' +
          'approved creation joins a collective, ever-evolving digital gallery — making every ' +
          'visit a participatory part of the museum narrative.',
        figures: [{ caption: 'Final exhibition + collective gallery' }],
        action: {
          label: 'Try the digital prototype on Figma',
          href: 'https://designbymeysa.framer.website/art-beyond-dimension',
        },
      },
      {
        id: 'challenges',
        label: 'Challenges',
        heading: 'Challenges',
        body:
          'Static museum displays and lack of engagement at Museo del Novecento were ' +
          'identified as key pain points, particularly for younger audiences disconnected ' +
          'from traditional institutions.',
      },
      {
        id: 'full-case-study',
        label: 'Full Case study',
        heading: 'Full Case study',
        body:
          'Download the full project development presentation covering research, concept, ' +
          'and final design.',
        action: {
          label: 'Download project presentation',
          href: 'https://designbymeysa.framer.website/art-beyond-dimension',
        },
      },
      {
        id: 'reflection',
        label: 'Reflection',
        heading: 'Reflection',
        body:
          'Blending generative AI with a physical exhibition showed me how playful ' +
          'interaction can re-engage audiences who feel distant from traditional ' +
          'institutions. The collective gallery became the emotional heart of the experience.',
      },
    ],
  },

  'd-heart-redesign': {
    headline: ['Making the ECG feel ', 'effortless', '.'],
    accent: '#5B2EE5',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        heading: 'Introduction',
        body:
          'D-Heart is a portable ECG device that connects to smartphones, offering reliable ' +
          'and affordable heart monitoring for both professionals and non-experts. This ' +
          'project redesigns the app and device to create a more intuitive and scalable ' +
          'experience. Using task analysis, user testing, and prototyping, the team ' +
          'identified and addressed key issues — resulting in dual interfaces for patients ' +
          'and doctors, AR-guided electrode placement, integrated tutorials, and enhanced ' +
          'usability.',
        figures: [{ caption: '(Re)Design methodology' }],
      },
      {
        id: 'design-focus',
        label: 'Design Focus',
        heading: 'Design Focus',
        body:
          'We began with expert evaluations, user interviews, and testing, which surfaced ' +
          'confusing electrode placement, unintuitive app navigation, limited accessibility ' +
          'for diverse body types, and missing features for emergency ECGs. This shaped ' +
          'three design requirements:',
        bullets: [
          'Enhanced guidance through the app interface and the device’s physical features, such as intuitive light systems',
          'Adaptability to the individual needs of both primary (patients) and secondary (clinicians) users',
          'Inclusive design for various body sizes and shapes, plus a rapid ECG for emergency situations',
        ],
        figures: [{ caption: 'Information architecture — card sorting & tree testing' }],
      },
      {
        id: 'impact',
        label: 'Impact',
        heading: 'Impact',
        body:
          'We created seamless connections between the device’s physical affordances and the ' +
          'app’s digital guidance, ensuring a unified and intuitive user experience.',
        bullets: [
          'Extended electrode cables for greater accessibility and comfort',
          'Clear, color-coded indicators and an ergonomic dial',
          'Color-coded light feedback for connection, recording, and error states',
          'Dual UI — distinct interfaces for patients and health professionals',
          'AR camera overlay for real-time electrode placement guidance',
          'Integrated tutorials with skip options for experienced users',
        ],
        figures: [
          { caption: 'Dual UI', span: 'half' },
          { caption: 'AR camera overlay', span: 'half' },
        ],
      },
      {
        id: 'preview',
        label: 'Preview',
        heading: 'Preview',
        body: 'Key screens from the redesigned app and the device’s integrated tutorials.',
        figures: [{ caption: 'App + device interface' }],
      },
      {
        id: 'prototype',
        label: 'Prototype',
        heading: 'Prototype',
        body:
          'An interactive Protopie prototype walks through the full ECG experience — from ' +
          'electrode placement to reading the results.',
        action: {
          label: 'Try the app prototype on Protopie',
          href: 'https://designbymeysa.framer.website/d-heart-redesign',
        },
      },
      {
        id: 'challenges',
        label: 'Challenges',
        heading: 'Challenges',
        body:
          'The current system lacks scalability concerning various users with varying degrees ' +
          'of knowledge and experience, and has a high entry barrier regarding the complexity ' +
          'of performing an ECG.',
      },
      {
        id: 'full-case-study',
        label: 'Full Case study',
        heading: 'Full Case study',
        body:
          'Read the complete UX report covering research, information architecture, testing, ' +
          'and final design.',
        action: {
          label: 'View the full UX report',
          href: 'https://designbymeysa.framer.website/d-heart-redesign',
        },
      },
      {
        id: 'reflection',
        label: 'Reflection',
        heading: 'Reflection',
        body:
          'Designing for both first-time patients and clinicians taught me how much careful ' +
          'structure and progressive disclosure can lower the barrier to a complex medical ' +
          'task. If I revisited it, I’d push the AR guidance further with on-device testing.',
      },
    ],
  },

  'demos': {
    headline: ['Helping young voters feel ', 'confident', '.'],
    accent: '#7B5CF5',
    sections: [
      {
        id: 'introduction',
        label: 'Introduction',
        heading: 'Introduction',
        body:
          'Dèmos is an AI-powered voting advisory application designed to increase political ' +
          'engagement among young European voters. Addressing declining turnout driven by ' +
          'disconnection, lack of knowledge, and political apathy, Dèmos leverages AI — ' +
          'BERT-based sentiment analysis and Retrieval-Augmented Generation (RAG) — to ' +
          'provide personalized, accessible, and unbiased voting guidance.',
        figures: [{ caption: 'Dèmos — final UI' }],
      },
      {
        id: 'design-focus',
        label: 'Design Focus',
        heading: 'Design Focus',
        body:
          'We started by analyzing the challenges young people face and where AI could help. ' +
          'The political landscape can be overwhelming, so the challenge was to simplify ' +
          'complex processes with an intuitive UX/UI for sensitive political information. ' +
          'Through literature review, semi-structured interviews, and surveys, we learned ' +
          'about young people’s lack of political knowledge, confusion about how voting ' +
          'works, and frustration with the complexity of party platforms.',
        figuresFirst: true,
        figures: [{ caption: 'System journey — five core sections' }],
        bullets: [
          'Onboarding — secure login via SPID / CIE with consent',
          'Home — localized election events and party details',
          'AI Chat — LLM-powered personalized political dialogue',
          'Affinity Results — alignment with party platforms',
          'Profile & Threads — a personal democracy dashboard',
        ],
      },
      {
        id: 'impact',
        label: 'Impact',
        heading: 'Impact',
        body:
          'The UI was tested with 5 users, iterated, then validated with users and experts. ' +
          '11 participants aged 18–27, all of whom voted in the last European elections, ' +
          'evaluated the high-fidelity prototype using the Single Ease Question (SEQ) metric.',
        bullets: [
          'Mid-fidelity UI: 5.7 (SEQ)',
          'High-fidelity UI: 6.5 (SEQ)',
          'A more intuitive, satisfying experience in the final prototype',
        ],
        highlight: 'SEQ improved 5.7 → 6.5 across iterations',
        figures: [{ caption: 'AI system — RAG + affinity diagram' }],
      },
      {
        id: 'preview',
        label: 'Preview',
        heading: 'Preview',
        body:
          'The UI process began with information architecture, informing wireframes and then ' +
          'mid- and high-fidelity prototypes in Figma.',
        figures: [
          { caption: 'Wireframes & UI process' },
          { caption: 'High-fidelity UI', span: 'half' },
          { caption: 'Final screens', span: 'half' },
        ],
      },
      {
        id: 'prototype',
        label: 'Prototype',
        heading: 'Prototype',
        body:
          'Explore the final, high-fidelity UI prototype — from onboarding questions through ' +
          'to matched candidates and affinity results.',
        action: {
          label: 'Try the Dèmos prototype on Figma',
          href: 'https://designbymeysa.framer.website/demos',
        },
      },
      {
        id: 'challenges',
        label: 'Challenges',
        heading: 'Challenges',
        body:
          'Declining voter turnout among young Europeans caused by disconnection, ' +
          'insufficient political knowledge, and apathy toward civic participation.',
      },
      {
        id: 'full-case-study',
        label: 'Full Case study',
        heading: 'Full Case study',
        body:
          'Download the full project report covering research, the AI system, and the design ' +
          'process.',
        action: {
          label: 'Download full project report',
          href: 'https://designbymeysa.framer.website/demos',
        },
      },
      {
        id: 'reflection',
        label: 'Reflection',
        heading: 'Reflection',
        body:
          'Turning dense political information into a calm, trustworthy flow was the hardest ' +
          'and most rewarding part. The jump in ease-of-use scores confirmed that clarity — ' +
          'not more features — was what young voters needed.',
      },
    ],
  },

}

/** The sections a project's page renders: its authored case study where one exists,
 *  otherwise built from the copy the project already carries. Sections with nothing
 *  to say are left out rather than shown empty. */
export function sectionsFor(project: Project): CaseSection[] {
  const authored = caseStudies[project.id]
  if (authored) return authored.sections

  const built: CaseSection[] = [
    { id: 'introduction', label: 'Introduction', heading: 'Introduction', body: project.fullDescription },
  ]
  if (project.outcomes?.length) {
    built.push({ id: 'impact', label: 'Impact', heading: 'Impact', bullets: project.outcomes })
  }
  if (project.problem) {
    built.push({ id: 'challenges', label: 'Challenges', heading: 'Challenges', body: project.problem })
  }
  if (project.externalHref) {
    built.push({
      id: 'full-case-study',
      label: 'Full Case study',
      heading: 'Full Case study',
      body: 'The full case study — research, concept, and final design — lives on the project site.',
      action: { label: 'Read the full case study', href: project.externalHref },
    })
  }
  return built
}

export function projectById(id?: string): Project | undefined {
  return projects.find(p => p.id === id)
}

export function headlineFor(project: Project): [string, string, string] {
  return caseStudies[project.id]?.headline ?? ['', project.title, '']
}

/** the opening image block's colour; the project's own tint is the fallback */
export function accentFor(project: Project): string {
  return caseStudies[project.id]?.accent ?? project.bg
}
