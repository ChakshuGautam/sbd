const fetch = require('node-fetch')

exports.translate = async (text) => {
    var raw = JSON.stringify({
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": "en",
                        "targetLanguage": "hi"
                    },

                }
            }
        ],
        "inputData": {
            "input": [
                {
                    "source": text
                }
            ]
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: {
            "Accept": " */*",
            "User-Agent": " Thunder Client (https://www.thunderclient.com)",
            "Authorization": process.env.BHASHINBI_KEY,
            "Content-Type": "application/json"
        },
        body: raw,
        redirect: 'follow'
    };

    const timeout = 10000;
    const controller = new AbortController();
    requestOptions.signal = controller.signal;
    const start = performance.now();
    const promise = fetch("https://dhruva-api.bhashini.gov.in/services/inference/pipeline", requestOptions)
        .then(response => response.json())
        .then(result => {
            const end = performance.now();
            const time = end - start;
            // console.log("Request took " + time + "ms");
            return result.pipelineResponse[0].output[0].target;
        })
        .catch(error => 408);

    return promise;
}