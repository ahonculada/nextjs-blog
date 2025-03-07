import Date from '../../components/date'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import 'katex/dist/katex.min.css'
import { renderToString } from 'katex'

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const postData = await getPostData(params.id as string);
    return {
        props: {
            postData
        }
    }
}


export const getStaticPaths: GetStaticPaths = async () => {
    const paths = getAllPostIds();
    return {
        paths,
        fallback: false,
    };
}

const renderContent = (contentHtml: string) => {
    // Check for LaTeX delimiters
    const hasLaTeX = /\$.*?\$|\\\[.*?\\\]/.test(contentHtml);

    if (hasLaTeX) {
        // Render LaTeX using KaTeX
        return contentHtml.replace(/\$([^$]+)\$/g, (match, p1) => {
            try {
                return renderToString(p1, { throwOnError: false });
            } catch (error) {
                console.error('Error rendering LaTeX:', error);
                return match;
            }
        });
    }

    return contentHtml;
}

export default function Post({ 
    postData 
}: {
    postData: {
        title: string
        date: string
        contentHtml: string
    }
}) {
    return (
        <Layout>
            <Head>
                <title>{postData.title}</title>
            </Head>
            <article>
                <h1 className={utilStyles.headingXl}>{postData.title}</h1>
                <div className={utilStyles.lightText}>
                    <Date dateString={postData.date} />
                </div>
                <div dangerouslySetInnerHTML={{ __html: renderContent(postData.contentHtml) }} />
            </article>
        </Layout>
    )
}
