import * as utes from "./helpers.ts";
import { type FilenameItem } from "./helpers.ts";
import path from 'path';
import { Dirent } from 'fs';
import ansis from 'ansis';
import { getMarkdownObject, type MarkdownResult } from './markdown-parser.js';
import { RPBlogSchema, type RPBlogPost } from "./RPBlogPost.js";

async function processMarkdownFile(file: FilenameItem,
                                   folder: string,
                                   documentFolder: string,
                                   markDownDirectory: string): Promise<MarkdownResult<RPBlogPost>> {
    
    const { frontMatter, content } = await utes.parseMardkdownFile(path.join(documentFolder, file.name));

    const result: MarkdownResult<RPBlogPost> = await getMarkdownObject<RPBlogPost>(frontMatter, content, RPBlogSchema);
    if (!result || !result.mapInfo) {
        throw new Error(`No result or mapInfo found`);
    }

    result.mapInfo.fullPath = path.join(markDownDirectory, folder, file.name);
    result.mapInfo.slug = `/${folder}/${file.name.replace('.md', '')}`;
    result.mapInfo.folder = folder;

    return result;
}

export async function getMarkdownObjects(markDownDirectory: string): Promise<MarkdownResult<RPBlogPost>[]> {
    const markdownObjects: MarkdownResult<RPBlogPost>[] = [];
    const errors: string[] = []

    const childFolders: string[] = await utes.getChildFolders(markDownDirectory);

    if (childFolders) {
        for (const folder of childFolders) {
            const documentFolder = path.join(markDownDirectory, folder);

            const files = utes.getFilenames(documentFolder);
            let file : FilenameItem = null

            if (files) {
                for (file of files) {
                    if (file.isFile()) {                        
                        try {
                            console.log(`Processing file: ${file}`)
                            const result = await processMarkdownFile(file, folder, documentFolder, markDownDirectory);
                            if (!result || !result.mapInfo) {
                                throw new Error('No result or mapInfo found');
                            }
                            else {
                                markdownObjects.push(result);
                                if (result.mapInfo.success) {
                                    console.log(ansis.green(`Success with file: ${folder}/${file.name}`))
                                }    
                            }
                        }
                        catch (error: any) {
                            console.error(`An error occurred: ${error.reason}`);
                            errors.push(`${file.name}: ${error.reason}`);
                        }
                    }
                }
            }
        }
    }

    if (errors.length > 0) {
        for (const error of errors) {
            console.error(error);
        }
        process.exit(1);
    }

    return markdownObjects;
}

