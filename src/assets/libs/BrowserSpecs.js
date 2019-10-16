

function setNavigator(){
    if( !document.getElementById("nav"))
        return;

    document.getElementById("nav").innerHTML = "Navigator";

    document.getElementById("navt-1").innerHTML = "appName"
    document.getElementById("navt-2").innerHTML = "product"
    document.getElementById("navt-3").innerHTML = "appVersion"
    document.getElementById("navt-4").innerHTML = "userAgent"
    document.getElementById("navt-5").innerHTML = "platform"
    document.getElementById("navt-6").innerHTML = "language"

    document.getElementById("nav-1").innerHTML = navigator.appName;
    document.getElementById("nav-2").innerHTML = navigator.product;
    document.getElementById("nav-3").innerHTML = navigator.appVersion;
    document.getElementById("nav-4").innerHTML = navigator.userAgent;
    document.getElementById("nav-5").innerHTML = navigator.platform;
    document.getElementById("nav-6").innerHTML = navigator.language;
}


function setScreen(){

    if( !document.getElementById("scr"))
        return;

    document.getElementById("scr").innerHTML = 'Window';
    
    
    document.getElementById("scrt-1").innerHTML = "width";
    document.getElementById("scrt-2").innerHTML = "height";
    document.getElementById("scrt-3").innerHTML = "availWidth";
    document.getElementById("scrt-4").innerHTML = "availHeight";
    document.getElementById("scrt-5").innerHTML = "colorDepth";
    document.getElementById("scrt-6").innerHTML = "pixelDepth";

    document.getElementById("scr-1").innerHTML = window.screen.width + ' px';
    document.getElementById("scr-2").innerHTML = window.screen.height + ' px';
    document.getElementById("scr-3").innerHTML = window.screen.availWidth + ' px';
    document.getElementById("scr-4").innerHTML = window.screen.availHeight + ' px';
    document.getElementById("scr-5").innerHTML = window.screen.colorDepth + ' px';
    document.getElementById("scr-6").innerHTML = window.screen.pixelDepth + ' px';
}

function setLocation(){
    if( !document.getElementById("loc"))
        return;

    document.getElementById("loc").innerHTML = "Location";

    document.getElementById("loct-1").innerHTML = "href"
    document.getElementById("loct-2").innerHTML = "hostname"
    document.getElementById("loct-3").innerHTML = "pathname"
    document.getElementById("loct-4").innerHTML = "protocol"

    document.getElementById("loc-1").innerHTML = window.location.href;
    document.getElementById("loc-2").innerHTML = window.location.hostname;
    document.getElementById("loc-3").innerHTML = window.location.pathname;
    document.getElementById("loc-4").innerHTML = window.location.protocol;
}

function setWindow(){
    if( !document.getElementById("win"))
        return;
    document.getElementById("win").innerHTML = 'Window';

    document.getElementById("wint-1").innerHTML = 'innerHeight';
    document.getElementById("wint-2").innerHTML = 'innerWidth';

    document.getElementById("win-1").innerHTML = window.innerHeight + ' px';
    document.getElementById("win-2").innerHTML = window.innerWidth + ' px';
}


function setGeolocation(){
    if( !document.getElementById("lat"))
        return;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        document.getElementById("lat-1").innerHTML = 'Not available';
        document.getElementById("lat-2").innerHTML = 'Not available';
    }
}

function showPosition(position) {

  document.getElementById("lat").innerHTML =  "Geolocation";


  document.getElementById("latt-1").innerHTML =  "Latitude"
  document.getElementById("latt-2").innerHTML = "Longitud";

  document.getElementById("lat-1").innerHTML =  position.coords.latitude;
  document.getElementById("lat-2").innerHTML = position.coords.longitude;
}

export function initBrowserSpecs(){
setNavigator();
setScreen();
setLocation();
setWindow();
setGeolocation();
}







