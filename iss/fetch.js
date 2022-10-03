let url ='https://api.wheretheiss.at/v1/satellites/25544'


let dateTimeUpdateFetched = document.querySelector('#date-time')
let issLat = document.querySelector('#iss-lat')
let isslong = document.querySelector('#iss-long')

let map = L.map('iss-map').setView([0, 0], 1)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

let update = 10000 //10 seconds
let maxFailedAttempts = 3
let issMarker

let issIcon =L.icon({
    iconUrl: 'satellite Icon.png',
    iconSize:[45, 45],
    iconAnchor: [25, 25]
   // popupAnchor:[-3, -75] //the position of the anchor on the map
})

iss(maxFailedAttempts) //call function one time to start
//setInterval(iss, update)

function iss(attempts) {

    if (attempts <= 0) { //stop after max failed attempts
        alert('Failed to contact ISS server after several attempts')
        return //alert and return
    }
    fetch(url)
        .then( res => res.json()) //process response into JSON
        .then((issData) => {
            console.log(issData) //TODO - display data on web page
            let lat = issData.latitude
            let long = issData.longitude
            issLat.innerHTML = lat
            isslong.innerHTML = long

            //create marker if it doesn't exist
            //move marker if it does exist
             if (!issMarker) {
                 //crate marker
                 issMarker = L.marker([lat, long],{icon: issIcon}).addTo(map)
             } else {
                 issMarker.setLatLng([lat, long])
             }

             let now = Date()
            dateTimeUpdateFetched.innerHTML= `This data was fetched at ${now}`


    }).catch((err) => {
        attempts = attempts -1 //subtract 1 from number of attempts
        console.log('ERROR!', err)
    })
        .finally(() => {
            //finally runs whether the fetch() worked or failed.
            //Call the iss function after a delay of update miliseconds
            //to update the position
            setTimeout(iss, update, attempts) //wait for few seconds before fetching next data
        })
}