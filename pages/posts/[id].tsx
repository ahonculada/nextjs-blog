import Date from '../../components/date'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import 'katex/dist/katex.min.css'
import { renderToString } from 'katex'
import { remark } from 'remark'
import html from 'remark-html'

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

// Utility function to convert Markdown to HTML
async function markdownToHtml(markdown: string) {
    const result = await remark().use(html).process(markdown);
    return result.toString();
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
    const [htmlContent, setHtmlContent] = React.useState('');

    React.useEffect(() => {
        // Convert Markdown to HTML
        markdownToHtml(postData.contentHtml).then((html) => {
            setHtmlContent(renderContent(html));
        });
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
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </article>
        </Layout>
    )
}
