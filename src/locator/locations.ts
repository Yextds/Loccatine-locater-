import {
  formatMiOrKm,
  formatNumber,
  formatPhone,
  getValueFromPath,
  getQueryParamsFromUrl
} from "./utils";
import {
  parseTimeZoneUtcOffset,
  formatOpenNowString,
  formatTimeString  
} from "./time";
import { i18n } from "../i18n";
import {
  base_url,
  limit,
  locationInput,
  locationNoun,
  locationNounPlural,
  locationOption,
  locationOptions,
  radius,
  setCookie,
  getCookie,
  entityTypes,
  savedFilterId,
  liveAPIKey
} from "./constants";
import { getRequest, startLoading, stopLoading } from "./loader";
import RtfConverter from "@yext/rtf-converter";
import { highlightLocation, geoCorder } from "./map";

export let currentLatitude = 0;
export let currentLongitude = 0;

export function locationJSONtoHTML(entityProfile, index, locationOptions) {
  const getValue = (opt: locationOption) => {
    let val = opt.value;
    if (opt.contentSource === "FIELD") {
      val = getValueFromPath(entityProfile, opt.value);
    }
    return opt.isRtf && !!val ? RtfConverter.toHTML(val) : val;
  };

  const cardTitleValue = getValue(locationOptions.cardTitle);
  const getDirectionsLabelValue = getValue(locationOptions.getDirectionsLabel);
  const viewDetailsLinkTextValue = getValue(
    locationOptions.viewDetailsLinkText
  );
  let cardTitleLinkUrlValue = getValue(locationOptions.cardTitleLinkUrl);
  const hoursValue = getValue(locationOptions.hours);
  const c_departments = getValue(locationOptions.c_departments);
  const addressValue = getValue(locationOptions.address);
  const photoGallery = getValue(locationOptions.photo);
  const phonenumber = getValue(locationOptions.phonenumber);
 
  
  const cordinates = getValue(locationOptions.yextCoordinates);
  
  let viewDetailsLinkUrlValue = getValue(locationOptions.viewDetailsLinkUrl);

  let html =
    '<div class="lp-param-results lp-subparam-cardTitle lp-subparam-cardTitleLinkUrl  ">';
  if (cardTitleLinkUrlValue && cardTitleValue) {
    if (cardTitleLinkUrlValue["url"]) {
      cardTitleLinkUrlValue = cardTitleLinkUrlValue["url"];
    }
    /*html += `<div class="name hover:underline hover:font-semibold text-ll-red ">
      <a href="${cardTitleLinkUrlValue}">
        ${cardTitleValue} 
      </a>
    </div>`;*/
  } else if (cardTitleValue) {
   /* html += `<div class="name hover:underline hover:font-semibold text-ll-red ">
      ${cardTitleValue}
    </div>`;*/
  }
  html += "</div>";
  
  let count_index = index;	
  html += '<div class="store-bx ">';
  html += '<div class="store flex">';

//   photoGallery.forEach(function (e, i) {
//     let photoUrl = e.image.url;
//     html += '<div class="flex w-2/5 items-start flex-wrap"><img class="w-full rounded-md" alt="location" data-entity-type="file" data-entity-uuid="56d4b5b2-86a0-4e3a-95dc-e8b54d062d71" src=' + photoUrl + ' class="w-25" width="500" height="900" loading="lazy">';
//     //console.log(photoUrl);
//   })
  html += '</div>';
  html += '<div class=" test pl-4 w-3/5">';
  html += '<h4 class="storelocation-name"><a href="'+cardTitleLinkUrlValue+'">' + cardTitleValue + '</a></h4>';

	if (entityProfile.__distance) {
		html += `<div class="distance mt-2 "><strong>
		${formatMiOrKm(entityProfile.__distance.distanceMiles,entityProfile.__distance.distanceKilometers)}
		</strong></div>`;
	} 
	html += '<div class="address">';
	
	html += addressValue.line1 + ',' + addressValue.city + ', ' + addressValue.region + ', ' + addressValue.postalCode + ', ' + addressValue.countryCode+'<br/>';
	
	html += '</div>';

	html += '<div class=" border-t-[#ebebeb] mt-2 pt-4 border-t ">';
	html += '<div class="newsales  flex items-center">';
	// html += '<h3 class ="text-sm w-16 mr-1">Sales :</h3>';
	html += '<div class="sales phone-bx-loc">' + phonenumber + '</div>';	
	html += '</div>';

	html += '</div>';

	//end
	html += '</div>';
	html += '</div>';

	
  
	function tConvert(time) {

		time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	
		if (time.length > 1) {
		  time = time.slice(1);
		  // console.log(time)
	
		  time[5] = +time[0] < 12 ? 'AM' : 'PM';
		  time[0] = +time[0] % 12 || 12;
		}
		return time.join('');
	  }


	function convertDays(days) {
		const currentDate = new Date();
		const dayNumber = currentDate.getDay();
		const currentSelectedDay = days[dayNumber];
		const beforeSelected = days.slice(0,dayNumber);
		const afterSelected = days.slice(dayNumber,days.length);
		beforeSelected.forEach((element)=>{
		  afterSelected.push(element);
		});
		return {
		  afterSelected:afterSelected
		};
	  }
	 if (hoursValue) {
		const offset = getValueFromPath(entityProfile, "timeZoneUtcOffset");
		const parsedOffset = parseTimeZoneUtcOffset(offset);
		html += '<div class="lp-param-results lp-subparam-hours">';
	 html +=
		  '<div class="open-now-string pl-0 mt-2 text-sm" data-id="main-shop-'+index+'">'+
		   formatOpenNowString(hoursValue, parsedOffset) +
		  "</div>"; 
	 
	 html += '<div class="storelocation-openCloseTime pr-5 lg:pl-2 pb-4 text-[black] text-[12px] leading-tight capitalize" style="display:none;" >';                        
	 html += '<ul id="time-row-main-shop-'+index+'">';
	
	  let dayConvert = { "monday": "Monday", 
				 "tuesday":"Tuesday",
				 "wednesday":"Wednesday",
				 "thursday":"Thursday",
				 "friday":"Friday",
				 "saturday":"Saturday",
				 "sunday":"Sunday"
			   };
	
	const days_string = [
	   "sunday",
	   "monday",
	   "tuesday",
	   "wednesday",
	   "thursday",
	   "friday",
	   "saturday",
	];
	 
	 const convertedDays = convertDays(days_string);
	
	 let sort_array = [];
	 $.each(convertedDays.afterSelected, function (indexh, convertedDay) {
	   let daya = [ 
		 convertedDay,hoursValue[convertedDay]
	   ];
	
	   sort_array.push(daya);
	
	 });
	
	 console.log(sort_array);
	
	 $.each(sort_array, function (indexh, hour) {
	   // console.log(indexh);
	   
	   html+='<li class=" [&:nth-child(odd)]:bg-black [&:nth-child(odd)]:bg-opacity-5 [&:first-child]:bg-red [&:first-child]:bg-opacity-100 [&:first-child]:text-white px-2 py-1">' 
	   html += '<div><strong class="daydiv days_values font-bold w-24 inline-block" >';
	   html += dayConvert[hour[0].toString()]+' ';
	   html += '</strong>';
		 if(hour[1].openIntervals){
		//    $.each(hour[1].openIntervals, function (op, openInterval) {
		// 	 html += '<span class="pl-5" >'+openInterval.start+' to '+openInterval.end+'</span>';
		//    });
		
		$.each(hour[1].openIntervals, function (op, openInterval) {
			html += tConvert(openInterval.start) + " to " + tConvert(openInterval.end);
		  });
		 }else{
		   html += '<span class="pl-5" >Closed</span>';
		 }       
	   html += '</div>';
	   html+='</li>' 
	   
	 });
	 html += '</ul>';                        
	 // html += '</div>';
					   
		html += "</div>";
	  }
	 //hours code start 
	
//end here



   /* const localeString = "en-US";
  html += i18n.addressForCountry({
    locale: localeString,
    profile: { address: addressValue },
    regionAbbr: false,
    derivedData: { address: addressValue },
  });
  */



    //sales code start here

  //end here
  
  
	//letting code start here


  const singleLineAddress =
    entityProfile.name +
    " " +
    addressValue.line1 +
    " " +
    (addressValue.line2 ? addressValue.line2 + " " : "") +
    addressValue.city +
    " " +
    addressValue.region +
    " " +
    addressValue.postalCode;

  // html += `<div class="lp-param-results lp-subparam-getDirectionsLabel">
	// <div class="link">
	  // <a target="_blank"
		// href="https://www.google.com/maps/dir/?api=1&destination=${singleLineAddress}"
	  // >
		// ${getDirectionsLabelValue}
	  // </a>
	// </div>
  // </div>`;
  
  	
  html += '<div class="button-area">';

	html += '<div class="lp-param-results lp-subparam-getDirectionsLabel">';
	html += '<div class="link">';
	
	let user_latitude  =  getCookie('user_latitude');
	let user_longitude  =  getCookie('user_longitude');
  
	if(user_latitude && user_longitude){
		
		var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&destination='+cordinates.latitude+','+cordinates.longitude+'&origin='+user_latitude+','+user_longitude;
		html += '<a target="_blank" href="'+getDirectionUrl+'" >'+getDirectionsLabelValue+'</a>';
		
	}else{	
	
		var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&destination='+cordinates.latitude+','+cordinates.longitude;
		html += '<a class="direction-url cursor-pointer " data-latitude='+cordinates.latitude+'  data-longitude='+cordinates.longitude+'  >'+getDirectionsLabelValue+'</a>';
		
		/* var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&destination='+cordinates.latitude+' '+cordinates.longitude;
		html += '<a target="_blank" href="'+getDirectionUrl+'" >'+getDirectionsLabelValue+'</a>'; */
		
	}
	
	html += '</div>';
	html += '</div>';
  
	//brunch button start here
	html += '<div class="ml-4"><a class="subrton view-btn" href=' + cardTitleLinkUrlValue + '>Branch details' + '</a></div>';
	html += '</div>';
	 //end here
	/*
	html += '<div class="storelocation-categories inline-block w-full">';
	html += '<p class="uppercase flex justify-between items-center pt-[7px] pb-[5px] text-xs font-Futura font-normal border-t border-[#efeeeb]" >Departments available in store<a href="javascript:void(0);" class="inline-block icons_small right close text-[20px]">+</a></p>';
		if(c_departments.length > 0){
			html += '<ul class="storelocation-available-categories clear-both  flex flex-wrap"style="display:none;" >';	
				$.each(c_departments, function (cd,value) {															
					$('.department-list-item').each(function () {							 
						  if (value == $(this).data("id")) {
							html += '<li class="storelocation-category  float-left bg-[#e7e3dd] w-[30%] ml-[2%] uppercase text-[#878381] mb-[10px] pt-[8px] pb-[10px] text-[10px] text-center" >'+$(this).data("name")+'</li>'; 
						  }
					});															
					
				});
			html += '</ul>';
		}
	html += '</div>';
	*/
	
  html += '<div class="lp-param-results lp-subparam-availability">';
  html += "</div>";

  // if (viewDetailsLinkUrlValue && viewDetailsLinkTextValue) {
  //   // Url value is URL object and not url.
  //   if (viewDetailsLinkUrlValue["url"]) {
  //     viewDetailsLinkUrlValue = viewDetailsLinkUrlValue["url"];
  //   }
  //   html += `<div class="lp-param-results lp-subparam-viewDetailsLinkText lp-subparam-viewDetailsLinkUrl">
  //     <div class="lp-param lp-param-viewDetailsLabel link"><strong>
  //       <a href="${viewDetailsLinkUrlValue}">
  //         ${viewDetailsLinkTextValue}
  //       </a>
  //     </strong></div>
  //   </div>`;
  // }

  // Add center column
  html = `<div class="center-column">${html}</div>`;

	/* if (entityProfile.__distance) {
		html += `
    <div class="right-column"><div class="distance mt-4 "><strong>
      ${formatMiOrKm(
        entityProfile.__distance.distanceMiles,
        entityProfile.__distance.distanceKilometers
      )}</strong>
    </div></div>`;
		// console.log(entityProfile.__distance.distanceMiles);
	} */

  // Add left and right column
  /*if (entityProfile.__distance) {
    html = `<div class="left-column">
      ${index + 1}.
    </div>
    ${html}
    <div class="right-column"><div class="distance">
      ${formatMiOrKm(
        entityProfile.__distance.distanceMiles,
        entityProfile.__distance.distanceKilometers
      )}
    </div></div>`;
  }else{*/

//   hide by sanjay 
	//   let offset = Number($('#offset').val());	
	//   html = `<div class="left-column">
    //   ${offset + index + 1}.
    // </div>${html}`;
  /*}*/
  
 
  return `<div id="result-${index}" class="result" >${html}</div>`;
}

// Renders each location the the result-list-inner html
export function renderLocations(locations, append, viewMore) {
  if (!append) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML = "";
      });
  }

  // Done separately because the el.innerHTML call overwrites the original html.
  // Need to wait until all innerHTML is set before attaching listeners.
  if(Object.keys(locations).length > 0){
  locations.forEach((location, index) => {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML += locationJSONtoHTML(location, index, locationOptions);
      });
  });

  locations.forEach((_, index) => {
    document
      .getElementById("result-" + index)
      .addEventListener("mouseover", () => {
        highlightLocation(index, false, false);
      }, {passive: true});
    document.getElementById("result-" + index).addEventListener("click", () => {
      highlightLocation(index, false, true);
    }, {passive: true});
  });

   /* if (viewMore) {
    [].slice
      .call(document.querySelectorAll(".result-list-inner") || [])
      .forEach(function (el) {
        el.innerHTML +=
          '<button id="viewMoreBtn" class="button button--small button--secondary mx-auto"> View More </button>';
      }); 
  }*/ 
  
  }else{
    $(".result-list-inner").html(`<div id="result-0" class="result !pl-4"><div class="text-center"><b>Oops</b>...
  There are no results that match your search.</div></div>`);
  }
}

function searchDetailMessageForCityAndRegion(total) {
  if (total === 0) {
    return '0 [locationType] found near <strong>"[city], [region]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[city], [region]"</strong>';
  }
}

function searchDetailMessageForArea(total) {
  if (total == 0) {
    return '0 [locationType] found near <strong>"[location]"</strong>';
  } else {
    return '[formattedVisible] of [formattedTotal] [locationType] near <strong>"[location]"</strong>';
  }
}

function searchDetailMessageNoGeo(total) {
  if (total === 0) {
    return "0 [locationType]";
  } else {
	  
    return "[formattedVisible] of [formattedTotal] [locationType]";
  }
}

// Renders details of the search
export function renderSearchDetail(geo, visible, total, queryString) {
  // x of y locations near "New York, NY"
  // x  locations near "New York, NY"
  // x  locations near "New York, NY"

  let locationType = locationNoun;
  if (total === 0 || total > 1) {
    locationType = locationNounPlural;
  }

  let formattedVisible = formatNumber(visible);
  
  let offset = $('#offset').val();  
  let start = Number(offset) + 1; 
  let to_total = Number(offset) + Number(visible);  
  formattedVisible = formatNumber(start)+' to '+formatNumber(to_total);
  
  let formattedTotal = formatNumber(total);

  let searchDetailMessage;
  if (geo) {
    if (geo.address.city !== "") {
      searchDetailMessage = searchDetailMessageForCityAndRegion(total);
      searchDetailMessage = searchDetailMessage.replace(
        "[city]",
        geo.address.city
      );
      searchDetailMessage = searchDetailMessage.replace(
        "[region]",
        geo.address.region
      );
    } else {
      let location = "";
      if (geo.address.region) {
        location = geo.address.region;
      } else if (geo.address.country && queryString) {
        location = queryString;
      } else if (geo.address.country) {
        location = geo.address.country;
      }
      if (location !== "") {
        searchDetailMessage = searchDetailMessageForArea(total);
        searchDetailMessage = searchDetailMessage.replace(
          "[location]",
          location
        );
      }
    }
  } else {
    searchDetailMessage = searchDetailMessageNoGeo(total);
  }
  searchDetailMessage = searchDetailMessage.replace(
    "[locationType]",
    locationType
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedVisible]",
    formattedVisible
  );
  searchDetailMessage = searchDetailMessage.replace(
    "[formattedTotal]",
    formattedTotal
  );
  
  // searchDetailMessage = formattedVisible+' results';

  [].slice
  .call(document.querySelectorAll(".search-center") || [])
  .forEach(function (el) {
    el.innerHTML = "";
   });
  [].slice
    .call(document.querySelectorAll(".search-center") || [])
    .forEach(function (el) {
      el.innerHTML = searchDetailMessage;
    });
}

export function getNearestLocationsByString(back = false, address_components=[]) {
	let queryString = locationInput.value;
	
	if(queryString.includes('uk') || queryString.includes('UK')){
	  queryString = queryString;
	}else{
	  queryString = queryString+', UK';
	}
	
	/*
	let location_string = getLocationsCount(queryString);	
	// console.log(location_string,'location_string');
	if(!location_string){
		var request_url = base_url + "entities?";
	}else{*/
		var request_url = base_url + "entities/geosearch";
		request_url += "?radius=" + radius;
		request_url += "&location="+queryString;					
	/* } */ 
	
	// request_url += '&sortBy=[{"geomodifier":"ASCENDING"}]';
	
	// console.log(request_url);
	// console.log(queryString);
    // if (queryString.trim() !== "") {
	  
		let filterParameters = {};
		let filterAnd = {};
		let filterOr = {};
		let filter = '';
		
		
		if(address_components.length > 0){
			
			let addressParameters = [];
			
			let addressLine = '';
			
			for (let i = 0; i < address_components.length; i++) {
				let type =  address_components[i].types[0];
				switch(type){
					case 'street_number':{
						if(addressLine){
							addressLine += " " + address_components[i].long_name;
						}else{
							addressLine = address_components[i].long_name;
						}
						break;
					}
					case 'route':{
						if(addressLine){
							addressLine += " " + address_components[i].long_name;
						}else{
							addressLine = address_components[i].long_name;
						}
						break;
					}
					case 'postal_town': {
						addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
						break;
					}
					case 'locality':
					case 'administrative_area_level_2':
					{
						addressParameters.push( {"address.city": {"$eq": address_components[i].long_name}});
						break;
					}
					/* case 'administrative_area_level_1':
					{
						addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
						break;
					} 
					case 'country':{
						addressParameters.push( {"address.countryCode": {"$eq": address_components[i].short_name}});
						break; 
					}*/  
					case 'postal_code':{
						addressParameters.push( {"address.postalCode": {"$eq": address_components[i].short_name}});
						break;
					}
					default:{}
				}
				if(address_components.length == i+1){
					// if(addressLine){addressParameters.push( {"address.line1": {"$contains": addressLine}});}
					// console.log(addressParameters);   
				}
				
			}
			
			// console.log(addressParameters);	
			// addressParameters.push({"geomodifier": {"$eq": queryString}});					
			// filterOr = { "$or": addressParameters}; 	
			
		}else{
			
			let query_str_array = [];
			if(queryString.includes(',')){
				query_str_array = queryString.split(",");
			}else{
				query_str_array = [queryString];
			}
			
			/*filterOr = {"$or": [
				  {"address.line1": {"$in": query_str_array}},
				  {"address.city": {"$in": query_str_array}},
				  {"address.region": {"$in": query_str_array}},
				  // {"address.countryCode": {"$eq": 'GB'}},
				  {"address.postalCode": {"$in": query_str_array}}	
				  // {"geomodifier": {"$eq": queryString}}
				]
			};*/
			
			filterOr = {"$and": [
						  // {"address.line1": {"$eq": queryString}},
						  // {"address.city": {"$eq": queryString}},
						  // {"address.region": {"$eq": queryString}},
						  {"address.countryCode": {"$eq": 'GB'}},
						  // {"address.postalCode": {"$eq": queryString}}
						  //{"geomodifier": {"$eq": queryString}}
						]
			};
			
		}
		
		var ce_departments = [];
		$('.checkbox_departments').each(function () {							 
			  if ($(this).is(":checked")) {
					let depValue = $(this).val().toString();  
					ce_departments.push(depValue.replace('&', '%26'));
			  }
		});
		
		if(ce_departments.length > 0){
			
			filterAnd = {"$and":[{"c_pageServices":{"$in": ce_departments}}]};			
			filterParameters = {...filterOr,...filterAnd};  
				
			filter = JSON.stringify(filterParameters);
			//filter = encodeURI(filter);
			
		}else{
									
			filterParameters = {...filterOr};				
			filter = JSON.stringify(filterParameters);
			//filter = encodeURI(filter);
			
		}
		
		if(filter){
			// filter = filter.replaceAll('&', '%26'); 
			request_url += "&filter=" + filter;
		}
	
    // Uncommon below to limit the number of results to display from the API request
    request_url += "&limit=" + limit;
    getRequest(request_url, queryString, back);
  // }
  /* var url = window.location.href;  
  var myStorage = window.sessionStorage;
  sessionStorage.setItem('query', url); */
}

// Get locations by lat lng (automatically fired if the user grants acceess)
function getNearestLatLng(position) {
  [].slice
    .call(document.querySelectorAll(".error-text") || [])
    .forEach(function (el) {
      el.textContent = "";
    });
  $('#offset').val(0);
  	
  currentLatitude = position.coords.latitude;
  currentLongitude = position.coords.longitude;
  
  setCookie("user_latitude", currentLatitude, 1);
  setCookie("user_longitude", currentLongitude, 1);
  
  // currentLatitude = 55.793322353104514;
  // currentLongitude = -4.86691523697671; 
  
  geoCorder.geocode({ location: {lat: currentLatitude,lng: currentLongitude}})
	.then((response) => {
	  if (response.results[0]) {
		locationInput.value = response.results[0].formatted_address;
				
		let address_components = response.results[0].address_components;
		let addressParameters = [];
		let param = {};
		let addressLine = '';
		let filter = '';
		
		// console.log(address_components);
		
		for (let i = 0; i < address_components.length; i++) {
			let type =  address_components[i].types[0];
			switch(type){
				case 'street_number':{
					if(addressLine){
						addressLine += " " + address_components[i].long_name;
					}else{
						addressLine = address_components[i].long_name;
					}
					break;
				}
				case 'route':{
					if(addressLine){
						addressLine += " " + address_components[i].long_name;
					}else{
						addressLine = address_components[i].long_name;
					}
					break;
				}
				case 'postal_town': {
					addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
					break;
				}
				case 'locality':
				case 'administrative_area_level_2':
				{
					addressParameters.push( {"address.city": {"$eq": address_components[i].long_name}});
					break;
				}
				case 'administrative_area_level_1':
				{
					addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
					break;
				}
				case 'country':{
					addressParameters.push( {"address.countryCode": {"$eq": address_components[i].short_name}});
					break;
				}
				case 'postal_code':{
					addressParameters.push( {"address.postalCode": {"$eq": address_components[i].short_name}});
					break;
				}
				default:{}
			}
			if(address_components.length == i+1){
				// if(addressLine){addressParameters.push( {"address.line1": {"$contains": addressLine}});}
				// console.log(addressParameters);
			}
		} 
			
		
		let addressParametersString = JSON.stringify(address_components);		
		console.log([addressParametersString , 'addressParametersString']);		
		$('#user_address_parameters').val(addressParametersString); 
		
		let request_url = base_url + "entities/geosearch";
			request_url += "?radius=" + radius;
			request_url +=
			"&location=" + currentLatitude + ", " + currentLongitude;
			
			let filterParameters = {};
				let filterAnd = {};
				let filterOr = {};
				
				const queryString = locationInput.value;
				 
				if (queryString) {					
					// addressParameters.push({"geomodifier": {"$eq": queryString}});					
					filterOr = { "$or": addressParameters}; 
				}
				
				// var ce_departments = [];
				// $('.checkbox_departments').each(function () {							 
				// 	  if ($(this).is(":checked")) {
				// 			let depValue = $(this).val().toString();  
				// 			ce_departments.push(depValue.replace('&', '%26'));	
				// 	  }
				// });
				
				// if(ce_departments.length > 0){
					 	
				// 	filterAnd = {"$and":[{"c_pageServices":{"$in": ce_departments}}]};
						
				// }


				var brunch = [];
				$('.checkbox_brunches').each(function () {
				  if ($(this).is(":checked")) {
					brunch.push($(this).val());
				  }
				});
			  
				if (brunch.length > 0) {
				  filterAnd = {
					"$and":
					  [
						{
						  "c_relatedCategory": { "$in": brunch }
						}
					  ],
				  };
				}
				
				filterParameters = {...filterOr,...filterAnd};
				filter = JSON.stringify(filterParameters);
				filter = encodeURI(filter);
				
				if(filter){
					// filter = filter.replaceAll('&', '%26');
					request_url += "&filter=" + filter;
				}
			
				request_url += "&limit=" + limit;
				getRequest(request_url, null);
	  } 
	})
	.catch((e) => {});
}



// Gets a list of locations. Only renders if it's a complete list. This avoids a dumb looking map for accounts with a ton of locations.

export function getLocations(back = false) { 
  let request_url =
    base_url +
    "entities" +
    "?limit=" +
     limit +
	'&sortBy=[{"name":"ASCENDING"}]';

	// var dd=$(".checkbox_filter").val()
	// alert(dd);
		let filterParameters = {};
		let filterAnd = {};
		let filterOr = {};
		let filterAnds={};
	
		
		let queryString = locationInput.value;
		if (queryString) {
			
			filterOr = {"$or": [
				  {"address.line1": {"$eq": queryString}},
				  {"address.city": {"$eq": queryString}},
				  {"address.region": {"$eq": queryString}},
				  {"address.countryCode": {"$eq": queryString}},
				  {"address.postalCode": {"$eq": queryString}},
				  {"name": {"$eq": queryString}}
				
				]
			}; 
			
		}
		let servicefilterdata=[];
		 
		$('.services_filter').each(function (){
			if ($(this).is(":checked")) {
			servicefilterdata.push($(this).val());
			}
		 });
		 
		let filters= [];
		
		$('.checkbox_filter').each(function () {
		  if ($(this).is(":checked")) {
			filters.push($(this).val());
			
	      }
	    });
        
		  
		
		// if (filters.length > 0 && servicsfilter.length > 0) {
		//   filterAnd = {
		// 	"$and":
		// 	  [
		// 		{
		// 		  "c_locationloccalizefilter": { "$in": filters}
				  
		// 		},
		// 		{
        //        "c_service_loccitane": { "$in": servicsfilter}
        //         }
		// 	  ],
		//   };
		// }
	  
		if (filters.length > 0) {
			filterAnd = {
			  "$and": [
				{
				  "c_locationloccalizefilter": { "$in": filters},
	
				},
			  ]
			};
	      }
	
		  if (servicefilterdata.length > 0) {
			filterAnd= {
			  "$and": [
				{
				  "c_service_loccitane": { "$in": servicefilterdata},
	            },
			  ]
			};
	
		  }
		  
		filterParameters = {...filterOr,...filterAnd};
		var filterpar = JSON.stringify(filterParameters);
		
	    var	 filter = encodeURI(filterpar);

		if(filter){
				request_url += "&filter=" + filter;	
		}	
		
    getRequest(request_url, null, back);
}
// getLocations();

function ucwords(title){
    let str = title.toLowerCase();
    str = str.replace(/-/g,' ');
    str = str.replace(/_/g,' ');
    return str.replace(/(^([a-zA-Z\p{M}]))|([ -_][a-zA-Z\p{M}])/g,function (s){return s.toUpperCase();});
};

export function getcountrydata(selected:any,address_components=[]) { 

	let queryString = selected;

		var request_url = base_url + "entities/geosearch";
		request_url += "?radius=" + radius;
		request_url += "&location="+queryString;					
	  
		let filterParameters = {};
		let filterAnd = {};
		let filterOr = {};
	
		
		
		if(address_components.length > 0){
			
			let addressParameters = [];
			
			let addressLine = '';
			
			for (let i = 0; i < address_components.length; i++) {
				let type =  address_components[i].types[0];
				switch(type){
					case 'street_number':{
						if(addressLine){
							addressLine += " " + address_components[i].long_name;
						}else{
							addressLine = address_components[i].long_name;
						}
						break;
					}
					case 'route':{
						if(addressLine){
							addressLine += " " + address_components[i].long_name;
						}else{
							addressLine = address_components[i].long_name;
						}
						break;
					}
					case 'postal_town': {
						addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
						break;
					}
					case 'locality':
					case 'administrative_area_level_2':
					{
						addressParameters.push( {"address.city": {"$eq": address_components[i].long_name}});
						break;
					}
					/* case 'administrative_area_level_1':
					{
						addressParameters.push( {"address.region": {"$eq": address_components[i].long_name}});
						break;
					} 
					case 'country':{
						addressParameters.push( {"address.countryCode": {"$eq": address_components[i].short_name}});
						break; 
					}*/  
					case 'postal_code':{
						addressParameters.push( {"address.postalCode": {"$eq": address_components[i].short_name}});
						break;
					}
					default:{}
				}
				if(address_components.length == i+1){
					// if(addressLine){addressParameters.push( {"address.line1": {"$contains": addressLine}});}
					// console.log(addressParameters);   
				}
				
			}
			
			// console.log(addressParameters);	
			// addressParameters.push({"geomodifier": {"$eq": queryString}});					
			// filterOr = { "$or": addressParameters}; 	
			
		}else{
			
			let query_str_array = [];
			if(queryString.includes(',')){
				query_str_array = queryString.split(",");
			}else{
				query_str_array = [queryString];
			}
			
			/*filterOr = {"$or": [
				  {"address.line1": {"$in": query_str_array}},
				  {"address.city": {"$in": query_str_array}},
				  {"address.region": {"$in": query_str_array}},
				  // {"address.countryCode": {"$eq": 'GB'}},
				  {"address.postalCode": {"$in": query_str_array}}	
				  // {"geomodifier": {"$eq": queryString}}
				]
			};*/
			
			filterOr = {"$and": [
						  {"address.line1": {"$eq": queryString}},
						   {"address.city": {"$eq": queryString}},
						   {"address.region": {"$eq":queryString}},
						  {"address.countryCode": {"$eq": queryString}},
						//    {"address.postalCode": {"$eq": queryString}}
						  //{"geomodifier": {"$eq": queryString}}
						]
			};
			
		}
    request_url += "&limit=" + limit;
	filterParameters = {...filterOr};
	var filterpar = JSON.stringify(filterParameters);
	var	 filter = encodeURI(filterpar);
	if(filter){
		request_url += "&filter=" + filter;
		}
    getRequest(request_url, queryString);
  }
// getcountrydata("")

// export function getDepartments() {
// 	var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
// 	var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
// 	var vparam = "20161012";
// 	var entityTypes = "location";
// 	var savedFilterId = "1040219931";
// 	 var fullURL =
// 	  baseURL +
// 	  "api_key=" +
// 	  api_key +
// 	  "&v=" +
// 	  vparam +
// 	  "&resolvePlaceholders=true" +
// 	  "&entityTypes=" +
// 	  entityTypes +
// 	  "&savedFilterIds=" +
// 	  savedFilterId +
// 	  "&fields=address" + 
// 	  "&limit=50";
// 	  //alert(fullURL)
// 	  fetch(fullURL).then(response => response.json()).then(result => {
  
// 	  console.log('result',result.response.entities);
  
// 	  if (!result.errors) {
  
// 		var url_string = window.location.href;
// 		var url = new URL(url_string);
// 		var country = url.searchParams.get("Country");
// 		var html = '';
// 		html += '<div class=" department-list flex justify-center">';
// 		html += '  <div class="select-box w-full md:w-auto">';
// 		html += `<select id="mySelect" class="checkbox_departments appearance-none w-full bg-white py-2 px-3 border-8 border-white text-sm focus:outline-none" aria-label="Default select example">`
// 		let somecountry = '';
// 		if (url_string.includes('Country')) {
// 		  //html += '<option value="" disabled selected>Country'
// 		  somecountry = '<option selected>' + country + '</option>';
// 		}
// 		else {
// 		//   if(ourURL ==="/index.html"){
// 		  html += '<option value=""disabled selected>Country'
// 		//   }
// 		//   else if(ourURL ==="/en-dedup"){
// 		// 	html += '<option value=""disabled selected>Country'
// 		// 	}
  
// 		//  else if(ourURL ==="/fr-dedup"){
// 		// 	html += '<option value=""disabled selected>Pays'
// 		// 	}
// 		//    else if(ourURL ==="/ja-dedup"){
// 		// 	  html += '<option value=""disabled selected>国'
// 		// 	  }
	
// 		//   const regionNames = new Intl.DisplayNames(
// 		// 	 	['en'], {type: 'region'}
// 		// 	   );
  
// 		  var newData = [];
// 		  for (let index = 0; index < result.response.entities.length; index++) {
// 			  const countryCode = result.response.entities[index]['address']['countryCode'];
// 			  if(!newData.includes(countryCode)){ 
// 				newData.push(countryCode);
// 				html += '<option id="options" value="' + countryCode+ '">' +countryCode + '</option>';
// 	           }
// 		  }  
// 		}
// 		html += somecountry;
// 		html += '</select>';
// 		html += '</div>';
// 		html += '</div>';
// 		$(".filtering").html(html);
  
// 		$(".checkbox_departments").change(function () {
// 		  var element = document.getElementById("mySelect") as HTMLSelectElement;
// 		  var x = element !== null ? element.selectedIndex : '';
// 		  let selectcity = document.getElementsByTagName("option")[x].value;
// 		  alert(selectcity)
// 		 getcountrydata(selectcity);
	
// 		});
// 	  } else {
  
// 	  }
  
// 	});
//   }
//   getDepartments();



  export function filter() {
	var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
	var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
	var vparam = "20161012";
	var entityTypes = "ce_loccitanefilters";
	var savedFilterId = "1041051377";
	var fullURL =
	  baseURL +
	  "api_key=" +
	  api_key +
	  "&v=" +
	  vparam +
	  "&entityTypes=" +
	  entityTypes+
	  "&savedFilterIds=" +
	  savedFilterId ;
  
	[].slice
	  .call(document.querySelectorAll(".location-data") || [])
	  .forEach(function (el) {
		el.innerHTML = '<div class="col">Loading...</div>';
	  });
  
	fetch(fullURL).then(response => response.json()).then(result => {
  
	  if (!result.errors) {
		if (result.response.count > 0) {
  
		  var html = '';
		  $.each(result.response.entities, function (index, entity) {
  
			html += '<li class="department-list-item w-1/2 sm:w-1/3 md:w-1/4 mb-4" data-name="' + entity.name + '" data-id="' + entity.meta.id + '" >';
			html += '<div class="form-check relative"><input class="checkbox_filter absolute  " type="checkbox" name="c_departments[]" value="' + entity.name + '" id="' + entity.name + '">';
			html += '<label class="relative pl-7 text-sm font-Futura font-light cursor-pointer" for="' + entity.name + '"> ' + entity.name + '</label>';
			html += '</li>';
		  });
  
		  $(".loccatile-filter").html(html);
  
		  $(".checkbox_filter").change(function () {
			$('#offset').val(0);
			getLocations(false)
		  });
  
		} else {
  
		}
  
	  } else {
  
	  }
  
	});
  }
  filter();



//   export function servicesfilter() {
// 	var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
// 	var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
// 	var vparam = "20161012";
// 	var entityTypes = "ce_loccitanefilters";
// 	var savedFilterId = "1041056776";
// 	var fullURL =
// 	  baseURL +
// 	  "api_key=" +
// 	  api_key +
// 	  "&v=" +
// 	  vparam +
// 	  "&entityTypes=" +
// 	  entityTypes+
// 	  "&savedFilterIds=" +
// 	  savedFilterId ;
  
// 	[].slice
// 	  .call(document.querySelectorAll(".location-data") || [])
// 	  .forEach(function (el) {
// 		el.innerHTML = '<div class="col">Loading...</div>';
// 	  });
  
// 	fetch(fullURL).then(response => response.json()).then(result => {
  
// 	  if (!result.errors) {
// 		if (result.response.count > 0) {
  
// 		  var html = '';
// 		  $.each(result.response.entities, function (index, entity) {
  
// 			html += '<li class="department-list-item w-1/2 sm:w-1/3 md:w-1/4 mb-4" data-name="' + entity.name + '" data-id="' + entity.meta.id + '" >';
// 			html += '<div class="form-check relative"><input class="services_filter absolute" type="checkbox" name="c_service_loccitane[]"  value="' + entity.name + '" id="' + entity.name + '">';
// 			html += '<label class="relative pl-7 text-sm font-Futura font-light cursor-pointer" for="' + entity.name + '"> ' + entity.name + '</label>';
// 			html += '</li>';
// 		  });
  
// 		  $("#servicefilter").html(html);
  
// 		  $(".services_filter").change(function () {
// 			$('#offset').val(0);
// 			getLocations(false)
// 		  });
  
// 		} else {
  
// 		}
  
// 	  } else {
  
// 	  }
  
// 	});
//   }
//   servicesfilter();
  

  



//   document.getElementById("options").addEventListener("click", function () {
// 	alert("hhh");
//   })
//   $(document).on("change","#mySelect",function(){
// 	 console.log($(this).attr("value"));
// });

// function countryss(){
// // console.log(e)
// // alert(e);
// alert($(this).val());
// }



// //   $('#mySelect').on('change', function() {
// 	$("#mySelect").click(function(){
// 	// $("#selected-value").text($(this).find(":selected").val());
// 	// $("#selected-text").text($(this).find(":selected").text());
// 	// var d=$("#options").val()
// 	// console.log(d);
// 	alert("hhhh")
// })
//   });

// export function getbrunch() {
// 	var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities?";
// 	var api_key = "b262ae7768eec3bfa53bfca6d48e4000";
// 	var vparam = "20181017";
// 	var entityTypes = "ce_abbotsBrunchPage";
// 	"?limit=" +
// 	  limit 
// 	var fullURL =
// 	  baseURL +
// 	  "api_key=" +
// 	  api_key +
// 	  "&v=" +
// 	  vparam +
// 	  "&entityTypes=" +
// 	  entityTypes;
// 	// console.log(fullURL)
//   // alert(fullURL);
// 	fetch(fullURL).then(response => response.json()).then(result => {
  
// 	  if (!result.errors) {
// 		if (result.response.count > 0) {
  
// 		  var html = '';
// 		  $.each(result.response.entities, function (index, entity) {
// 			//html += '<div> <input class="checkbox-mobileservice" type="checkbox" name="c_relatedCategory[]" value="' + entity.meta.id + '" id="' + entity.name + '"> <label> ' + entity.name + '</label> </div>';
// 			//  html += '<div id="' + entity.name + '">';
// 			// html += '<button class="menubarbutton bg-black w-36 hover:bg-gray-500 mx-auto rounded-2xl text-md text-white p-3" name="c_relatedCategory" id="' + entity.meta.id + '">' + entity.name + '</button>';
// 			//html += '</div>';
// 			// html += '<li class="mobile-list-item w-1/2 sm:w-1/3 md:w-1/4 mb-4" data-name="' + entity.name + '" data-id="' + entity.meta.id + '" >';
// 		   // html += '<li class=" ml-12 country-list-item form-check form-check-inline w-1/2 sm:w-1/4 md:w-1/4 mb-4" data-name="' + entity.name + '" data-id="' + entity.meta.id + '" >';
// 			html += '<div class="form-check"><input class="checkbox_brunches" type="checkbox" name="c_relatedCategory[]" value="' + entity.meta.id + '" id="' + entity.name + '">';
// 			html += '<label class="relative pl-2 leading-4 text-lg font-Futura font-light cursor-pointer" for="' + entity.name + '"> ' + entity.name + '</label></div>';
// 		   // html += '</li>';
		   
// 			// html += '<div class="form-check relative"><input class="checkbox-brunches absolute  " type="checkbox" name="c_relatedCategory[]" value="' + entity.meta.id + '" id="' + entity.name + '"></div>';
// 			// html += '<label class="relative pl-7 text-sm font-Futura font-light cursor-pointer" for="' + entity.name + '"> ' + entity.name + '</label>';
// 			// html += '</li>';
// 		  });
  
// 		  $(".branches").html(html);
  
// 		  $(".checkbox_brunches").change(function () {
// 			$('#offset').val(0);
// 			getLocations(false)
// 		  });
  
// 		} else {
  
// 		}
  
// 	  } else {
  
// 	  }
  
// 	});
//   }
//   getbrunch();




// export function getDepartments() { 
			
// 		var baseURL = "https://liveapi-sandbox.yext.com/v2/accounts/me/entities/departments?"; 		
// 		var api_key = "b88ccaa3c4599fcdcec98d95b6adab70";	
// 		var vparam = "20161012";   
		
// 		var fullURL =
// 			baseURL +
// 			"api_key=" +
// 			api_key +
// 			"&v=" +
// 			vparam+ 			
// 			"&entityTypes=departments&fields=c_pageServices";
			
// 			fetch(fullURL,{mode:"cors"}).then(response => response.json()).then(result => {			
// 				if (!result.errors) {
												
							
// 							if (result.meta.errors.length ==  0) {
// 								var html = ''; 
																
// 								let departmentOptions = result.response.c_pageServices;
								
// 								for (let i = 0; i < departmentOptions.length; i++) {
									
// 									let department_label = departmentOptions[i];
									
// 									department_label = department_label.replaceAll("_", " ");
// 									department_label = ucwords(department_label);
									
// 									html += '<li class="department-list-item pr-1" data-name="' + department_label + '" data-id="' + departmentOptions[i] + '" >';
// 									html += '<input class="checkbox_departments" type="checkbox" name="c_departments[]" value="'+departmentOptions[i]+'" id="' + departmentOptions[i] + '">';
// 									html += '<label class="inline-block w-full" for="' + departmentOptions[i] + '"> ' + department_label + '</label>';
// 									html += '</li>';
// 								}
								
// 								$(".department-list").html(html);
								
// 								$('.checkbox_departments').change(function () {
// 									$(".department-error-text").html('');
// 								});
								
// 								// $("#filterApplyButton").click(function() {
// 								// 	var numberOfChecked = $('.checkbox_departments:checkbox:checked').length;	
// 								// 	// alert(numberOfChecked);
// 								// 	if(numberOfChecked == 0){
// 								// 		$(".department-error-text").html('At least one checkbox is required');
// 								// 		return false;
// 								// 	}
// 								// 	applySelectedFilter(); 									 
// 								// });
								
// 							} else {

// 							}

// 						} else {

// 						}

// 			});
// }


		
// function showSelectedFilter() {
// 	var ce_departments = [];
// 	$('.checkbox_departments').each(function () {							 
// 		  if ($(this).is(":checked")) {
// 			ce_departments.push($(this).val());
// 		  }
// 	});
	
// 	let selectedFilterHtml = '';
// 	if(ce_departments){
// 		selectedFilterHtml += '<ul class="filterUl flex flex-wrap" >';
// 		$.each(ce_departments, function (d, ce_department) {						
// 			selectedFilterHtml += '<li class="selectedFilter"><a class="selectedFilterLink" data-value="'+ce_department+'" href="javascript:void(0);" >'+ucwords(ce_department)+'</a></li>';
// 		});
// 		selectedFilterHtml += '<li class="clearAll"><a class="selectedFilterClearAllLink cursor-pointer" >Clear All</a></li>';
// 		selectedFilterHtml += '</ul>';
// 	}
	
// 	$('.selectedFilterDiv').html(selectedFilterHtml);
	
// 	$(".selectedFilterLink").click(function() {  
// 		 let selectedFilterLink = $(this); 
// 		 // alert(selectedFilterLink.data("value"));
// 		 let de = 0;
// 		 $('.checkbox_departments').each(function() {  	        
// 			if($(this).val() == selectedFilterLink.data("value")){
// 				$(this).prop("checked", false);								 
// 			}		 
// 		 });
// 		 var numberOfChecked = $('.checkbox_departments:checkbox:checked').length;
		 
// 		 if(numberOfChecked == 0){
// 			 $('.filterUl').remove();
// 		 }else{	
// 			selectedFilterLink.parent('.selectedFilterli').remove();
// 		 }	
// 		applySelectedFilter();
// 	});
	
// 	$(".selectedFilterClearAllLink").click(function() { 	 
// 		let selectedFilterClearAllLink = $(this);
// 		clearAllFilter(selectedFilterClearAllLink);		
// 	});
	
// }

// function clearAllFilter($this) {
// 	$('.checkbox_departments').each(function() {          
// 		$(this).prop("checked", false);
// 	});
// 	$('.filterUl').remove();
	
// 	$('#offset').val(0);
// 	if(locationInput.value == ''){
// 		getLocations();
// 	}else{
// 		getNearestLocationsByString();
// 	}	
// }

// function applySelectedFilter() { 
	
// 	$('#offset').val(0);
// 	if(locationInput.value == ''){
// 		getLocations();
// 	}else{
// 		getNearestLocationsByString();
// 	}			
// 	showSelectedFilter();	
// 	$( ".closeButton" ).trigger("click"); 
// 	// document.getElementById('storeFilterModal').classList.remove("hidden");
// 	/*	
// 	let storeFilterModal = new Modal(document.getElementById('storeFilterModal'),{});	
// 	storeFilterModal.hide();
// 	console.log(storeFilterModal);
// 	*/
	
// }




export function getUsersLocation() {
  if (navigator.geolocation) { 
    // startLoading();
    const error = (error) => {
	
	[].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          el.textContent = "";
        });
	
	setCookie("user_latitude", "", 1);
    setCookie("user_longitude", "", 1);
	// setCookie("user_share_location", "", 1);
	// $('#offset').val(0);	
	// getLocations();
	if(error.code == 1){
		[].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
          // el.textContent = error.message;
		  locationInput.value = '';
		  el.textContent = "Unable to determine your location. Please try entering a location in the search bar.";		  
        });	
				
	}else{
		[].slice
        .call(document.querySelectorAll(".error-text") || [])
        .forEach(function (el) {
		  locationInput.value = '';	
          el.textContent =
            "Unable to determine your location. Please try entering a location in the search bar.";			 
        });		
	}
		
    // stopLoading();	
    };
	
    navigator.geolocation.getCurrentPosition(getNearestLatLng, error, {
      timeout: 10000,
    });
  }
}






export function getDirectionUrl(latitude, longitude) {
  
	if (navigator.geolocation) {
			
		const error = (error) => {		
		  
		  var message_string = 'Unable to determine your location. please share your location';	
		  if (confirm(message_string) != true) {
			var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&destination='+latitude+' '+longitude;		
			window.open(getDirectionUrl, '_blank');
		  }else{
			  return false;
		  } 	
			
			/*
			if(error.code == 1){
				[].slice
				.call(document.querySelectorAll(".error-text") || [])
				.forEach(function (el) {
				  // el.textContent = error.message;
				  locationInput.value = '';
				  el.textContent = "Unable to determine your location.";
				});
			}else{
				[].slice
				.call(document.querySelectorAll(".error-text") || [])
				.forEach(function (el) {
				  locationInput.value = '';	
				  el.textContent =
					"Unable to determine your location.";
				});	
				
			}	
			*/
			
		}		
		navigator.geolocation.getCurrentPosition(  function(position){			
			currentLatitude = position.coords.latitude;
			currentLongitude = position.coords.longitude;			
			setCookie("user_latitude", currentLatitude, 1);
			setCookie("user_longitude", currentLongitude, 1);
			
			[].slice
			.call(document.querySelectorAll(".error-text") || [])
			.forEach(function (el) {
			  el.textContent = "";
			});
			
			var getDirectionUrl = 'https://www.google.com/maps/dir/?api=1&destination='+latitude+' '+longitude+'&origin='+currentLatitude+' '+currentLongitude;		
			window.open(getDirectionUrl, '_blank');		
		}, error, {
			timeout: 10000,
		});
	
	};	
  }


  
