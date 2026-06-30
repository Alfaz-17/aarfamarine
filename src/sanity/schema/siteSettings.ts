import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fieldsets: [
    {
      name: 'footerSection',
      title: 'Footer & Global Contact Information',
      options: { collapsible: true, collapsed: false }
    },
    {
      name: 'contactSection',
      title: 'Contact Us Page Specific Information',
      options: { collapsible: true, collapsed: false }
    }
  ],
  fields: [
    defineField({
      name: 'headOfficeAddress',
      title: 'Footer Address',
      type: 'text',
      fieldset: 'footerSection',
    }),
    defineField({
      name: 'branchOfficeAddress',
      title: 'Contact Us Page Address',
      type: 'text',
      fieldset: 'contactSection',
    }),
    defineField({
      name: 'tel1',
      title: 'Telephone 1',
      type: 'string',
      fieldset: 'footerSection',
    }),
    defineField({
      name: 'tel2',
      title: 'Telephone 2',
      type: 'string',
      fieldset: 'footerSection',
    }),
    defineField({
      name: 'email1',
      title: 'Email 1',
      type: 'string',
      fieldset: 'footerSection',
    }),
    defineField({
      name: 'email2',
      title: 'Email 2',
      type: 'string',
      fieldset: 'footerSection',
    }),
  ],
})
