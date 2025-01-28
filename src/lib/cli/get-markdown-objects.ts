import * as utes from "./helpers.ts"; 
import path from 'path';
import ansis from 'ansis';
import {getMarkdownObject, type MarkdownResult} from './markdown-parser.js';
import {RPBlogSchema, type RPBlogPost } from "./RPBlogPost.js";

export async function getMarkdownObjects(markDownDirectory: string ) : Promise<MarkdownResult<RPBlogPost>[]> {
  const markdownObjects : MarkdownResult<RPBlogPost>[] = [];
  const errors: string[] = []
  try {
      const childFolders: string[] = await utes.getChildFolders(markDownDirectory);

      if (childFolders) {
        for (const folder of childFolders) {
          const documentFolder = path.join(markDownDirectory, folder);
  
          const files = utes.getFilenames(documentFolder);
  
          if (files) {
            for (const file of files){
              if (file.isFile()) {

                console.log(`Processing file: ${file.name}`)  
                const {frontMatter, content} = await utes.parseMardkdownFile(path.join(documentFolder, file.name));

                const result = getMarkdownObject<RPBlogPost>(frontMatter, content, RPBlogSchema);    
                result.fullPath = path.join(markDownDirectory, folder, file.name);
                result.slug = `/${folder}/${file.name.replace('.md', '')}`;
                result.folder = folder;
                console.log(`RESULT: ${file.name}`, result)

                if (result.success) {
                   markdownObjects.push(result);
                  console.log(ansis.green(`Success with file: ${folder}/${file.name}`))
                }
                else {
                  markdownObjects.push(result);
                  console.log(ansis.red(`Error with file: ${folder}/${file.name}`))
                  console.log(ansis.red(`${result.status}`))                  
                }
              }               
            }
          }         
        }
      }
    } catch (error) {
      console.error(`An error occurred: ${error.reason}`);
      //errors.push(error.reason);
      process.exit(1);
    }
 
    // if (errors.length > 0) {
    //   for (const error of errors) {
    //     console.error(error);
    //   }        
    //   process.exit(1);
    // }
    // else {
      return markdownObjects;
//    }

  
}

// import { fileURLToPath } from 'node:url';
// import { dirname } from 'node:path';

// // At top of file, after imports
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const root = __dirname.replace("\\cli", "")

// if (process.argv[1] === __filename) {

//   const markDownDirectory = path.join(path.resolve(root), '\\src\\markdown')
//   console.log(markDownDirectory)

//   const result = await getMarkdownObjects(markDownDirectory)

//   for (const item of result) {
//     console.log(item.fullPath ?? 'No path found')
//     console.log(item.slug ?? 'No path found')
//     console.log(item.folder ?? 'No folder found')
//   }
// }  