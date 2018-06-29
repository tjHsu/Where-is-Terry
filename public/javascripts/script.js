console.log("calling script.js");

let center = {
  lat: 52.5170874,
  lng: 13.4019591
};
let spotLat = Number($("#informationCarrier-lat").text());
let spotLong = Number($("#informationCarrier-long").text());

$(".locate-me-button").click(function(event) {
  console.log("locate me button clicked");
  navigator.geolocation.getCurrentPosition(position => {
    // window.location.replace('https://google.com')
    console.log(
      "we are in the locate me button juqery and this is out latitude",
      position.coords.latitude
    );
    console.log("position", position);

    window.location.replace(
      `/location/?latitude=${position.coords.latitude}&longitude=${
        position.coords.longitude
      }`
    );
    // center = {
    //   lat: position.coords.latitude,
    //   lng: position.coords.longitude
    //   }
    // console.log("Here is the Center in Jquery: ", center);
    // loadEverything();
  });
});

$(document).ready(function() {
  // console.log("TYPE: #info. Lat and Long", typeof Number($("#informationCarrier-lat").text()), typeof Number($("#informationCarrier-long").text()));
  if (spotLong != 0 && spotLat != 0) {
    // spotLat = Number($("#informationCarrier-lat").text()); //gives whats written in between the informationCarrier Div
    // spotLong = Number($("#informationCarrier-long").text());
    console.log("Lat and Long", spotLat, spotLong);
    center = {
      lat: spotLat,
      lng: spotLong
    };
  }
  // else {
  console.log("centerInside", center);
  //   center = {
  //     lat: 52.5170874,
  //     lng: 13.4019591
  //  };
  // }

  console.log("centeroutside", center);

  loadEverything();

  function loadEverything() {
    console.log("we are loading the map");

    axios
      .get(`/api/spots/${center.lat}/${center.lng}`)
      // .get(`/api/spots`)
      .then(response => {
        // console.log("DEGUG: response: ", response);
        let spots = response.data.spots;
        console.log("spots after route", spots);
        // console.log("DEGUG: spotList: ", spots);
        startMap(spots);
      })

      .catch(error => {
        console.log(error);
      });
  }

  function startMap(spots) {
    console.log("DEBUG center", center);

    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 15,
      center: center,
      styles: [
        {
          featureType: "all",
          elementType: "geometry.fill",
          stylers: [
            {
              weight: "2.00"
            }
          ]
        },
        {
          featureType: "all",
          elementType: "geometry.stroke",
          stylers: [
            {
              color: "#9c9c9c"
            }
          ]
        },
        {
          featureType: "all",
          elementType: "labels.text",
          stylers: [
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [
            {
              color: "#f2f2f2"
            }
          ]
        },
        {
          featureType: "landscape",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "landscape.man_made",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [
            {
              saturation: -100
            },
            {
              lightness: 45
            }
          ]
        },
        {
          featureType: "road",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#eeeeee"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#7b7b7b"
            }
          ]
        },
        {
          featureType: "road",
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        },
        {
          featureType: "road.highway",
          elementType: "all",
          stylers: [
            {
              visibility: "simplified"
            }
          ]
        },
        {
          featureType: "road.arterial",
          elementType: "labels.icon",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [
            {
              visibility: "off"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [
            {
              color: "#46bcec"
            },
            {
              visibility: "on"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [
            {
              color: "#E9E8EA"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [
            {
              color: "#070707"
            }
          ]
        },
        {
          featureType: "water",
          elementType: "labels.text.stroke",
          stylers: [
            {
              color: "#ffffff"
            }
          ]
        }
      ]
    });

    //Create a Marker for every spot in the spots array
    let spotMarkers = [];
    let infoWindows = [];

    for (let i = 0; i < spots.length; i++) {
      let newMarker = new google.maps.Marker({
        position: {
          lat: spots[i].coordinates.latitude,
          lng: spots[i].coordinates.longitude
        },
        map: map,
        title: spots[i].name
      });
      spotMarkers.push(newMarker);
      let commentString = [];
      let commentTemp ="";
      console.log("Length:", spots[i]._comments.length)
      //Create a Comment string for each of the Spots
      for (let j = 0; j < spots[i]._comments.length; j++) {
        commentTemp += spots[i]._comments[j].content;
      }

      commentString.push(commentTemp);

      // create infoWindow with description for each of the spots
      let infoWindow = new google.maps.InfoWindow({
        content:
          `<div class="col-lg-4 col-md-6 col-sm-12 p-2">` +
          `<div class="card text-center mx-auto" style="width: 18rem">` +
          `<div class="clip-image">` +
          `<img class="card-img-top pt-3 mx-auto mt-auto" src=${
            spots[i].image_url
          }>` +
          `</div>` +
          `<div class="card-body">` +
          `<h5 class="card-title">` +
          spots[i].name +
          `</h5>` +
          `<p class="card-text">` +
          commentString[i]+
          "</br>" +
          `</p>` +
          `<a href=${spots[i].url} class="btn btn-primary" target="_blank">` +
          `visit on yelp` +
          `</a>` +
          ` <a href="/places/detail/${
            spots[i]._id
          }" class="btn btn-primary" target="_blank">edit</a>` +
          `</div>` +
          `</div>` +
          ` </div>`
      });

      infoWindows.push(infoWindow);
      // add listener to each spot
      spotMarkers[i].addListener("click", function() {
        infoWindows[i].open(map, spotMarkers[i]);
      });
    }
  }
});
