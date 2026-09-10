// Registry for the /reading hub and its generic article renderer
// (src/reading/Article.jsx). Each entry's body lives in its own
// src/reading/<slug>.md, imported as raw text — this file only carries
// metadata, so the hub can list pieces without loading full article bodies.
export const READING = [
  {
    slug: 'republicans-supported-dc-autonomy',
    title: 'Blast From the Past: Republicans Supported Washington, D.C., Autonomy',
    dek: 'A history of Republican support for D.C. voting rights and home rule, from the 23rd Amendment through the 1978 Congressional-representation amendment vote.',
    author: 'Miriam Edelman',
    date: '2024-06-11',
    sourceName: 'WashingtonDCNow',
    sourceUrl:
      'https://www.dc-now.org/post/blast-from-the-past-republicans-supported-washington-d-c-autonomy',
  },
]

export function readingRoute(slug) {
  return `/reading/${slug}`
}
