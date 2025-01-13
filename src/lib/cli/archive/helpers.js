// @ts-nocheck

import fs from "fs";
import path from "path";
import ansis from "ansis";
import { promises as fsa } from 'fs';
import yaml from 'js-yaml';

export async function getChildFolders(folderPath) {
    try {
      const items = await fsa.readdir(folderPath, { withFileTypes: true });
  
      return items
        .filter(item => item.isDirectory())
        .map(item => item.name); // Or item.path for full path
    } catch (error) {
      console.error('Error reading directory:', error);
      return []; // Return an empty array in case of error
    }
  }

/*
 * Get array of tag objects from object array.
 * @param {object[]} objarr
 *
 * @returns {object[]}
 */
export const get_tag_objects = (objarr) => {
  let tags = [];

  objarr.forEach((post) => {
    tags = [...tags, ...post.tags];
  });

  const unique_tags = Array.from(new Set(tags));

  const uniqs = [];
  objarr.forEach((post) => {
    post.tags.forEach((tag) => {
      const uniqueTag = uniqs.find((uniq) => uniq.name == tag);
      if (!uniqueTag) uniqs.push({ name: tag, count: 1 });
      else uniqueTag.count++;
    });
  });

  const sorted = sortObjArray(uniqs, ["name"]);

  return sorted;
};

/**
 * Truncate a path starting at a given folder or folders.
 * @param {string} full_filename
 * @param {string[]} starting_folders
 *
 * @returns {string[]}
 */

export function truncate_path(full_filename, start_folders) {
  const tokens = full_filename.split("\\");

  let start_folder_found = false;
  const result_tokens = tokens.reduce((acc, token) => {
    if (!start_folder_found) start_folder_found = start_folders.includes(token);

    if (start_folder_found) acc.push(token);

    return acc;
  }, []);

  return result_tokens.join("\\");
}

/**
 * Get get file names in a directory.
 * @param {string} pathPrefix
 * @param {string} filesPath
 *
 * @returns {string[]}
 */
export const getFilenames = (targetDirectory) => {
  const folderExists = fs.access(targetDirectory, (error) => {
    if (error) {
      console.log(error);
    }
  });
  try {
    const filenames = fs.readdirSync(targetDirectory, {
      withFileTypes: true,
    });
    return filenames;
  } catch (error) {
    console.log(error);
  }
};

export const parseMardkdownFile = async (filename) => {
	const frontMatter = [];
	const content = [];

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
		frontMatter: fm,
		content
	};
};

/**
 * Get get contents of a text file.
 * @param {string} filepath
 * @param {string} filename
 *
 * @returns {string}
 */
export const getFileContents = (fullName) => {
  const fileContents = fs.readFileSync(fullName, {
    encoding: "utf8",
    flag: "r",
  });

  return fileContents;
};

// /**
//  * Get frontmatter from a markdown string.
//  * @param {string} markdown
//  *
//  * @returns {Object}
//  */
// export const getMarkdownFrontMatter = (markdown) => {
// 	const frontMatter = getFrontMatter(markdown);
// 	return frontMatter;
// };

/**
 * Sort an array of JS objects in ascending order by up to four properties.
 * @param {Object[]} arr
 * @param {string{}} props
 *
 * @returns {Object[]}
 */
export const sortObjArray = (arr, props) => {
  return arr.sort((a, b) => {
    for (let i = 0; i < props.length; i++) {
      let comparison;
      if (typeof a[props[i]] == "number") {
        comparison = b[props[i]] - a[props[i]];
      } else {
        comparison = a[props[i]].localeCompare(b[props[i]]);
      }

      if (comparison !== 0) {
        return comparison;
      }
    }
    return 0;
  });
};

/**
 * Get unique values from an array of strings.
 * @param {string[]} arr
 *
 * @returns {string[]}
 */
export const getUniqueSortedValues = (arr) => {
  let uniqueTags = [...new Set(arr)];
  return uniqueTags.sort();
};

/**
 * Get a slug from locale, folder name, and full file name.
 * @param {string} locale
 * @param {string} foldername
 * @param {string} filename
 *
 * const slug = getSlug('en', 'kb', 'a-markdown-doc.en.md')
 * returns '/en/kb/a-markdown-doc'
 *
 * @returns {string}
 */
export const getSlug = (locale, foldername, filename) => {
  let slug = filename.split(".")[0];
  return `/${locale}/${foldername}/${slug}`;
};

export const divMod = (quotient, divisor) => {
  return { result: Math.floor(quotient / divisor), mod: quotient % divisor };
};

export class Pager {
  rowCount;
  pageSize;
  totalPages;
  pageFirstRowNumber;
  pageLastRowNumber;
  arr;

  constructor(arr, pageSize) {
    this.arr = arr;
    this.rowCount = arr.length;
    this.pageSize = pageSize;
    this.totalPages = this.#getTotalPages(this.rowCount, this.pageSize);
  }

  getBoundingRowsForPage(pageNumber) {
    let boundingRows = this.#getBoundingRowsForPage(pageNumber, this.pageSize);
    if (boundingRows.last >= this.rowCount) {
      boundingRows.last = this.rowCount - 1;
    }
    return boundingRows;
  }

  getRowsForPage(pageNumber) {
    const boundingRows = this.getBoundingRowsForPage(pageNumber);
    const prevNextPageNumbers = this.#getPrevAndNextPage(pageNumber);
    return {
      dataRows: this.arr.slice(boundingRows.first, boundingRows.last + 1),
      prevPageNumber: Number(prevNextPageNumbers.previous),
      nextPageNumber: Number(prevNextPageNumbers.next),
    };
  }

  #getPrevAndNextPage(currentPageNumber) {
    return {
      previous:
        Number(currentPageNumber) - 1 == 0 ? -1 : Number(currentPageNumber) - 1,
      next:
        Number(currentPageNumber) + 1 > Number(this.totalPages)
          ? -1
          : Number(currentPageNumber) + 1,
    };
  }

  #getTotalPages = (rows, pageSize) => {
    const { result, mod } = divMod(rows, pageSize);
    return mod == 0 ? result : result + 1;
  };

  #getBoundingRowsForPage = (pageNumber, pageSize) => {
    const last = pageNumber * pageSize - 1;
    return {
      first: last - pageSize + 1,
      last,
    };
  };
}

export function writeObjectsToFile(objects, filename, objectName = "") {
  let exportObjectName = "";
  if (objectName != "") {
    exportObjectName = `export const ${objectName} = `;
  }
  const output = `${exportObjectName}${JSON.stringify(objects, null, 4)}`;
  fs.writeFileSync(`${filename}`, output);

  console.log(ansis.green(`File created: ${filename}`));
}

export function writeTextToFile(text, filename) {
  fs.writeFileSync(`${filename}`, text);

  console.log(ansis.green(`File created: ${filename}`));
}
