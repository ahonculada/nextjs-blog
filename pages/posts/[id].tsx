import Date from '../../components/date'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { GetStaticProps, GetStaticPaths } from 'next'
import React, { useEffect, useState } from 'react'
import 'katex/dist/katex.min.css'
import { renderToString } from 'katex'
import { marked } from 'marked'

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

const blockLaTeXPattern = /\$\$([\s\S]*?)\$\$/g;
const inlineLaTeXPattern = /\$([^$]+)\$/g;
const hasLaTeXPattern = /\$.*?\$|\\\[.*?\\\]|\$\$[\s\S]*?\$\$/m;
const markdownTablePattern = /\|(.+?)\|/g;

const renderContent = async (contentHtml: string) => {
    // Check for LaTeX delimiters
    const hasLaTeX = hasLaTeXPattern.test(contentHtml);

    if (hasLaTeX) {
        // Render LaTeX using KaTeX
        contentHtml = contentHtml
            .replace(blockLaTeXPattern, (match, p1) => {
                try {
                    return renderToString(p1, { displayMode: true, throwOnError: false });
                } catch (error) {
                    console.error('Error rendering block LaTeX:', error);
                    return match;
                }
            })
            .replace(inlineLaTeXPattern, (match, p1) => {
                try {
                    return renderToString(p1, { throwOnError: false });
                } catch (error) {
                    console.error('Error rendering inline LaTeX:', error);
                    return match;
                }
            });
    }

    // Check for Markdown tables
    if (markdownTablePattern.test(contentHtml)) {
        // Render Markdown tables using marked
        contentHtml = await marked(contentHtml);
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
    const [renderedContent, setRenderedContent] = useState<string>('');

    useEffect(() => {
        const render = async () => {
            const content = await renderContent(postData.contentHtml);
            setRenderedContent(content);
        };
        render();
    }, [postData.contentHtml]);

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
                <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            </article>
        </Layout>
    )
}
