import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z, ZodError, ZodErrorMap, ZodIssueCode  } from 'zod';

// Types
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

const refineZodErrorMessage = (error: ZodError) => {  
  // Zod's "custom" error messages are still a little wonky. 
  // This provides improved messaging.
  const msg: string[] = []
  for (const issue of error.issues) {
    if (issue.code === ZodIssueCode.invalid_type && issue.message == 'Required') {
      msg.push(`The '${issue.path.join('.')}' key is required`)
      continue
    }
    else if (issue.code === ZodIssueCode.unrecognized_keys) {
      msg.push(`The '${issue.keys.join('.')}' key is unrecognized`)
      continue
    }    
    else {
      msg.push(`${issue.message} for ${issue.path.join('-')}`) 
    }       
  }

  return msg.join('; ')
}

// Parse markdown file
export const parseMarkdownFile = (filename: string): { frontMatter: string[], content: string[] } => {
  if (!filename.endsWith('.md')) {
    throw new Error('File must be a markdown file');
  }

  const frontMatter: string[] = [];
  const content: string[] = [];
  let frontMatterDelimiterCount = 0;
  const FRONT_MATTER_DELIMITER = /^---\s*$/;

  const allFileContents = fs.readFileSync(filename, 'utf-8');
  const lines = allFileContents.split(/\r?\n/);

  for (const line of lines) {
    if (line.match(FRONT_MATTER_DELIMITER)) {
      frontMatterDelimiterCount++;
      continue;
    }

    if (frontMatterDelimiterCount <= 1) {
      frontMatter.push(line);
    } else {
      content.push(line);
    }
  }

  return { frontMatter, content };
};

// Generic markdown parser
export const getMarkdownObject = <T>(frontMatter: string[], content: string[], schema: z.ZodType<T>): MarkdownResult<T> => {
  
  let parsed: any = {}; 

  try {
    parsed = yaml.load(frontMatter.join('\n'));
  }
  catch (error: any) {
    return {
      success: false,
      errorType: "YAMLException",
      status: 'Error parsing YAML frontmatter',  
    }          
  }
  
  try {        
    const fm = schema.parse(parsed);
    return {
      success: true,
      data: {
        frontMatter: fm,
        content: content.join('\n'),
      },
      errorType: 'No error',
      status: 'success'
    };

  } catch (error: any ) {

    return {
      success: false,
      errorType: "Parsing error",
      status: (error.issues) ? refineZodErrorMessage(error) : 'Unknown error',  
      issues: error.issues ?? ''
    };
  }
};

// -----------------------------------------------------------------

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

// At top of file, after imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
  console.log('from code')

  const BlogFrontMatterSchema = z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    tags: z.array(z.string()).min(1, 'At least one tag is required'),
    date_published: z.coerce.date().max(new Date(), 'Date cannot be in the future'),
    date_added: z.coerce.date(),
    date_updated: z.coerce.date(),
    pinned: z.boolean(),
  }).strict();

  type BlogPost = z.infer<typeof BlogFrontMatterSchema>;

  const markdownObject = parseMarkdownFile('demo.md');

  const result = getMarkdownObject<BlogPost>(markdownObject.frontMatter, markdownObject.content, BlogFrontMatterSchema);

  console.log(markdownObject);
  console.log(result);
}