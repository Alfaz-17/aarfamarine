import React, { FC } from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import CssBaseline from '@mui/material/CssBaseline'
import { EmotionCache } from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { createEmotionCache } from '@/utils'
import { MUIProvider } from '@/providers'
import { AuthProvider } from '@/components/contexts/auth-context'
import 'slick-carousel/slick/slick.css'
import '@/styles/globals.css'
import '@/styles/react-slick.css'
import { SEO } from '@/components/seo/SEO'
import { GlobalStructuredData } from '@/components/seo/structured-data'
import { NextPageWithLayout } from '@/interfaces/layout'
import { TopProgressBar } from '@/components/common/top-progress-bar'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

type AppPropsWithLayout = AppProps & {
  emotionCache: EmotionCache
  Component: NextPageWithLayout
}

const App: FC<AppPropsWithLayout> = (props: AppPropsWithLayout) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" type="image/png" href="/aarfa-logo.png" />
      </Head>
      <SEO />
      <GlobalStructuredData />
      <MUIProvider>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <TopProgressBar />
        <AuthProvider>
          {getLayout(<Component {...pageProps} />)}
        </AuthProvider>
      </MUIProvider>
    </CacheProvider>
  )
}

export default App
