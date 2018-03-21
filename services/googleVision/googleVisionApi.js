const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=';
const apiKey = 'AIzaSyAcnAeGb54WLdoKaMhms-I0RJSJrisNYrI';
const cloudApi = 'https://us-central1-selfify-198709.cloudfunctions.net/getLabels?key=';


var annotations = [];
var blackList = ['hand', 'person', 'head', 'nose', 'ear', 'text', 'font', 'chin', 'facialhair', 'shoulder', 'eyebrow', 'face'];
var LABEL_THRESHOLD = 0.8;
var LOGO_THRESHOLD = 0.25;
var LANDMARK_THRESHOLD = 0.85;
var TEXT_THRESHOLD = 0.35;
var threshold = LABEL_THRESHOLD;
const filter = (annotation) => {
	if (
		(!annotation.score || annotation.score >= threshold) &&
		!blackList.includes(annotation.description.toLowerCase()) &&
		annotation.description.split(' ').length < 3
	) {
		var cleanStr = annotation.description
			.toLowerCase()
			.replace(' ', '')
			.replace(/(\r\n|\n|\r)/gm, '');
		if (cleanStr.length > 1) {
			annotations.push(cleanStr);
		}
	}
};
export const checkForLabels = (base64) => {
	return fetch(
		'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAcnAeGb54WLdoKaMhms-I0RJSJrisNYrI',
		{
			method: 'POST',
			body: JSON.stringify({
				requests: [
					{
						image: {
							content: base64
						},
						features: [
							{
								type: 'LABEL_DETECTION',
								maxResults: 4
							},
							{
								type: 'LOGO_DETECTION',
								maxResults: 2
							},
							{
								type: 'LANDMARK_DETECTION',
								maxResults: 4
							},
							{
								type: 'TEXT_DETECTION'
							}
						]
					}
				]
			})
		}
	)
		.then(stream => stream.json())
		.then(({responses}) => {
			responses.map(response => {
                if (response) {
					if (response.labelAnnotations) {
						response.labelAnnotations.forEach(filter);
					}
					if (response.logoAnnotations) {
						threshold = LOGO_THRESHOLD;
						response.logoAnnotations.forEach(filter);
					}
					if (response.textAnnotations) {
						threshold = TEXT_THRESHOLD;
						response.textAnnotations.forEach(filter);
					}
					if (response.landmarkAnnotations) {
						threshold = LANDMARK_THRESHOLD;
						response.landmarkAnnotations.forEach(filter);
                    }
				}
            });
            
            return annotations;
		});
}
