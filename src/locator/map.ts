// @ts-ignore
import google from "google";
import { getValueFromPath, scrollToRow } from "./utils";
import { currentLatitude, currentLongitude } from "./locations";
import { locationOptions,limit,locationInput } from "./constants";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

let zoom = 6;
let openMapCenter = '';
let openMapZoom = '';
let openInfoWindow = false;

let pinStyles;
let marker_icon;
let selected_marker_icon;
// Map Configuration
let markers = [];
let bounds;
var mapMarkerClusterer = null;
let selectedLocationIndex = -1;


export const map = new google.maps.Map(document.getElementById("map"), {
  center: { lat: 54.5709071, lng: -4.4095761 },
  zoom: zoom,
	styles: [
	// {
	// 	"featureType": "all",
	// 	"elementType": "geometry.fill",
	// 	"stylers": [
	// 		{
	// 			"weight": "0.50"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "all",
	// 	"elementType": "geometry.stroke",
	// 	"stylers": [
	// 		{
	// 			"color": "#ff0000"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "all",
	// 	"elementType": "labels.text",
	// 	"stylers": [
	// 		{
	// 			"visibility": "on"
	// 		}
			
	// 	]
	// },
	// {
	// 	"featureType": "landscape",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"color": "#0db609"
	// 		},
	// 		{
	// 			"weight": "0.50"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "landscape",
	// 	"elementType": "geometry.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#08304b"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "landscape.man_made",
	// 	"elementType": "geometry.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#08304b"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "poi",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"visibility": "off"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"saturation": -100
	// 		},
	// 		{
	// 			"lightness": 45
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road",
	// 	"elementType": "geometry.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#1f7481"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road",
	// 	"elementType": "labels.text.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#1f7481"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road",
	// 	"elementType": "labels.text.stroke",
	// 	"stylers": [
	// 		{
	// 			"color": "#10b308"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road.highway",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"visibility": "simplified"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "road.arterial",
	// 	"elementType": "labels.icon",
	// 	"stylers": [
	// 		{
	// 			"visibility": "off"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "transit",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"visibility": "off"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "water",
	// 	"elementType": "all",
	// 	"stylers": [
	// 		{
	// 			"color": "#0c2f69"
	// 		},
	// 		{
	// 			"visibility": "on"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "water",
	// 	"elementType": "geometry.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#021019"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "water",
	// 	"elementType": "labels.text.fill",
	// 	"stylers": [
	// 		{
	// 			"color": "#10b308"
	// 		}
	// 	]
	// },
	// {
	// 	"featureType": "water",
	// 	"elementType": "labels.text.stroke",
	// 	"stylers": [
	// 		{
	// 			"color": "#ffffff"
	// 		}
	// 	]
	// }
	],
  mapTypeControl: false,
});

export function centerOnGeo(geo) {
  let lat, lng;
  if (geo && geo.coordinate) {
    lat = geo.coordinate.latitude;
    lng = geo.coordinate.longitude;
  } else {
    lat = currentLatitude;
    lng = currentLongitude;
  }
  [].slice
    .call(document.querySelectorAll(".error-text") || [])
    .forEach(function (el) {
      el.textContent = "";
    });
  map.setCenter({ lat: lat, lng: lng });
  map.setZoom(zoom);
}

function hexToRgb(hex) {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return {
    r: parseInt(m[1], 16),
    g: parseInt(m[2], 16),
    b: parseInt(m[3], 16),
  };
}

// Postive values >> lighten
// Negative values >> darken
function changeColor(hex, amt) {
  const rgb = hexToRgb(hex);

  Object.keys(rgb).forEach(function (key) {
    let c = rgb[key];
    // Add amt to color value, min/max at 0/255
    c += amt;
    if (c > 255) c = 255;
    else if (c < 0) c = 0;

    // Convert RGB value back to hex string
    rgb[key] =
      c.toString(16).length == 1 ? "0" + c.toString(16) : c.toString(16);
  });

  return "#" + rgb.r + rgb.g + rgb.b;
}

export function addMarkersToMap(locations) {
  let marker;
  bounds = new google.maps.LatLngBounds();
  console.log(markers);
  for (let index = 0; index < markers.length; index++) {
    marker = markers[index];
    marker.setMap(null);
  }
  markers = [];
  // console.log(markers);
  
  const coordinates = {
    value: { latitude: 0, longitude: 0 },
    contentSource: "FIELD",
  };
  pinStyles = {
    fill: "#da261b", //default google red
    stroke: "#da261b",
    text: "white",
    fill_selected: "#000",
    stroke_selected: "#000",
    text_selected: "#fff",
  };

  marker_icon = {
    // default google pin path
    path: "M 7.75 -37.5 c -4.5 -4 -11 -4 -15.5 0 c -4.5 3.5 -6 10 -3 15 l 5 8.5 c 2.5 4 4.5 8 5 13 l 1 1 l 0.5 -1 s 0 0 0 0 c 0.5 -4.5 2.5 -8.5 5 -12.5 l 5 -9 c 3 -5 1.5 -11.5 -3 -15",
	fillColor: pinStyles.fill,
    scale: 1.1,
    fillOpacity: 1,
    strokeColor: pinStyles.stroke,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(0, -25),
  };

  selected_marker_icon = {
    path: "M 7.75 -37.5 c -4.5 -4 -11 -4 -15.5 0 c -4.5 3.5 -6 10 -3 15 l 5 8.5 c 2.5 4 4.5 8 5 13 l 1 1 l 0.5 -1 s 0 0 0 0 c 0.5 -4.5 2.5 -8.5 5 -12.5 l 5 -9 c 3 -5 1.5 -11.5 -3 -15",
    fillColor: pinStyles.fill_selected,
    fillOpacity: 1,
    scale: 1.3,
    strokeColor: pinStyles.stroke_selected,
    strokeWeight: 1,
    labelOrigin: new google.maps.Point(0, -25),
  };
  
//   marker_icon  = "/images/map.png";
//   selected_marker_icon  = "/images/map-s.png";
  
  // console.log(locations);
  
  let offset = Number($('#offset').val());
  
  try{if(mapMarkerClusterer){mapMarkerClusterer.clearMarkers();}}catch(e){}
  for (let index = 0; index < locations.length; index++) {
    const location = locations[index];
    let coordinatesValue = coordinates["value"];
    
	
	coordinatesValue = getValueFromPath(
      location,
      locationOptions.coordinates.value
    );
	
	coordinatesValue = coordinatesValue || getValueFromPath(
        location,
        locationOptions.yextCoordinates.value
    );
	
		
	// let markerLabel = Number(index + 1 + offset) - limit;
	 let markerLabel = Number(index + 1 );
	 
    if (coordinatesValue) {
      marker = new google.maps.Marker({
        title : location.name.toString(),
        position: {
          lat: coordinatesValue.latitude,
          lng: coordinatesValue.longitude,
        },
        map: map,
        icon: marker_icon,
        label: {
          text: String(markerLabel),
          color: pinStyles.text,
        },
        optimized: false,
      });
      const selected_marker = new google.maps.Marker({
        position: {
          lat: coordinatesValue.latitude,
          lng: coordinatesValue.longitude,
        },
        map: map,
        icon: selected_marker_icon,
        label: {
          text: String(markerLabel),
          color: pinStyles.text_selected,
        },
        optimized: false,
      });

      selected_marker.setVisible(false);

		bounds.extend(marker.position);
		var infoWindow = new google.maps.InfoWindow();
		google.maps.event.addListener(selected_marker, "click", function () { 
			highlightLocation(index, false, true, null, infoWindow, bounds); 
		});
				
		google.maps.event.addListener(marker, "mouseover", function () {			  
			highlightLocation(index, false, false, null, infoWindow, bounds); 						 
		});
			
			
      markers.push(marker);
    }
  }
  
  // console.log([markers,'markers']);
  
  if(markers.length > 0){
	 mapMarkerClusterer = new MarkerClusterer({ markers, map });
  } 
  map.fitBounds(bounds);
map.setZoom(2);
  
}

export function highlightLocation(
  index,
  shouldScrollToRow,
  shouldCenterMap,
  marker = null,
  infoWindow = null,
  bounds = null  
) {
  if (!marker) {
    marker = markers[index];
  }
  if (selectedLocationIndex == index) { 
    // No Change (just center map or scroll)
    /*if (shouldCenterMap) {
      map.setCenter(marker.position);
    }

    if (shouldScrollToRow) {
      scrollToRow(index);
    }*/
	
	if(infoWindow){		
			var $this = $('#result-'+index);
			// var location_name = $this.data('name');						
			var storelocationName = $this.find('.storelocation-name').html();
			var address = $this.find('.address').html();
			var openCloseTime = $this.find('.storelocation-openCloseTime').html();
			var sales= $this.find('.sales').html();
			var letting= $this.find('.letting').html();


			var markerContent = '<div class="markerContent w-48 md:w-[350px] font-universpro font-normal text-darkgrey text-xs md:text-sm leading-6">';

			markerContent += '<div class="nameData font-bold text-sm md:text-base">'+storelocationName+'</div>';
			markerContent += '<div class="addressData">'+address+'</div>';
			markerContent += '<div class="salesData">'+sales+'</div>';
			if(letting===undefined){}
			else{
			markerContent += '<div class="lettingData">'+letting+'</div>';
			}
			markerContent += '<div class="openCloseTimeData mt-2 md:mt-3">'+openCloseTime+'</div>';

			markerContent += '</div>';

			// console.log(markerContent);
				
			// var mapZoom  = map.getZoom();
			// var mapCenter  = map.getCenter();
			
			marker.addListener("click", () => {
				if(!openInfoWindow){
					openMapZoom = map.getZoom();
					openMapCenter = map.getCenter();
				}
				document.querySelectorAll(".result")[index].classList.add("active");
				scrollToRow(index);
				map.setZoom(12);	
				map.setCenter(marker.getPosition());				
				// bounds.extend(selectedMarker.getPosition());								
				infoWindow.setContent(markerContent);		
				infoWindow.open(map, marker);
				openInfoWindow = true;	
			});
			
			infoWindow.addListener("closeclick", () => { 	
				document.querySelectorAll(".result")[index].classList.remove("active");
				// document.querySelectorAll(".result")[index].classList.remove("selected");
				// map.setZoom(mapZoom);
				map.setZoom(openMapZoom);
				map.setCenter(openMapCenter);
				// bounds.extend(mapCenter);
				openInfoWindow = false;
				infoWindow.close();	
			}); 
		}
	
	
  } else { 
    const prevIndex = selectedLocationIndex;
    selectedLocationIndex = index;

    [].slice
      .call(document.querySelectorAll(".result") || [])
      .forEach(function (el) {
        el.classList.remove("selected");
      });
	  
    // document.querySelectorAll(".result")[index].classList.add("selected");

    if (shouldScrollToRow) {
      scrollToRow(index); 
    }
	
	
    // Update Map
    if (prevIndex !== -1) { 
      const prevMarker = markers[prevIndex];
      // Breifly disables mouseevents to prevent infinite mouseover looping for overlapped markers
    if(prevMarker){
		  
      let offset = Number($('#offset').val());	
      // let markerLabel = Number(prevIndex + 1 + offset) - limit;
    //   let markerLabel = Number(prevIndex + 1 );
	  // let markerLabel = Number(prevIndex + 1);
		  prevMarker.setClickable(false);
		  prevMarker.setIcon(marker_icon);
		//   prevMarker.setLabel({
		// 	// text: String(markerLabel),
		// 	color: pinStyles.text,
		//   });
		  prevMarker.setZIndex(null);

		  setTimeout(function () {
			prevMarker.setClickable(true);
		  }, 50);
	  
	  }
	  
	  
    }

    const selectedMarker = markers[selectedLocationIndex];
    selectedMarker.setIcon(selected_marker_icon);
	
	
	let offset = Number($('#offset').val());	
	if (typeof offset === 'undefined'){
		 offset = 0;
	}	
	// console.log([offset,limit],'limit');	
	// let markerLabel = Number(selectedLocationIndex + 1 + offset) - limit;
	// let markerLabel = Number(selectedLocationIndex + 1);
	
		
	
    // selectedMarker.setLabel({
    // //   text: String(markerLabel),
    //   color: pinStyles.text_selected,
    // });
    selectedMarker.setZIndex(999);

    if (shouldCenterMap) {
      map.setCenter(marker.position);
    }
	
	
		
		if(infoWindow){		
			var $this = $('#result-'+index);
			// var location_name = $this.data('name');						
			var storelocationName = $this.find('.storelocation-name').html();
			var address = $this.find('.address').html();
			var openCloseTime = $this.find('.storelocation-openCloseTime').html();
			var sales= $this.find('.sales').html();
			var letting= $this.find('.letting').html();

			var markerContent = '<div class="markerContent w-48 md:w-[350px] font-universpro font-normal text-darkgrey text-xs md:text-sm leading-6">';

			markerContent += '<div class="nameData font-bold text-sm md:text-base">'+storelocationName+'</div>';
			markerContent += '<div class="addressData">'+address+'</div>';
			markerContent += '<div class="salesData">'+sales+'</div>';
			if(letting===undefined){}
			else{
			markerContent += '<div class="lettingData">'+letting+'</div>';
			}
			markerContent += '<div class="openCloseTimeData mt-2 md:mt-3">'+openCloseTime+'</div>';

			markerContent += '</div>';

			// console.log(markerContent);
				
			var mapZoom  = map.getZoom();
			var mapCenter  = map.getCenter();
			
			selectedMarker.addListener("click", () => { 
				
				if(!openInfoWindow){
					openMapZoom = map.getZoom();
					openMapCenter = map.getCenter();
				}
				document.querySelectorAll(".result")[index].classList.add("active");
				scrollToRow(index);
				map.setZoom(12);	
				map.setCenter(selectedMarker.getPosition());				
				// bounds.extend(selectedMarker.getPosition());								
				infoWindow.setContent(markerContent);		
				infoWindow.open(map, selectedMarker);
				openInfoWindow = true;	
			});
			
			infoWindow.addListener("closeclick", () => { 	
				document.querySelectorAll(".result")[index].classList.remove("active");
				// document.querySelectorAll(".result")[index].classList.remove("selected");
				
				// map.setZoom(mapZoom); 
				// bounds.extend(mapCenter);
				
				map.setZoom(openMapZoom);
				map.setCenter(openMapCenter);
				openInfoWindow = false;	
				infoWindow.close();	
			}); 
		}
		
	/*
	google.maps.event.addListener(map, 'click', function() {
        infoWindow.close(); 
    });
	*/
	
  } 
}

export const geoCorder = new google.maps.Geocoder();
// (
  // latLng
// ) {
	// return new Promise((resolve, reject) => {
	  // new google.maps.Geocoder().geocode({ location: latLng })
		// .then((response) => {
		  // if (response.results[0]) {
			// locationInput.value = response.results[0].formatted_address;
			// return resolve(response.results[0]);
		  // } 
		// })
		// .catch((e) => {resolve(e)});
	// });
   
// }

function getCustomPinColor(hex) {
  // Converts hex to RGB values
  const rgb = hexToRgb(hex);

  // Calcs perceived brightness using the sRGB Luma method
  const lightness = (rgb.r * 0.2126 + rgb.g * 0.7152 + rgb.b * 0.0722) / 255;
  const isDark = lightness < 0.5;

  if (isDark) {
    return {
      fill: hex,
      stroke: "#fff",
      text: "#fff",
      fill_selected: changeColor(hex, 150),
      stroke_selected: hex,
      text_selected: "#000",
    };
  } else {
    const darker = changeColor(hex, -150);
    return {
      fill: hex,
      stroke: darker,
      text: "#000",
      fill_selected: darker,
      stroke_selected: "#fff",
      text_selected: "#fff",
    };
  }
}