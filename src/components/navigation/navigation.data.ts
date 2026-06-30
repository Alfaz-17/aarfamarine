import type { Navigation } from '@/interfaces/navigation'

export const navigations: Navigation[] = [
  {
    label: 'Home',
    path: '/',
  },
  {
    label: 'About Us',
    path: '/about',
    children: [
      { label: 'Who We Are', path: '/about#who-we-are' },
      { label: 'Our Story', path: '/about#our-story' },
      { label: 'The Team', path: '/about#the-team' },
    ]
  },
  {
    label: 'Products',
    path: '/products',
    children: [
      { label: 'Navigation', path: '/products?category=Navigation' },
      { label: 'Automation', path: '/products?category=Automation' },
      { label: 'Communication', path: '/products?category=Communication' },
    ]
  },
  {
    label: 'Services',
    path: '/services',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Contact Us',
    path: '/contact',
  },
]
