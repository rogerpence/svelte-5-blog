
import fs from "fs";
import path from "path";
import ansis from "ansis";
import { promises as fsa } from 'fs';
import yaml from 'js-yaml';

interface DirectoryItem {
    name: string;
    isDirectory: () => boolean;
    // path?: string; // Add if you need the path
}

export const rootDir = path.dirname(__filename).replace("\\src\\lib\\cli", "");
export const libDir = path.join(rootDir, "\\src\\lib")

export async function getChildFolders(folderPath: string): Promise<string[]> {
    try {
      const items: DirectoryItem[] = await fsa.readdir(folderPath, { withFileTypes: true }) as DirectoryItem[];
      
      return items
        .filter(item => item.isDirectory())
        .map(item => item.name); // Or item.path for full path
    } catch (error) {
      console.error('Error reading directory:', error);
      return []; // Return an empty array in case of error
    }
  }


interface TagObject {
  name: string;
  count: number;
}

interface Post {
  tags: string[];
  [key: string]: any; // Allows for other properties in the post object
}


export const get_tag_objects = (objarr: Post[]): TagObject[] => {
  let tags: string[] = [];

  objarr.forEach((post) => {
    tags = [...tags, ...post.tags];
  });

  const unique_tags: string[] = Array.from(new Set(tags));

  const uniqs: TagObject[] = [];
  objarr.forEach((post) => {
    post.tags.forEach((tag) => {
      const uniqueTag = uniqs.find((uniq) => uniq.name === tag);
      if (!uniqueTag) uniqs.push({ name: tag, count: 1 });
      else uniqueTag.count++;
    });
  });

  const sorted = sortObjArray(uniqs, ["name"]);

  return sorted;
};


export function truncate_path(full_filename: string, start_folders: string[]): string {
    const tokens = full_filename.split("\\");

    let start_folder_found = false;
    const result_tokens = tokens.reduce((acc: string[], token: string) => {
      if (!start_folder_found) start_folder_found = start_folders.includes(token);

      if (start_folder_found) acc.push(token);

      return acc;
    }, []);

    return result_tokens.join("\\");
}

interface FilenameItem {
  name: string;
  isFile: () => boolean;
  isDirectory: () => boolean;
}


export const getFilenames = (targetDirectory: string): FilenameItem[] | undefined => {
    fs.access(targetDirectory, (error) => {
      if (error) {
        console.log(error);
      }
    });
    try {
      const filenames: FilenameItem[] = fs.readdirSync(targetDirectory, {
        withFileTypes: true,
      }) as FilenameItem[];
      return filenames;
    } catch (error) {
      console.log(error);
      return undefined;
    }
};


interface ParsedMarkdown {
    frontMatter: any; // Using 'any' for simplicity. Consider making a dedicated type
    content: string[];
}

export const parseMardkdownFile = async (filename: string): Promise<ParsedMarkdown> => {
	const frontMatter: string[] = [];
	const content: string[] = [];

	let frontMatterDelimiterCount = 0;

	const allFileContents = await fsa.readFile(filename, 'utf-8');

    const fileLines = allFileContents.split(/\r?\n/);

    for (const line of fileLines) {
		if (line.match(/^---\s*$/)) {
            frontMatterDelimiterCount++;
            continue;
        }            

		if (frontMatterDelimiterCount <= 1) {
			frontMatter.push(line);
		} else {
			content.push(line);
		}
	};

    const fm = yaml.load(frontMatter.join('\n'));

	return {
		frontMatter,
		content
	};
};


export const getFileContents = (fullName: string): string => {
    const fileContents = fs.readFileSync(fullName, {
      encoding: "utf8",
      flag: "r",
    });
  
    return fileContents;
};


export const sortObjArray = <T extends Record<string, any>>(arr: T[], props: string[]): T[] => {
    return arr.sort((a, b) => {
      for (let i = 0; i < props.length; i++) {
        let comparison: number;
        if (typeof a[props[i]] === "number") {
          comparison = b[props[i]] - a[props[i]];
        } else if (typeof a[props[i]] === "string" && typeof b[props[i]] === "string"){
          comparison = a[props[i]].localeCompare(b[props[i]]);
        } else {
          comparison = 0;
        }
  
        if (comparison !== 0) {
          return comparison;
        }
      }
      return 0;
    });
};

type SortDirection = 'asc' | 'desc';
type SortConfig = { key: string; direction?: SortDirection };

export const sortBy = <T extends Record<string, any>>(
    arr: T[], 
    config: SortConfig | SortConfig[]
): T[] => {
    const configs = Array.isArray(config) ? config : [config];
    
    return [...arr].sort((a, b) => {
        for (const { key, direction = 'asc' } of configs) {
            if (a[key] === b[key]) continue;
            
            const modifier = direction === 'asc' ? 1 : -1;
            
            if (a[key] === undefined) return 1 * modifier;
            if (b[key] === undefined) return -1 * modifier;
            
            if (typeof a[key] === 'string') {
                return a[key].localeCompare(b[key]) * modifier;
            }
            
            return (a[key] < b[key] ? -1 : 1) * modifier;
        }
        return 0;
    });
};

export const getUniqueSortedValues = (arr: string[]): string[] => {
  const uniqueTags = [...new Set(arr)];
  return uniqueTags.sort();
};


export const getSlug = (locale: string, foldername: string, filename: string): string => {
  let slug = filename.split(".")[0];
  return `/${locale}/${foldername}/${slug}`;
};

interface DivModResult {
  result: number;
  mod: number;
}

export const divMod = (quotient: number, divisor: number): DivModResult => {
  return { result: Math.floor(quotient / divisor), mod: quotient % divisor };
};

interface PageBoundingRows {
    first: number;
    last: number;
}
interface PrevNextPage {
  previous: number;
  next: number;
}
interface PageData<T> {
  dataRows: T[];
  prevPageNumber: number;
  nextPageNumber: number;
}

export class Pager<T> {
  rowCount: number;
  pageSize: number;
  totalPages: number;
  pageFirstRowNumber: number;
  pageLastRowNumber: number;
  arr: T[];

  constructor(arr: T[], pageSize: number) {
    this.arr = arr;
    this.rowCount = arr.length;
    this.pageSize = pageSize;
    this.totalPages = this.#getTotalPages(this.rowCount, this.pageSize);
  }

  getBoundingRowsForPage(pageNumber: number): PageBoundingRows {
    let boundingRows = this.#getBoundingRowsForPage(pageNumber, this.pageSize);
    if (boundingRows.last >= this.rowCount) {
      boundingRows.last = this.rowCount - 1;
    }
    return boundingRows;
  }

  getRowsForPage(pageNumber: number): PageData<T> {
      const boundingRows = this.getBoundingRowsForPage(pageNumber);
      const prevNextPageNumbers = this.#getPrevAndNextPage(pageNumber);
      return {
        dataRows: this.arr.slice(boundingRows.first, boundingRows.last + 1),
        prevPageNumber: Number(prevNextPageNumbers.previous),
        nextPageNumber: Number(prevNextPageNumbers.next),
      };
  }


  #getPrevAndNextPage(currentPageNumber: number): PrevNextPage {
    return {
      previous:
        Number(currentPageNumber) - 1 == 0 ? -1 : Number(currentPageNumber) - 1,
      next:
        Number(currentPageNumber) + 1 > Number(this.totalPages)
          ? -1
          : Number(currentPageNumber) + 1,
    };
  }

  #getTotalPages = (rows: number, pageSize: number): number => {
    const { result, mod } = divMod(rows, pageSize);
    return mod == 0 ? result : result + 1;
  };

  #getBoundingRowsForPage = (pageNumber: number, pageSize: number): PageBoundingRows => {
    const last = pageNumber * pageSize - 1;
    return {
      first: last - pageSize + 1,
      last,
    };
  };
}

export function writeObjectsToFile(objects: any, filename: string, objectName: string = ""): void {
    let exportObjectName = "";
    if (objectName != "") {
      exportObjectName = `export const ${objectName} = `;
    }
    const output = `${exportObjectName}${JSON.stringify(objects, null, 4)}`;
    fs.writeFileSync(`${filename}`, output);
  
    console.log(ansis.green(`File created: ${filename}`));
}
  
export function writeTextToFile(text: string, filename: string): void {
    fs.writeFileSync(`${filename}`, text);
  
    console.log(ansis.green(`File created: ${filename}`));
}

