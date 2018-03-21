export default class GoogleVisionApi {
    apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=';
    apiKey = ''

    async checkForLabels(base64) {
        return await fetch(`${this.apiUrl}${this.apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": base64
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            })
        }).then((response) => {
            return response.json();
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
        });

    }
}