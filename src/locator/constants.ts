export const limit = 3;
export const radius = 300;
export const defaultQuery = "";
export const locationInput = <HTMLInputElement>(
  document.getElementById("location-input")
);
export const searchButton = document.getElementById("search-location-button");
 export const useMyLocation = document.getElementById("useLocation");
//export const useMyLocation = '';
export const locationNoun = "Store";
export const locationNounPlural = "Stores";

// Live Api query variables
var script_tag = document.getElementById('js-locator');
export const liveAPIKey = "b262ae7768eec3bfa53bfca6d48e4000";
//console.log(liveAPIKey);
export const savedFilterId = "1040219931";
export const entityTypes = "location";
export const loadLocationsOnLoad = true;
export const enableAutocomplete =false;
export const base_url = "https://liveapi-sandbox.yext.com/v2/accounts/me/";
export const useMiles = true;

export type locationOption = {
  // The value of the content, either a field name or a constant value
  value: string;
  // Determines where this value comes from. Generally either FIELD or text.
  contentSource: string;
  // Determines whether the content defined in value should be parsed as RTF.
  isRtf: boolean | undefined;
};

export const locationOptions = {
 /* cardTitle: {
    value: "geomodifier",
    contentSource: "FIELD",
    isRtf: true,
  },*/
  cardTitle: {
    value: "name",
    contentSource: "FIELD",
    isRtf: true,
  },
  cardTitleLinkUrl: {
    value: "slug",
    contentSource: "FIELD",
  },
  hours: {
    value: "hours",
    contentSource: "FIELD",
  },
  address: {
    value: "address",
    contentSource: "FIELD",
  },
  photo:{
    value:"photoGallery",
    contentSource:"FIELD",
  },
  phonenumber:{
    value:"mainPhone",
    contentSource:"FIELD",
  },
  getDirectionsLabel: {
    value: "Get Directions",
    contentSource: "text",
    isRtf: true,
  },
  coordinates: {
    value: "geocodedCoordinate",
    contentSource: "FIELD",
  },
  yextCoordinates: {
    value: "yextDisplayCoordinate",
    contentSource: "FIELD",
  },
  viewDetailsLinkText: {
    value: "View Details",
    contentSource: "text",
  },
  viewDetailsLinkUrl: {
    value: "/",
    contentSource: "text",
  },
  c_departments: {
    value: "c_departments",
    contentSource: "FIELD",
  },
};


export function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function isMobileStatus() {
	
	let isMobile = false;		
	if ($(window).width() < 1024) {
	   isMobile = true;
	}	
	return isMobile;	
	
}