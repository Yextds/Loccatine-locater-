import {
  entityTypes,
  liveAPIKey,
  locationInput,
  savedFilterId,
  limit,
  setCookie,
  getCookie,
  radius,
  base_url,
  isMobileStatus
} from "./constants";
import { renderLocations, renderSearchDetail, getNearestLocationsByString } from "./locations";
import { addMarkersToMap, centerOnGeo } from "./map";
import { scrollToRow } from "./utils"; 

export let isLoading = false;
var isMobile = isMobileStatus(); //initiate as false

let locations = [];

export function startLoading() {
  // console.log("start loading");
  isLoading = true;

  [].slice
    .call(document.querySelectorAll(".spinner") || [])
    .forEach(function (el) {
      el.style.visibility = "visible";
    });
  [].slice
  .call(document.querySelectorAll(".search-center") || [])
  .forEach(function (el) {
   el.innerHTML = "";
  });
  [].slice
    .call(document.getElementsByClassName("result") || [])
    .forEach(function (el) {
      // el.style.visibility = "hidden";
      // el.innerHTML = '<div class="skeleton h-6 flex-grow mx-4 my-10"></div>';
    });
  locationInput.disabled = false;
  [].slice
    .call(document.querySelectorAll(".search") || [])
    .forEach(function (el) {
      el.classList.add("disabled");
    });
}

export function stopLoading() {
  isLoading = false;

  [].slice
    .call(document.querySelectorAll(".spinner") || [])
    .forEach(function (el) {
      el.style.visibility = "hidden";
    });
  [].slice
    .call(document.querySelectorAll(".result-list") || [])
    .forEach(function (el) {
      el.style.visibility = "visible";
    });
  locationInput.disabled = false;
  [].slice
    .call(document.querySelectorAll(".search") || [])
    .forEach(function (el) {
      el.classList.remove("disabled");
    });
}

export function getRequest(request_url, queryString, back = false, useMylocation = []) {
  // Add query string to URL
  if (queryString !== null) {
    const newUrl = window.location.href.replace(
      /(\?.*)?$/,
      "?q=queryString".replace("queryString", queryString)
    );
    if (
      window.history.state &&
      window.history.state.queryString !== queryString
    ) {
      window.history.pushState({ queryString: queryString }, "", newUrl);
    } else {
      window.history.replaceState({ queryString: queryString }, "", newUrl);
    }
	 
  }else{
	const newUrl = window.location.href.split('?')[0];
	window.history.pushState({}, '', newUrl); 
  }
  
  startLoading();
  request_url += "&api_key=" + liveAPIKey;
  request_url += "&v=" + "20181201";
  request_url += "&resolvePlaceholders=true";

  if (entityTypes) {
    request_url += "&entityTypes=" + entityTypes;
  }

  if (savedFilterId) {
    request_url += "&savedFilterIds=" + savedFilterId;
  }
  
   let offset = Number($('#offset').val());
   
      
   if (offset > 0 && 0) {
		$('.backBtnDiv').css("display", "block");
   } else {
		$('.backBtnDiv').css("display", "none");		 
   }
   
   request_url += "&offset=" + offset;
   request_url += "&countryBias=GB"; 	
   
   if(offset == 0){
	   [].slice.call(document.querySelectorAll(".result-list") || []).forEach(function (el) {
			el.scrollTop = 0;
	   });
   }
   
   let totalCount = Number($('#totalCount').val());
  // alert(request_url);
  console.log(request_url,"loaderUrlThis is");
  //alert(request_url);
  fetch(request_url, { method: "GET" })
    .then((res) => res.json())
    .then(function (data) { 
    
          
      if (data.meta.errors && data.meta.errors.length > 0) {
        // alert(data.meta.errors[0]["message"]);
      }
      
	  if(data.response.entities.length == 0){ 
		  // let second_data = getRequestSecond(useMylocation);
		  // data = second_data;		  
	  }
	  	  
                                     
   
      if(offset == 0){
		  locations = [];
	  }
      for (let i = 0; i < data.response.entities.length; i++) {
        const location = data.response.entities[i];

        // Add location distance if it exists
        if (data.response.distances) {
          location.__distance = data.response.distances[i];
        }
        locations.push(location);
      }
	  
	  
	  
	  if (data.response.distances &&  locations.length > 0) {
				
		if ( typeof(data.response.geo) !== "undefined" ){ 
			// console.log(data.response.geo.coordinate);
			// setCookie("user_latitude", data.response.geo.coordinate.latitude, 1);
			// setCookie("user_longitude", data.response.geo.coordinate.longitude, 1);	
		}		
		$('.nearest-store-locations').html('Nearest stores to: <strong>'+locationInput.value+'</strong>');
		// setCookie("user_latitude", data.response.geo.coordinate.latitude, 1);
		// setCookie("user_longitude", data.response.geo.coordinate.longitude, 1);
	  }else{
		$('.nearest-store-locations').html('');  
	  }
	  
      // Update Panel
      renderLocations(locations, offset?false:false, false);
      renderSearchDetail(
        data.response.geo,
        locations.length,
        data.response.count,
        queryString
      );
	
	  $('#totalCount').val(data.response.count);
	  
	  
	  let rowCount = offset + limit;
	  
	  // console.log([rowCount,data.response.count]);
	  // alert(rowCount);
	  
	  if (rowCount >= data.response.count) {
		$('.viewMoreBtnDiv').css("display", "none");
	  } else {
		$('.viewMoreBtnDiv').css("display", "block");		 
	  }
   
	  offset = offset + limit;
	  $('#offset').val(offset);
	  
	  if(isMobile){	
		$('#map').show();  
	  }
	  
	  // Update Map
      addMarkersToMap(locations);	

      if (locations.length == 0) { 
        centerOnGeo(data.response.geo);
      }
   
      [].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          el.textContent = "";
        });
      stopLoading();
	  

     $(".open-now-string").click(function () { 
        var closeThis = $(this);
        closeThis.parents('.lp-param-results').find(".storelocation-openCloseTime").slideToggle( function() {
          /* if($(this).is(':visible')){
          closeThis.html('-');
          }else{
          closeThis.html('+');
          } */
        });
        });
	  


  
    })
    .catch((err) => {
        // alert("There was an error");
        console.error(err);	   
        $(".viewMoreBtnDiv").hide();
	    $(".custom-pagination-links").html("");
	    $(".result-list-inner").html(`<div id="result-0" class="result !pl-4 text-center"><div class="center-column">Something went wrong. Re-try after some time.</div></div>`);
    });
}

async function getRequestSecond(useMylocation) { 
	
	let currentLatitude =  useMylocation[3].currentLatitude;
	let currentLongitude =  useMylocation[4].currentLongitude;	
	
	let request_url = base_url + "entities/geosearch";
	request_url += "?radius=2500";
	request_url += "&location=" + currentLatitude + ", " + currentLongitude;

	request_url += "&api_key=" + liveAPIKey;
	request_url += "&v=" + "20181201";
	request_url += "&resolvePlaceholders=true";

	if (entityTypes) {
	request_url += "&entityTypes=" + entityTypes;
	}

	if (savedFilterId) {
	request_url += "&savedFilterIds=" + savedFilterId;
	}

	let offset = Number($('#offset').val());

	request_url += "&offset=" + offset; 
	
	
	let response = [];
	await fetch(request_url, { method: "GET" })
    .then((res) => res.json())
    .then(function (data) {
		response = data;
		// console.log([response,'response']);	
		return response;		
	}).catch((err) => {
       return response;
    });
	return response;
}