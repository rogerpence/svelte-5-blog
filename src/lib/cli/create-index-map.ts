
//import {type MarkdownResult, type MarkdownObject} from './markdown-parser.ts';
import {RPBlogSchema, type RPBlogPost } from "./RPBlogPost.js";
import {content as rawContent}  from '$lib/data/markdown-map.ts';
import path from 'path';
import * as utes from "./helpers.js"; 

const content = rawContent as MarkdownResult<RPBlogPost>[];

export type MarkdownObject<T> = {
    frontMatter: T;
    content: string;
  };
  
export type MarkdownResult<T> = {
success: boolean;
errorType?: string;
data?: MarkdownObject<T>;
status?: string;
issues?: string[];
fullPath?: string;
slug?: string;
folder?: string;
};
 
interface ContentItem {
    title: string; 
    description: string; 
    tags: string; 
    content: string; 
    fullPath: string; 
    slug: string; 
    folder: string; 
 }

interface FolderAccumulator {
    [key: string]: ContentItem[];
}

const sorted = content.reduce((acc: FolderAccumulator, item: MarkdownResult<RPBlogPost>) => {
    if (!item.data) return acc; 

    if (!acc['index_objects']) {
        acc['index_objects'] = []; 
    }        

    acc['index_objects'].push(
        {
            title: item.data.frontMatter.title,
            description: item.data.frontMatter.description,
            tags: item.data.frontMatter.tags.join(', '),
            content: item.data.content,
            fullPath: item.fullPath as string,
            slug: item.slug as string,            
            folder: item.folder as string
        } 
    );


    return acc;  // Add missing return statement
}, {} as FolderAccumulator);

const rootDir = utes.rootDir

const outputDirectory = path.join(rootDir, '\\src\\lib\\data')
const outputFile = path.join(outputDirectory, 'index-map.ts')

console.log(sorted)

utes.writeObjectsToFile(sorted, outputFile, 'content')