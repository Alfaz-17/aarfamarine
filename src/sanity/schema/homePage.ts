import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'text',
    }),
    defineField({
      name: 'heroStats',
      title: 'Hero Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', type: 'string', title: 'Value'},
            {name: 'label', type: 'string', title: 'Label'},
          ],
        },
      ],
    }),
    defineField({
      name: 'whatWeDoHeadline',
      title: 'What We Do Headline',
      type: 'string',
    }),
    defineField({
      name: 'whatWeDoServices',
      title: 'What We Do Services',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', type: 'string', title: 'Title'},
            {name: 'description', type: 'text', title: 'Description'},
          ],
        },
      ],
    }),
    defineField({
      name: 'keyFacts',
      title: 'Key Facts Counters',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', type: 'string', title: 'Value'},
            {name: 'label', type: 'string', title: 'Label'},
          ],
        },
      ],
    }),
  ],
})
