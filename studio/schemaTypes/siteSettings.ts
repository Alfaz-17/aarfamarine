import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'headOfficeAddress',
      title: 'Head Office Address (Navapara)',
      type: 'text',
    }),
    defineField({
      name: 'branchOfficeAddress',
      title: 'Branch Office Address (Alang)',
      type: 'text',
    }),
    defineField({
      name: 'tel1',
      title: 'Telephone 1',
      type: 'string',
    }),
    defineField({
      name: 'tel2',
      title: 'Telephone 2',
      type: 'string',
    }),
    defineField({
      name: 'email1',
      title: 'Email 1',
      type: 'string',
    }),
    defineField({
      name: 'email2',
      title: 'Email 2',
      type: 'string',
    }),
  ],
})
