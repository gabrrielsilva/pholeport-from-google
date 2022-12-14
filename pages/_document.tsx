import { Head, Html, Main, NextScript } from 'next/document';
import Script from 'next/script';

const APIKey = process.env.NEXT_PUBLIC_MAPS_JAVASCRIPT_API;

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script defer src={`https://maps.googleapis.com/maps/api/js?key=${APIKey}&v=weekly&libraries=places`} strategy='beforeInteractive' />
        <Script src={`https://greggman.github.io/webgl-helpers/webgl-force-preservedrawingbuffer.js`} strategy='beforeInteractive' />
      </body>
    </Html>
  )
}