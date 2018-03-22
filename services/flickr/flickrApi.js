
const apiKey = '1ae6b8e20a9d9b839aa2ff60fbe492c7';

const apiUrl = 'https://api.flickr.com/services/rest/?api_key='+apiKey+'&nojsoncallback=1&format=json&method=';

const searchApi = 'flickr.photos.search&per_page=10&tag_mode=any&tags='
const getPhotoGeoApi = 'flickr.photos.geo.getLocation&tphoto_id='


var tags = []
var photoUrls = []

const buildPhotoUrl = (photo) => {
//https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
//<photo id="39106691150" owner="89165847@N00" secret="51383a2e65" server="810" farm="1" title="Friends Walking in Sunlight" ispublic="1" isfriend="0" isfamily="0"/>
    if (photo){
        url = 'https://farm'+photo.farm+'.staticflickr.com/'+photo.server+'/'+photo.id+'_'+photo.secret+'.jpg';
        if (!photo.title) photo.title="";
        if (!photo.owner) photo.owner="";
        photoUrls.push({title: photo.title,subtitle:photo.owner, illustration:url});
    }
    
}

export const searchPhotos = (tags) => {
	return fetch(apiUrl +searchApi + tags )
    .then(stream => stream.json())
    //.then (data => console.log(data))
    .then((response) => {
        //console.log(response);
        // responses.map(response => {
            if (response) {
                    //console.log(respone);
                    if (response.stat =='ok' && response.photos.total >0){
                        response.photos.photo.forEach(buildPhotoUrl);
                    } else {
                        console.log('no photos found')
                    }
            }
       // })
        //console.log(photoUrls)
        return photoUrls;
    });
}