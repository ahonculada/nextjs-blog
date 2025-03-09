import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkToc from 'remark-toc'
import rehypeDocument from 'rehype-document'
import rehypeSlug from 'rehype-slug'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import { transformerCopyButton } from '@rehype-pretty/transformers'


const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // Get file names under /posts
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map((fileName) => {
        // Remove ".md" from file name to get id
        const id = fileName.replace(/\.md$/, '')

        // Read markdown file as a string
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // Use gray-matter to parse the post metadata section
        const matterResult = matter(fileContents)

        // Combine the data with the id
        return {
            id,
            ...(matterResult.data as { date: string; title: string }),
        }
    })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getAllPostIds() {
    const fileNames = fs.readdirSync(postsDirectory)
    // Returns an array that looks like this:
    // [
    //   {
    //     params: {
    //       id: 'ssg-ssr'
    //     }
    //   },
    //   {
    //     params: {
    //       id: 'pre-rendering'
    //     }
    //   }
    // ]
    return fileNames.map((fileName) => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id: string) {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // use remark to convert markdown into HTML string
    const processedContent = await unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkMath)
        .use(remarkToc)
        .use(remarkRehype)
        .use(rehypeSlug)
        .use(rehypeKatex)
        .use(rehypePrettyCode, {
            theme: 'everforest-dark',
            transformers: [transformerCopyButton({
                visibility: 'hover',
            })],
        })
        .use(rehypeDocument)
        .use(rehypeStringify)
        .process(matterResult.content);
    const contentHtml = processedContent.toString()

    // Combine the data with the id
    return {
        id,
        contentHtml,
        ...matterResult.data,
    }
}
