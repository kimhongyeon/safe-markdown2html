export function replaceDelTagsWithTilde(htmlString: string): string {
  return htmlString.replace(/<del>/gi, '~').replace(/<\/del>/gi, '~');
}
