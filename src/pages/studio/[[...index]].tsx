import Head from 'next/head'
import { Studio } from 'sanity'
import config from '../../../sanity.config'

export default function StudioPage() {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <Head>
        <title>Sanity Studio | Aarfa Marine</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Studio config={config} />
    </div>
  )
}
