import Head from 'next/head'

export default function MetadataTags({meta}: { meta: any }) {
    return (
        <Head>
            <meta name="description" content={meta.description}/>
            <meta name="keywords" content={meta.tags.join(', ')}/>
            <meta property="og:title" content={meta.title}/>
            <meta property="og:description" content={meta.description}/>
            <meta name="twitter:title" content={meta.title}/>
            <meta name="twitter:description" content={meta.description}/>
        </Head>
    )
}