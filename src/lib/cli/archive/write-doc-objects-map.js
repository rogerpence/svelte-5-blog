import * as utes from "../helpers.js";
import path from 'path';

const markDownDirectory = path.resolve('../src/markdown')
const childFolders = await utes.getChildFolders(markDownDirectory);

childFolders.map((folder) => {
    const documentFolder = path.join(markDownDirectory, folder);
    console.log(documentFolder);

    const files = utes.getFilenames(documentFolder);

    files.map(async (file) => {
       // //console.log(documentData.content);
    })  

})
