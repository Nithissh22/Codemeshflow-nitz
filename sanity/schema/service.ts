import { defineField, defineType } from 'sanity';

export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Service Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    defineField({
      name: 'district',
      title: 'Universe District Name',
      type: 'string',
      description: 'E.g., Identity Nebula, Strategy Network',
    }),
    defineField({
      name: 'offerings',
      title: 'Offerings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'name', type: 'string', title: 'Name' },
            { name: 'desc', type: 'string', title: 'Description' },
          ],
        },
      ],
    }),
  ],
});
