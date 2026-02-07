export function preprocessBoldSyntax(markdown: string): string {
  return markdown.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

export function correctUnconvertedBoldSyntax(htmlString: string): string {
  return htmlString.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
}
