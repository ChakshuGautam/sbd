
var tokenizer = require('./lib/tokenizer');
var bhashini = require('./bhashini')
const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY']
});

function formatText(inputText) {
    return inputText.replace(/\n\n/g, '\n');
}

function reverseFormat(inputText) {
    return inputText.replace(/\n/g, '<newline>');
}

function addNewLineBoundaries(inputText) {
    return inputText.replace(/<न्यूलाइन>/g, '\n');
}

var optional_options = {
    preserve_whitespace: true,
};

const getResponse = async (prompt) => {
    console.log("Here 0");
    const stream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: 'user', content: prompt }],
        stream: true,
    });

    let sentences;
    let allSentences = [];
    let allTranslatedSentences = [];

    console.log("Here 1");
    let output = "";

    let counter = 0;

    for await (const chunk of stream) {
        const currentChunk = chunk.choices[0]?.delta?.content || "";
        // console.log("Here 2", output);
        output += currentChunk;
        const formattedText = formatText(output);
        sentences = tokenizer.sentences(formattedText, optional_options);
        if (sentences && allSentences.length < sentences.length) {
            //     allSentences = allSentences.concat(sentences);
            const currentSentence = sentences[sentences.length - 2];
            allSentences.push(currentSentence);
            counter++;

            // console.log(counter, allSentences[counter - 1]);
            if (counter > 1) {
                try {
                    // Add retries + fallback to Azure here => Cannot fail
                    let translatedChunk = await bhashini.translate(reverseFormat(currentSentence));
                    translatedChunk = addNewLineBoundaries(translatedChunk);
                    allTranslatedSentences.push(translatedChunk);

                    // Push this to stream
                    console.log(translatedChunk);
                } catch (e) {
                    console.log(e);
                }

            }

        } else {

        }
    }

    //push last sentence too.
    let translatedChunk = await bhashini.translate(reverseFormat(sentences[sentences.length - 1]));
    translatedChunk = addNewLineBoundaries(translatedChunk);
    allTranslatedSentences.push(translatedChunk);

    // final repsonse -- testing only for formatting
    console.log(allTranslatedSentences.join(" "));

    await stream.finalChatCompletion();

    return "Done";
}

(async () => {
    try {
        const text = await getResponse("How can I grow rice in Agra?");
        console.log(text);
    } catch (e) {
        // Deal with the fact the chain failed
        console.log(e);
    }
    // `text` is not available here
})();
