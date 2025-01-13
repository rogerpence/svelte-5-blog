import * as utes from "./helpers"; // Assuming your `helpers.ts` file is named `helpers.ts`
import path from 'path';

// Define an interface to represent a file object with a 'name' property
interface FileItem {
    name: string;
  }
  
const markDownDirectory = path.resolve('../src/markdown');

async function main() {
  try {
      const childFolders: string[] = await utes.getChildFolders(markDownDirectory);

      if (childFolders) {
        for (const folder of childFolders) {
          const documentFolder = path.join(markDownDirectory, folder);
          console.log(documentFolder);
  
          const files = utes.getFilenames(documentFolder);
  
          if (files) {
            for (const file of files){
              if (file.isFile()){
                const documentData = await utes.parseMardkdownFile(path.join(documentFolder, file.name));
                 console.log(documentData.frontMatter);
              }
               
            }
          }
         
        }
      }
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();