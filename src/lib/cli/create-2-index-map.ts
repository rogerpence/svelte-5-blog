import {RPBlogSchema, type RPBlogPost } from "./RPBlogPost.js";
import {content as rawContent}  from '$lib/data/markdown-map.ts';
import path from 'path';
import * as utes from "./helpers.js"; 

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
 
// interface ContentItem {
//     title: string; 
//     description: string; 
//     tags: string; 
//     content: string; 
//     fullPath: string; 
//     slug: string; 
//     folder: string; 
// }

interface FolderAccumulator {
    [key: string]: [];
}

function checkKeys(myObject: any): any {
    const ownKeys = Object.keys(myObject);  // Get an array of own property keys

    let result: { [key: string]: any } = {};

    ownKeys.forEach(key => {
        if (Object.hasOwn(myObject, key)) { // Redundant check, but still valid
            result[key] = myObject[key];
        }
    })
    return result
}

export class IndexMapCreator<T> {
    private content: MarkdownResult<T>[];
    private rootDir: string;
    private outputDirectory: string;
    private outputFile: string;

    constructor(content: MarkdownResult<T>[]) {
        this.content = content;
        this.rootDir = utes.rootDir;
        this.outputDirectory = path.join(this.rootDir, '\\src\\lib\\data');
        this.outputFile = path.join(this.outputDirectory, 'index-map.ts');
    }

    private createSortedContent(): FolderAccumulator {
        return this.content.reduce((acc: FolderAccumulator, item: MarkdownResult<T>) => {
            if (!item.data) return acc;
            
            if (!acc['index_objects']) {
                 acc['index_objects'] = [];
            }
            
            const obj: any = checkKeys(item.data?.frontMatter)
            acc['index_objects'].push(obj)

            return acc;
        }, {} as FolderAccumulator);
    }

    public generate(): void {
        const sorted = this.createSortedContent();
        console.log(sorted);
        utes.writeObjectsToFile(sorted, this.outputFile, 'content');
    }
}

// Usage:
const indexMapCreator = new IndexMapCreator<RPBlogPost>(rawContent as MarkdownResult<RPBlogPost>[]);

indexMapCreator.generate();