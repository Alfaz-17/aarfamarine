const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: 'tzblc51g',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});



client.fetch(`*[] | order(_updatedAt desc) [0...10] { _id, _type, _updatedAt, title, name }`)
  .then(data => {
    console.log("HOMEPAGE DATA:");
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(console.error);

  




