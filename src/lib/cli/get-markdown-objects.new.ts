import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { z, ZodError, ZodErrorMap, ZodIssueCode  } from 'zod';
import { basename } from 'path';

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
export const getMarkdownObjects = <T>(frontMatter: string[], content: string[], schema: z.ZodType<T>): MarkdownResult<T> => {
  
  let parsed: any = {}; 

  try {
    parsed = yaml.load(frontMatter.join('\n'));
  }
  catch (error: any) {

    return {
      mapInfo :{
      success: false,
      errorType: "YAMLException",
      status: 'Error parsing YAML frontmatter',  
      }
    }          
  }
  
  try {        
    const fm = schema.parse(parsed);
    return {
      data: {
        frontMatter: fm,
        content: content.join('\n'),
      },
      mapInfo: {
        success: true,
        errorType: 'No error',
        status: 'success'
      }
    };

  } catch (error: any ) {

    const e = JSON.stringify(error, null, 4)

    return {
      mapInfo :{
        success: false,
        errorType: `Error = ${error.message}`,
        status: (error.issues) ? refineZodErrorMessage(error) : 'Unknown error',  
        issues: error.issues ?? ''
      }           
    };
  }
};