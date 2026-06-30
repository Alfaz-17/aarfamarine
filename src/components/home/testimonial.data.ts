import type { Testimonial } from '@/interfaces/testimonial'

export const data: Array<Testimonial> = [
  {
    id: 1,
    title: 'Top Tier Navigation Equipment',
    content:
      'Aarfa Marine provided us with the latest Furuno radar systems. The installation was seamless and the equipment performs flawlessly in rough weather conditions.',
    user: {
      id: 1,
      name: 'Captain John S.',
      professional: 'Commercial Fleet Captain',
      photo: '1.jpg',
    },
  },
  {
    id: 2,
    title: 'Reliable Communication Systems',
    content:
      'We recently upgraded our entire radio suite with Aarfa Marine. Their expertise in GMDSS equipment and swift delivery time saved us from critical downtime.',
    user: {
      id: 2,
      name: 'Sarah M.',
      professional: 'Marine Fleet Manager',
      photo: '2.jpg',
    },
  },
  {
    id: 3,
    title: 'Excellent Spares Sourcing',
    content:
      'Finding reconditioned parts for older navigation panels can be a nightmare, but Aarfa Marine always manages to source exactly what we need from Alang within 48 hours.',
    user: {
      id: 3,
      name: 'David R.',
      professional: 'Chief Engineer',
      photo: '3.jpg',
    },
  },
  {
    id: 4,
    title: 'Outstanding Automation Service',
    content:
      'Their technical team helped us troubleshoot and replace our aging engine alarm systems. The new automation panels are incredibly intuitive and robust.',
    user: {
      id: 4,
      name: 'Michael T.',
      professional: 'Vessel Operator',
      photo: '4.jpg',
    },
  },
]
