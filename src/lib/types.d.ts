type MarkdownObject<T> = {
    frontMatter: T;
    content: string;
  } | null;
  
type MarkdownMapInfo = {
    success: boolean;
    errorType?: string;
    status?: string;
    issues?: string[];
    fullPath?: string;
    slug?: string;
    folder?: string;
  } | null
  
type MarkdownResult<T> = {
    data?: MarkdownObject<T>;
    mapInfo: MarkdownMapInfo;
  } | null;