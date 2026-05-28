const url = process.env.BOOKMARKLET_URL ?? 'https://cdn.callis.io/callis.js'

const snippet = `javascript:(function(){if(window.__callis)return window.__callis.toggle();var s=document.createElement('script');s.src='${url}';document.head.appendChild(s);})()`;

console.log('\n--- Callis bookmarklet ---\n')
console.log(snippet)
console.log(`\nLength: ${snippet.length} chars\n`)
