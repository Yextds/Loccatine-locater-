import {
  defaultQuery,
  enableAutocomplete,
  loadLocationsOnLoad,
  locationInput,
  searchButton,
  useMyLocation,
  limit,
  isMobileStatus
} from "./locator/constants";
import { getLocations, getNearestLocationsByString, getUsersLocation, getDirectionUrl } from "./locator/locations";
import { getQueryParamsFromUrl, scrollToRow } from "./locator/utils";
import { isLoading } from "./locator/loader";
// @ts-ignore
import google from "google";

let address_parameters = [];

var isMobile = isMobileStatus(); //initiate as false
// device detection


searchButton.addEventListener("click", function () {

  if (locationInput.value !== '') {
    $('#offset').val(0);
    console.log(address_parameters);
    getNearestLocationsByString();
  }

}, { passive: true });


useMyLocation.addEventListener("click", function () {
  $('#offset').val(0);
  getUsersLocation();
});


document.getElementById("filterResetButton").addEventListener("click", function () {
  //locationInput.value = "";
  var numberOfChecked = $('.checkbox_departments:checkbox:checked').length;
  $('.checkbox_departments').each(function () {
    $(this).prop("checked", false);
  });
  $('.filterUl').remove();
  $(".closeButton").trigger("click");
  $(".department-error-text").html("");
  if (numberOfChecked != 0) {
    $('#offset').val(0);
    if (locationInput.value == '') {
      getLocations();
    } else {
      getNearestLocationsByString();
    }
  }
}, { passive: true });

document.getElementById("viewMoreBtn").addEventListener("click", function () {

  /* [].slice
    .call(document.querySelectorAll(".result-list") || [])
    .forEach(function (el) {
      el.scrollTop = $('#offset').val();
    }); */

  if (locationInput.value == '') {
    getLocations();
  } else {
    getNearestLocationsByString();
  }
}, { passive: true });

document.getElementById("backBtnDiv").addEventListener("click", function () {
  $("html, body").scrollTop(0);
  if (locationInput.value == '') {
    getLocations(true);
  } else {
    getNearestLocationsByString();
  }
}, { passive: true });

window.addEventListener("popstate", function (e) {
  if (e.state && e.state.queryString) {
    locationInput.value = e.state.queryString;
    getNearestLocationsByString();
  }
}, { passive: true });

window.addEventListener("load", function () {
  // $('#offset').val(0);	  
  const params = getQueryParamsFromUrl();
  const queryString = params["q"] || defaultQuery;
  locationInput.value = decodeURI(queryString);
  /* getNearestLocationsByString(); */
}, { passive: true });

locationInput.addEventListener("keydown", function (e) {

  // console.log(e.key);   || e.key=="x"

  if (locationInput.value.trim() != "" && (e.key == "Enter")) {
    $('#offset').val(0);
    getLocations();
  }
}, { passive: true });

/* 
locationInput.addEventListener("change", function (e) { 
  if( locationInput.value.trim() == "" ){
    $('#offset').val(0); 
    getNearestLocationsByString();
  }
  
}, {passive: true} );  
*/



let keyup_loading = false;
locationInput.addEventListener("keyup", function (e) {

  address_parameters = [];
  if (locationInput.value.trim() != "") {
    keyup_loading = true;
  }
  keyup_loading = true;
  if (locationInput.value.trim() == "" && (e.key === "Delete" || e.key === "Backspace" || e.key == "x") && keyup_loading) {
    $('#offset').val(0);
    // getNearestLocationsByString();
    getLocations();
    keyup_loading = false;
  }

});


locationInput.addEventListener("selected", function (e) {
  // alert(e.key);
  address_parameters = [];
  if (locationInput.value.trim() != "") {
    keyup_loading = true;
  }
  if (locationInput.value.trim() == "" && keyup_loading) {
    $('#offset').val(0);
    getLocations();
    keyup_loading = false;
  }

});


if (loadLocationsOnLoad) {
  if (isMobile) {
    document.getElementById("location-input").focus();
    $('#map').hide();
  } else {
    $('#offset').val(0);
    getLocations();
  }
}
// getDepartments();   

document.getElementById("storeFilterModalBtn").addEventListener("click", function () {
  document.getElementById('storeFilterModal').classList.remove("hidden");
  document.getElementById('body').classList.add("overflow-hidden");
  $(".department-error-text").html("");
}, { passive: true });

document.getElementById("closeButton").addEventListener("click", function () {
  document.getElementById('storeFilterModal').classList.add("hidden");
  document.getElementById('body').classList.remove("overflow-hidden");
  $(".department-error-text").html("");
}, { passive: true });



if (enableAutocomplete) {
  /* const autocomplete = new google.maps.places.Autocomplete(
     document.getElementById("location-input"),
     {
       options: {
         // types: ["(regions)","sublocality","postal_code","locality","neighborhood"],
         componentRestrictions: {'country': "uk"}
       },
     }
   );
   autocomplete.addListener("place_changed", () => {
   	
     if (!isLoading) {
         $('#offset').val(0);		
     var place = autocomplete.getPlace();				
     var address_components = place.address_components;
     if(locationInput.value !== ''){ 	
       getNearestLocationsByString(false, address_components);
       address_parameters = address_components;
     }
   	
     //console.log(address_parameters);		
     // let addressParametersString = JSON.stringify(address_parameters);
     // $('#user_address_parameters').val(addressParametersString);		
     }
   });
   */

  (function pacSelectFirst(input) {
    // store the original event binding function
    var _addEventListener = (input.addEventListener);

    function addEventListenerWrapper(type, listener) {

      if (type == "keydown") {
        var orig_listener = listener;
        listener = function (event) {
          var suggestion_selected = $(".pac-item-selected").length > 0;
          if ((event.which == 13 || event.which == 9) && !suggestion_selected) {
            var simulated_downarrow = $.Event("keydown", {
              keyCode: 40,
              which: 40
            });
            orig_listener.apply(input, [simulated_downarrow]);
          }

          orig_listener.apply(input, [event]);
        };
      }



      _addEventListener.apply(input, [type, listener]);
    }

    input.addEventListener = addEventListenerWrapper;


    var autocomplete = new google.maps.places.Autocomplete(input, {
      options: {
        //types: ["(regions)"],
        componentRestrictions: { 'country': "uk" }
      },
    });
    autocomplete.addListener("place_changed", () => {
      if (!isLoading) {
        $('#offset').val(0);
        var place = autocomplete.getPlace();
        var address_components = place.address_components;
        console.log(address_components);
        if (locationInput.value !== '') {
          getLocations(true)
          address_parameters = address_components;
        }
      }
    });

  })(locationInput);

  $('#location-input').blur(function (e) {
    selectFirstAddress(locationInput);
    locationInput.addEventListener("keydown", function (e) {
      if (locationInput.value.trim() != "" && e.key == "Enter") {
        $('#offset').val(0);
        getNearestLocationsByString();
      }
    });
  });

}

////Ensuring that only Google Maps adresses are inputted
function selectFirstAddress(input) {
  google.maps.event.trigger(input, 'keydown', { keyCode: 40 });
  google.maps.event.trigger(input, 'keydown', { keyCode: 13 });
}

document.addEventListener('touchstart', function () { }, { passive: true });

document.addEventListener('wheel', function () { }, { passive: true });


/* Closing the Fiter Window on out side click*/
jQuery("#storeFilterModal").on('click', function () {
  document.getElementById('storeFilterModal').classList.add("hidden");
  document.getElementById('body').classList.remove("overflow-hidden");
});
jQuery(".notClickable").click(function (e) {
  e.stopPropagation();
});


jQuery(document).on('click', '.direction-url', function (e) {
  var latitude = $(this).attr('data-latitude');
  var longitude = $(this).attr('data-longitude');
  getDirectionUrl(latitude, longitude);
});
// qurey suggestion starts here

let locationInp = locationInput;
let querySearch = document.getElementById("query-search");

//var matchList = document.getElementById('result');

var searchStates = async searchText => {
  var res = await fetch('https://liveapi-sandbox.yext.com/v2/accounts/me/entities?&sortBy=[{%22name%22:%22ASCENDING%22}]&filter={}&api_key=b262ae7768eec3bfa53bfca6d48e4000&v=20181201&resolvePlaceholders=true&entityTypes=location&savedFilterIds=1040219931&limit=50');

  var states = await res.json();
  const searchres = states.response.entities;

  let matches = searchres.filter(state => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    //const city=state.address.city;

    const res = state.name.match(regex);


    return res;

  });

  if (searchText.length === 0) {
    matches = [];

    querySearch.innerHTML = '';

  }

  outputHtml(matches);
}

const outputHtml = matches => {
  let html = '';
  if (matches.length > 0) {
    html += '<div class="px-3 py-2 max-h-[400px] overflow-x-hidden overflow-y-auto bg-[#f2f2f2] shadow-xl">';
    matches.map(match =>
      html += `<div  class="query inline-block w-full leading-6" id="${match.name}">
      <h6>${match.name}</h6>
      </div>
      `).join('');
    html += '</div>';
    querySearch.innerHTML = html;

  }
};

$(document).on('click', '.query', function () {
  let res = $(this).attr('id');
  $('#location-input').val(res);
  getLocations();
})

locationInp.addEventListener('input', () => searchStates(locationInp.value));


$('#query-search').click(function () {
  $("#query-search").empty();
});





if (enableAutocomplete) {
  alert("yes")
  const autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("location-input"),
    {
      options: {
        //types: ["(regions)"],
        componentRestrictions: { 'country': "us" }
      },
    }
  );
  autocomplete.addListener("place_changed", () => {
    if (!isLoading) {
      getLocations(true);

    }
  });
}