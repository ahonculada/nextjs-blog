import Date from '../../components/date'
import Head from 'next/head'
import utilStyles from '../../styles/utils.module.css'
import Layout from '../../components/layout'
import { getAllPostIds, getPostData } from '../../lib/posts'
import { GetStaticProps, GetStaticPaths } from 'next'
import React from 'react'
import Image from 'next/image'
import { topicMap } from '../../lib/topic-map'
import 'katex/dist/katex.min.css'

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


export default function Post({ 
    postData 
}: {
    postData: {
        title: string
        date: string
        topic?: string
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
                {postData?.topic && (
                    <Image 
                        src={`/images/${topicMap[postData.topic]}.jpg`} 
                        alt={postData.title} 
                        layout="responsive" 
                        width={700} 
                        height={475} 
                    />
                )}
                <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </article>
        </Layout>
    )
}
