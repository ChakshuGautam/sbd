
var tokenizer = require('./lib/tokenizer');
var optional_options = {
    preserve_whitespace: true,
};

function formatText(inputText) {
    return inputText.replace(/\n\n/g, '\n');
}

// Example usage
const inputText = `Sure! On Jan. 20, former Sen. Barack Obama became the 44.04.90 th President of the U.S. Millions attended the Inauguration.\n\n 1. Hi how are you doing?\n\n      a. Sub point`;
const formattedText = formatText(inputText);

var sentences = tokenizer.sentences(formattedText, optional_options);

console.log(sentences);
console.log(sentences.join(""))
