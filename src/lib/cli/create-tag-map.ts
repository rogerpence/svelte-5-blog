
//import {type MarkdownResult, type MarkdownObject} from './markdown-parser.ts';
import {RPBlogSchema, type RPBlogPost } from "./RPBlogPost.js";
import {content as rawContent}  from '$lib/data/markdown-map.ts';
import path from 'path';
import * as utes from "./helpers.js"; 

const content = rawContent as MarkdownResult<RPBlogPost>[];

// export type MarkdownObject<T> = {
//     frontMatter: T;
//     content: string;
// };
  
// export type MarkdownResult<T> = {
//     success: boolean;
//     errorType?: string;
//     data?: MarkdownObject<T>;
//     status?: string;
//     issues?: string[];
//     fullPath?: string;
//     slug?: string;
//     folder?: string;
// };
 
// interface ContentItem {
//     title: string; 
//     description: string; 
//     tags: string; 
//     content: string; 
//     fullPath: string; 
//     slug: string; 
//     folder: string; 
// }

type TagCounter = {
    tag: string;
    counter: number;
}

function createTagCounters(tags: string[]): TagCounter[] {
    const tagCounts: Map<string, number> = new Map();
  
    // Count occurrences of each tag
    for (const tag of tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  
    // Convert the Map to an array of TagCounter objects
    const tagCounters: TagCounter[] = Array.from(tagCounts.entries()).map(
      ([tag, counter]) => ({ tag, counter })
    );
  
    return tagCounters;
}

let tags: string[] = []

for (const post of content) {
    const x = post?.data?.frontMatter?.tags ?? []
    tags = [...tags, ...post?.data?.frontMatter?.tags ?? []]
}

//const unique_tags: string[] = Array.from(new Set(tags)).sort();

//console.log(unique_tags)
//console.log(tags)

const tagCounters = createTagCounters(tags);

//const sortedTagCounters = utes.sortObjArray<TagCounter>(tagCounters, ["tag"]);  

const sortedTagCounters = utes.sortBy<TagCounter>(tagCounters, {key: "tag", direction: "asc"}); 

const rootDir = utes.rootDir

const outputDirectory = path.join(rootDir, '\\src\\lib\\data')
const outputFile = path.join(outputDirectory, 'tag-map.ts')


console.log(sortedTagCounters);

 utes.writeObjectsToFile(sortedTagCounters, outputFile, 'tags')