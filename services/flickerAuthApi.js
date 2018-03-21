// import fs from 'fs';
// import crypto from 'crypto';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';

// import FormData from 'form-data';
import querystring from 'querystring';
import percentEncode from 'oauth-percent-encode';

// TODO: how long sould nonce be?
var generateNonce = function () {
	var i;
	var nonce = '';
	for (i = 0; i < 8; i++) {
		nonce = nonce + Math.floor(Math.random() * 10);
	}
	return nonce;
};

var generateTimestamp = function () {
	var date = new Date();
	var millisec = date.getTime();
	return String(Math.floor(millisec / 1000));
};

var findStringBetween = function (fullString, beforeString, afterString) {
	var beforeStringIndex = fullString.indexOf(beforeString);
	if (beforeStringIndex >= 0) {
		beforeStringIndex += beforeString.length;
		var searchString = fullString.substring(beforeStringIndex, fullString.length);
		var afterStringIndex = searchString.indexOf(afterString);
		if (afterStringIndex < 0) {
			afterStringIndex = searchString.length;
		}
		return searchString.substring(0, afterStringIndex);
	}
	return null;
};

var percentEncodeTwice = function (string) {
	var encodedString = percentEncode(string);
	return percentEncode(encodedString);
};

var createSignature = function (message, key) {
	var hmac = hmacSHA512('sha1', key);
	var hash2 = hmacSHA512(message);
	var signature = hmac.digest(encoding = 'base64');
	signature = querystring.escape(signature);
	return signature;
};

var createSortedKeyValuePairString = function (preString, args, keyValueSeparator,
                                               keySeparator, convertFunc) {
	var prop;
	var sortedKeys = [];
	var keyValuePairString = preString;
	var pushString;

	for (prop in args) {
		sortedKeys.push(prop);
	}

	sortedKeys.sort();

	for (var i = 0; i < sortedKeys.length; i++) {
		if (convertFunc) {
			pushString = convertFunc(args[sortedKeys[i]]);
		} else {
			pushString = args[sortedKeys[i]];
		}
		keyValuePairString += sortedKeys[i] + keyValueSeparator + pushString;
		if (i < sortedKeys.length - 1) {
			keyValuePairString += keySeparator;
		}
	}
	return keyValuePairString;
};

/**
 * Generic function for signing any of the API methods listed on Flickr's page,
 * see https://www.flickr.com/services/api/
 *
 * This function can be used if you want to call the URL using a different
 * machine/client or at a later time in the processing.
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   method: the Flickr method to call
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   oauthToken: the authorized oauth token you have collected in previous
 *     steps or stored from before
 *   oauthTokenSecret: the authorized oauth token secret you have collected
 *     in previous steps or stored from before
 *   callback: see below
 *   optionalArgs: an optional JavaScript object containing any additional
 *     method arguments you wish to pass to the Flickr method. You do not have
 *     to pass in any user or app credentials, or any format type in this object.
 *
 * When the function has finished, the callback you provided will be called,
 * with two arguments, error and data. For a successful call, error will be
 * null and data will be a JavaScript object representing the response from
 * Flickr. You do not have to set the format type by yourself.
 *
 *
 * Example:
 *
 * var args = {
 *   method: 'flickr.cameras.getBrandModels',
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   oauthToken: '99...',
 *   oauthTokenSecret: '1b...',
 *   optionalArgs : {brand: 'Nikon'}
 * };
 *
 * var signedMethod = flickrApi.signApiMethod(args);
 *
 *
 * Note that to call this function, the user needs to have authorized your Flickr
 * app, and you need to have access to authorized 'oauth token' and 'oauth token
 * secret' credentials.
 * If the user has not already authorized your app, and/or you do not already have
 * access to authorized credentials, you need to first get a request token.
 * See documentation for getRequestToken further down below.
 */
var signApiMethod = async function (args) {
	var method = args['method'];
	var flickrConsumerKey = args['flickrConsumerKey'];
	var flickrConsumerKeySecret = args['flickrConsumerKeySecret'];
	var oauthToken = args['oauthToken'];
	var oauthTokenSecret = args['oauthTokenSecret'];
	var callback = args['callback'];
	var optionalArgs = args['optionalArgs'];

	var parameters = {
		oauth_nonce: generateNonce(),
		format: 'json',
		oauth_consumer_key: flickrConsumerKey,
		oauth_timestamp: generateTimestamp(),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		oauth_token: oauthToken,
		method: method,
		format: 'json',
		nojsoncallback: '1'
	};

	if (optionalArgs) {
		for (prop in optionalArgs) {
			parameters[prop] = optionalArgs[prop];
		}
	}

	var cryptoMessage = createSortedKeyValuePairString('POST&https%3A%2F%2F' +
		'api.flickr.com%2Fservices%2Frest',
		parameters, '%3D', '%26', percentEncodeTwice);

	var cryptoKey = flickrConsumerKeySecret + '&' + oauthTokenSecret;
	var signature = createSignature(cryptoMessage, cryptoKey);
	var parameterString = createSortedKeyValuePairString('', parameters, '=', '&',
		percentEncode);

	parameterString += '&oauth_signature=' + signature;

	var path = '/services/rest';


	return fetch('api.flickr.com:443/services/rest' + '?' + parameterString,
		{
			method: 'POST'
		})
};

/**
 * Generic function for calling any of the API methods listed on Flickr's page,
 * see https://www.flickr.com/services/api/
 *
 * Note that this function does not cover photo upload. For photo upload, use
 * the specific photoUpload api below.
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   method: the Flickr method to call
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   oauthToken: the authorized oauth token you have collected in previous
 *     steps or stored from before
 *   oauthTokenSecret: the authorized oauth token secret you have collected
 *     in previous steps or stored from before
 *   callback: see below
 *   optionalArgs: an optional JavaScript object containing any additional
 *     method arguments you wish to pass to the Flickr method. You do not have
 *     to pass in any user or app credentials, or any format type in this object.
 *
 * When the function has finished, the callback you provided will be called,
 * with two arguments, error and data. For a successful call, error will be
 * null and data will be a JavaScript object representing the response from
 * Flickr. You do not have to set the format type by yourself.
 *
 *
 * Example:
 *
 * var myCallback = function (err, data) {
 *   if (!err) {
 *     // Got result in data object
 *     // Iterate through the properties
 *     for (var prop in data) {
 *       console.log('prop: ' + prop);
 *     }
 *   }
 * };
 *
 * var args = {
 *   method: 'flickr.cameras.getBrandModels',
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   oauthToken: '99...',
 *   oauthTokenSecret: '1b...',
 *   callback: myCallback,
 *   optionalArgs : {brand: 'Nikon'}
 * };
 *
 * flickrApi.callApiMethod(args);
 *
 *
 * Note that to call this function, the user needs to have authorized your Flickr
 * app, and you need to have access to authorized 'oauth token' and 'oauth token
 * secret' credentials.
 * If the user has not already authorized your app, and/or you do not already have
 * access to authorized credentials, you need to first get a request token.
 * See documentation for getRequestToken further down below.
 */
var callApiMethod = async function (args) {

	var callback = args['callback'];

	let data = await signApiMethod(args);
	if (callback && (callback instanceof Function)) {
		data = await JSON.parse(data);
		callback(null, data);
	}
};

/**
 * Function for uploading a file (photo) to Flickr.
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   path: full filesystem path to the file you want to upload
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   oauthToken: the authorized oauth token you have collected in previous
 *     steps or stored from before
 *   oauthTokenSecret: the authorized oauth token secret you have collected
 *     in previous steps or stored from before
 *   callback: see below
 *   optionalArgs: an optional JavaScript object containing any additional
 *     method arguments you wish to pass to the Flickr method.
 *     See https://www.flickr.com/services/api/upload.api.html
 *     Note that you do not have to pass in any user or app credentials, or
 *     photo reference in this object.
 *
 * When the function has uploaded the photo, the callback you provided will be
 * called, with two arguments, error and photoId. For a successful upload, error
 * will be null and photoId will be the Flickr photo id that uniquely
 * identifies your new photo.
 *
 * Example:
 *
 * var myCallback = function (err, photoId) {
 *   if (!err) {
 *     console.log('uploaded photoId: ' + photoId);
 *   }
 * };
 *
 * var args = {
 *   path: './myimage.jpg',
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   oauthToken: '99...',
 *   oauthTokenSecret: '1b...',
 *   callback: myCallback,
 *   optionalArgs: {title: 'Title of the photo'}
 * };
 *
 * flickrApi.uploadPhoto(args);
 *
 *
 * Note that to call this function, the user needs to have authorized your Flickr
 * app, and you need to have access to authorized 'oauth token' and 'oauth token
 * secret' credentials.
 * If the user has not already authorized your app, and/or you do not already have
 * access to authorized credentials, you need to first get a request token.
 * See documentation for getRequestToken further down below.
 */
// var uploadPhoto = function (args) {
// 	var path = args['path'];
// 	var flickrConsumerKey = args['flickrConsumerKey'];
// 	var flickrConsumerKeySecret = args['flickrConsumerKeySecret'];
// 	var oauthToken = args['oauthToken'];
// 	var oauthTokenSecret = args['oauthTokenSecret'];
// 	var callback = args['callback'];
// 	var optionalArgs = args['optionalArgs'];
//
// 	var parameters = {
// 		oauth_nonce: generateNonce(),
// 		oauth_timestamp: generateTimestamp(),
// 		oauth_consumer_key: flickrConsumerKey,
// 		oauth_signature_method: 'HMAC-SHA1',
// 		oauth_version: '1.0',
// 		oauth_token: oauthToken
// 	};
//
// 	if (optionalArgs) {
// 		for (prop in optionalArgs) {
// 			parameters[prop] = optionalArgs[prop];
// 		}
// 	}
//
// 	var cryptoMessage = createSortedKeyValuePairString('POST&https%3A%2F%2F' +
// 		'up.flickr.com%2Fservices%2Fupload%2F&',
// 		parameters, '%3D', '%26', percentEncodeTwice);
//
// 	var cryptoKey = flickrConsumerKeySecret + '&' + oauthTokenSecret;
// 	var signature = createSignature(cryptoMessage, cryptoKey);
// 	var parameterString = createSortedKeyValuePairString('', parameters, '=', '&',
// 		percentEncode);
//
// 	parameterString += '&oauth_signature=' + signature;
//
// 	var form = new FormData();
//
// 	for (var prop in parameters) {
// 		form.append(prop, parameters[prop]);
// 	}
// 	form.append('photo', fs.createReadStream(path));
//
// 	form.getLength(function (err, length) {
// 		if (err) return;
//
// 		var path = '/services/upload/';
//
// 		var httpsOptions = {
// 			hostname: 'up.flickr.com',
// 			port: 443,
// 			path: path + '?' + parameterString,
// 			method: 'POST',
// 			headers: {
// 				'content-length': length,
// 				'content-type': 'multipart/form-data; boundary=' + form.getBoundary(),
// 			}
// 		};
//
// 		var req = https.request(httpsOptions, function (res) {
// 			// console.log('upload statusCode: ', res.statusCode);
// 			res.on('data', function (d) {
// 				//console.log('upload result: ' + d);
// 				/* for example
// 				upload statusCode:  200
// 				upload result: <?xml version="1.0" encoding="utf-8" ?>
// 				<rsp stat="ok">
// 				<photoid>14369421238</photoid>
// 				</rsp>
// 				*/
// 				var photoId = findStringBetween(String(d), '<photoid>', '</photoid>');
// 				// console.log('found photo Id: ' + photoId);
// 				if (callback && (callback instanceof Function)) {
// 					if (photoId) {
// 						// console.log('calling callback with photoId ' + photoId);
// 						callback(null, photoId);
// 					} else {
// 						callback(new Error('Upload error: ' + d));
// 					}
// 				}
// 			});
// 		});
// 		form.pipe(req);
// 		req.end();
//
// 		req.on('error', function (e) {
// 			console.error(e);
// 			if (callback && (callback instanceof Function)) {
// 				callback(new Error('Upload error: ' + e));
// 			}
// 		});
// 	});
// };

/**
 * This function calls the 'getPhotos' Flickr api to get a number of photos
 * from a particular user. If userId is set to 'me' it will refer to the
 * logged in user.
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   userId: the unique user identifer to get photos from. If set to 'me',
 *     it will get photos from the current user.
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   oauthToken: the authorized oauth token you have collected in previous
 *     steps or stored from before
 *   oauthTokenSecret: the authorized oauth token secret you have collected
 *     in previous steps or stored from before
 *   optionalArgs: an optional JavaScript object containing any additional
 *     method arguments you wish to pass to the Flickr method.
 *     See https://www.flickr.com/services/api/upload.api.html
 *     Note that you do not have to pass in any user or app credentials, or
 *     photo references in this object.
 *   callback: a callback function you use for receiving the photo refs
 *
 * The response format will be json. You do not have to pass in any format
 * parameter yourself.
 *
 * Example:
 *
 * var myCallback = function (err, data) {
 *   if (!err) {
 *     // Got photos in data object
 *   } else {
 *     console.log('Error: ' + err);
 *   }
 * };
 *
 * var args = {
 *   userId: 'me',
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   oauthToken: '99...',
 *   oauthTokenSecret: '1b...',
 *   callback: myCallback
 * };
 *
 * flickrApi.getPhotos(args);
 *
 *
 * For more info about the getPhotos Flickr api, see:
 * https://www.flickr.com/services/api/flickr.people.getPhotos.html
 */
var getPhotos = function (args) {
	var userId = args['userId'];
	var flickrConsumerKey = args['flickrConsumerKey'];
	var flickrConsumerKeySecret = args['flickrConsumerKeySecret'];
	var oauthToken = args['oauthToken'];
	var oauthTokenSecret = args['oauthTokenSecret'];
	var callback = args['callback'];
	var optionalArgs = args['optionalArgs'];

	var parameters = {
		oauth_nonce: generateNonce(),
		format: 'json',
		oauth_consumer_key: flickrConsumerKey,
		oauth_timestamp: generateTimestamp(),
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		oauth_token: oauthToken,
		method: 'flickr.people.getPhotos',
		user_id: userId,
		nojsoncallback: '1'
	};

	if (optionalArgs) {
		for (prop in optionalArgs) {
			parameters[prop] = optionalArgs[prop];
		}
	}

	var cryptoMessage = createSortedKeyValuePairString('POST&https%3A%2F%2F' +
		'api.flickr.com%2Fservices%2Frest',
		parameters, '%3D', '%26', percentEncodeTwice);

	var cryptoKey = flickrConsumerKeySecret + '&' + oauthTokenSecret;
	var signature = createSignature(cryptoMessage, cryptoKey);
	var parameterString = createSortedKeyValuePairString('', parameters, '=', '&',
		percentEncode);

	parameterString += '&oauth_signature=' + signature;

	var path = '/services/rest';

	var httpsOptions = {
		hostname: 'api.flickr.com',
		port: 443,
		path: path + '?' + parameterString,
		method: 'POST'
	};

	var data = '';
	var req = https.request(httpsOptions, function (res) {
		// console.log('https request statusCode: ', res.statusCode);
		res.on('data', function (d) {
			data += d;
		});

		res.on('end', function () {
			if (callback && (callback instanceof Function)) {
				data = JSON.parse(data);
				callback(null, data);
			}
		});
	});
	req.end();

	req.on('error', function (e) {
		console.error(e);
		if (callback && (callback instanceof Function)) {
			callback(new Error('Error: ' + e));
		}
	});
};

/**
 * Function for exchanging a request token to an access token.
 *
 * After the user has authorized your Flickr app, you need to exchange the
 * request token to an access token, so that you can make authorized
 * api calls.
 *
 * This function should be called after you have called getRequestToken, and
 * after you have asked the user to authorize your Flickr app. (See
 * getRequestToken documentation further down below.)
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   oauthToken: the oauth token you have collected in previous step
 *   oauthTokenSecret: the oauth token secret you collected from calling
 *     getRequestToken earlier.
 *   oauthVerifier: the oauth verifier you collected when Flickr called
 *     your redirect url from previous step
 *   callback: when the function has called Flickr and retrieved the oauth
 *     token and oauth token secret, your provided callback function will
 *     be called with two arguments: error and data. In the successful case,
 *     the data object will contain the following properties:
 *       oauthToken, oauthTokenSecret, userNsId, userName, fullName
 *     You need to remember the oauthToken and oauthTokenSecret credentials,
 *     as those are needed to make authorized api calls hereafter.
 *
 * Example:
 *
 * var myCallback = function (err, data) {
 *   if (!err) {
 *     console.log('oauthToken: ' + data.oauthToken);
 *     console.log('oauthTokenSecret: ' + data.oauthTokenSecret);
 *     console.log('userNsId: ' + data.userNsId);
 *     console.log('userName: ' + data.userName);
 *     console.log('fullName: ' + data.fullName);
 *   } else {
 *     console.log('error: ' + err);
 *   }
 * };
 *
 * var args = {
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   oauthToken: '99...',
 *   oauthTokenSecret: '3c...',
 *   oauthVerifier: 'd7...',
 *   callback: myCallback
 * };
 *
 * flickrApi.useRequestTokenToGetAccessToken(args);
 *
 *
 * Note that if you already have access to authorized oauthToken and
 * oauthTokenSecret credentials, and if the user already has authorized your app,
 * you don't need to call this function. Instead you can call for example
 * uploadPhoto or callApiMethod directly with your stored credentials.
 */
var useRequestTokenToGetAccessToken = function (args) {
	var flickrConsumerKey = args['flickrConsumerKey'];
	var flickrConsumerKeySecret = args['flickrConsumerKeySecret'];
	var oauthToken = args['oauthToken'];
	var oauthTokenSecret = args['oauthTokenSecret'];
	var oauthVerifier = args['oauthVerifier'];
	var callback = args['callback'];

	var parameters = {
		oauth_nonce: generateNonce(),
		oauth_timestamp: generateTimestamp(),
		oauth_verifier: oauthVerifier,
		oauth_consumer_key: flickrConsumerKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		oauth_token: oauthToken
	};

	var cryptoMessage = createSortedKeyValuePairString('GET&https%3A%2F%2F' +
		'www.flickr.com%2Fservices%2Foauth%2Faccess_token&',
		parameters, '%3D', '%26', percentEncodeTwice);

	var cryptoKey = flickrConsumerKeySecret + '&' + oauthTokenSecret;
	var signature = createSignature(cryptoMessage, cryptoKey);

	var parameterString = createSortedKeyValuePairString('', parameters, '=', '&',
		percentEncode);

	parameterString += '&oauth_signature=' + signature;

	var path = '/services/oauth/access_token';
	var httpsOptions = {
		hostname: 'www.flickr.com',
		port: 443,
		path: path + '?' + parameterString,
		method: 'GET'
	};

	var req = https.request(httpsOptions, function (res) {
		res.on('data', function (d) {
			// console.log('useRequestTokenToGetAccessToken data: ' + d);
			var str = String(d);

			var oauthToken = findStringBetween(str, 'oauth_token=', '&');
			var oauthTokenSecret = findStringBetween(str, 'oauth_token_secret=', '&');
			var userNsId = findStringBetween(str, 'user_nsid=', '&');
			var userName = findStringBetween(str, 'username=', '&');
			var fullName = findStringBetween(str, 'fullname=', '&');

			if (callback && (callback instanceof Function)) {
				if (oauthToken && oauthTokenSecret) {
					callback(null, {
						oauthToken: oauthToken,
						oauthTokenSecret: oauthTokenSecret,
						userNsId: userNsId,
						userName: userName,
						fullName: fullName
					});
				} else {
					callback(str, null);
				}
			}
		});
	});
	req.end();

	req.on('error', function (e) {
		console.log('useRequestTokenToGetAccessToken error!');
		console.error(e);
		if (callback && (callback instanceof Function)) {
			callback(new Error('useRequestTokenToGetAccessToken error: ' + e));
		}
	});
};

/**
 * Function for getting a request token from Flickr.
 *
 * To be able to make Flickr API calls, the user needs to authorize your
 * Flickr app, and you need authorized oauth_token and oauth_token_secret
 * credentials.
 * If you do not already have those credentials, you can call this function.
 * The function will call Flickr to get a request token, and to generate
 * a url where your user can log in to Flickr and authorize your app.
 *
 * Call the function with a JavaScript object as argument. The JavaScript
 * object should have the following properties:
 *   flickrConsumerKey: your Flickr app key. You get this when you
 *     create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   flickrConsumerKeySecret: your Flickr app secret. You get this when
 *     you create your Flickr app on Flickr's developer pages.
 *     See https://www.flickr.com/services/
 *   permissions: 'read', 'write', or 'delete'. If you want to be able to
 *     upload photos, you must use either 'write' or 'delete'.
 *   redirectUrl: a url of your choice that Flickr will redirect to after
 *     the user has logged in and authorized your app. Note that this
 *     must match the redirect url you specify for your app on Flickr's
 *     developer page, see Flickr App Garden, https://www.flickr.com/services/
 *     and your particular app's settings there.
 *   callback: a callback you wish to be called when the request token has
 *     been retrieved. The callback will be called with two arguments,
 *     error and data. In the successful case, the data object will contain
 *     the following properties:
 *     oauthToken, oauthTokenSecret, url
 *     You need to remember those credentials as they are needed in next
 *     api call step.
 *     The url is a Flickr url where the user will be asked to log in to
 *     Flickr and review and approve the permissions you asked for here.
 *     So when your callback is called, you should tell the user to visit
 *     that url and authorize the app. And you should listen on the
 *     redirect url so that you can catch the query parameters provided
 *     there by Flickr after the user has authorized the app. In the
 *     query parameters you should find (and remember) 'oauth_token'
 *     and 'oauth_verifier' as those are needed in the next api call,
 *     'useRequestTokenToGetAccessToken'.
 *
 * Example:
 *
 * var myCallback = function (err, data) {
 *   if (!err) {
 *     console.log('Remember the credentials:');
 *     console.log('oauthToken: ' + data.oauthToken);
 *     console.log('oauthTokenSecret: ' + data.oauthTokenSecret);
 *     console.log('Ask user to go here for authorization: ' + data.url);
 *   } else {
 *     console.log('Error: ' + err);
 *   }
 * };
 *
 * var args = {
 *   flickrConsumerKey: '42...',
 *   flickrConsumerKeySecret: 'aa...',
 *   permissions: 'write',
 *   redirectUrl: 'http://www.redirecturl...',
 *   callback: myCallback
 * };
 *
 * flickrApi.getRequestToken(args);
 *
 */
var getRequestToken = function (args) {
	var flickrConsumerKey = args['flickrConsumerKey'];
	var flickrConsumerKeySecret = args['flickrConsumerKeySecret'];
	var permissions = args['permissions'];
	var redirectUrl = args['redirectUrl'];
	var callback = args['callback'];

	var parameters = {
		oauth_nonce: generateNonce(),
		oauth_timestamp: generateTimestamp(),
		oauth_consumer_key: flickrConsumerKey,
		oauth_signature_method: 'HMAC-SHA1',
		oauth_version: '1.0',
		oauth_callback: redirectUrl
	};

	var cryptoMessage = createSortedKeyValuePairString('GET&https%3A%2F%2F' +
		'www.flickr.com%2Fservices%2Foauth%2Frequest_token&',
		parameters, '%3D', '%26', percentEncodeTwice);

	var cryptoKey = flickrConsumerKeySecret + '&';
	var signature = createSignature(cryptoMessage, cryptoKey);

	var parameterString = createSortedKeyValuePairString('', parameters, '=', '&',
		percentEncode);

	parameterString += '&oauth_signature=' + signature;

	var path = '/services/oauth/request_token';
	var httpsOptions = {
		hostname: 'www.flickr.com',
		port: 443,
		path: path + '?' + parameterString,
		method: 'GET'
	};

	var req = https.request(httpsOptions, function (res) {
		// console.log('getRequestToken statusCode: ', res.statusCode);

		res.on('data', function (d) {
			// console.log('getRequestToken data: ' + d);
			var str = String(d);
			var oauthToken = findStringBetween(str, 'oauth_token=', '&');
			var oauthTokenSecret = findStringBetween(str, 'oauth_token_secret=', '&');

			var url = 'https://www.flickr.com/services/oauth/authorize?oauth_token=' +
				oauthToken + '&perms=' + permissions;

			if (callback && (callback instanceof Function)) {
				if (oauthToken && oauthTokenSecret) {
					callback(null, {
						oauthToken: oauthToken,
						oauthTokenSecret: oauthTokenSecret,
						url: url
					});
				} else {
					callback(str, null);
				}
			}
		});
	});

	req.end();

	req.on('error', function (e) {
		console.log('getRequestToken error!');
		console.error(e);
		if (callback && (callback instanceof Function)) {
			callback(new Error('getRequestToken error: ' + e));
		}
	});
}

export {
	getRequestToken,
	useRequestTokenToGetAccessToken,
	// uploadPhoto,
	getPhotos,
	callApiMethod,
	signApiMethod
}