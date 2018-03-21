const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=';
const apiKey = 'AIzaSyAcnAeGb54WLdoKaMhms-I0RJSJrisNYrI';
const cloudApi = 'https://us-central1-selfify-198709.cloudfunctions.net/getLabels?key=';

export const checkForLabels = (base64) => {
    return fetch(`${apiUrl}${apiKey}`, {
        method: 'POST',
        body: JSON.stringify({
            "requests": [
                {
                    "image": {
                        "content": base64
                    },
                    "features": [
                        {
                            "type": "LABEL_DETECTION",
                            "maxResults": 4
                        },
                        {
                            "type": "LOGO_DETECTION",
                            "maxResults": 4
                        },{
                            "type": "LANDMARK_DETECTION",
                            "maxResults": 4
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

};

export const cloudAPi = (base64) => {
    return fetch(`${cloudApi}${apiKey}`, {
            method: 'POST',
            body: JSON.stringify({
                base: base64
            })
        }).then((response) => {
            return response.json();
        }, (err) => {
            console.error('promise rejected')
            console.error(err)
        });
};