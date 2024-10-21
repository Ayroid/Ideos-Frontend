export const convertHtmlToMarkup = (html: string): string => {
    return html
      .replace(/<p>(.*?)<\/p>/g, '$1\n')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '_$1_')
      .replace(/<u>(.*?)<\/u>/g, '~~$1~~')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1\n')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n')
      .replace(/<li>(.*?)<\/li>/g, '- $1\n')
      .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1\n')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[[$1|$2]]')
      .replace(/<img src="(.*?)" alt="(.*?)" width="(\d+)" height="(\d+)">/g, '![$2]($1 ==$3x$4)')
  }
  
  export const convertMarkupToHtml = (markup: string): string => {
    return markup
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<u>$1</u>')
      .replace(/# (.*)\n/g, '<h1>$1</h1>')
      .replace(/## (.*)\n/g, '<h2>$1</h2>')
      .replace(/### (.*)\n/g, '<h3>$1</h3>')
      .replace(/- (.*)\n/g, '<li>$1</li>')
      .replace(/> (.*)\n/g, '<blockquote>$1</blockquote>')
      .replace(/\[\[(.*?)\|(.*?)\]\]/g, '<a href="$1">$2</a>')
      .replace(/!\[(.*?)\]\((.*?) ==(\d+)x(\d+)$$/g, '<img src="$2" alt="$1" width="$3" height="$4">')
  }