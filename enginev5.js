/*
this code is for https://www.mahakurawa.my.id
bug fixed by Muhammad Umar Hasyim Ashari
*/
var showIndex = Boolean(true);
var indexSeparator = ' ';
var showCaption = Boolean(true);
var preCache = Boolean(true);
var pictureID = 'page';
var captionID = 'caption';
var indexID = 'index';
var wrapOn = Boolean(true);
var SequentialView = Boolean(false);
var sequentialDelay = 10; // Renamed variable
var clickMode = Boolean(true);
var pageALT = Boolean(true);
var preloadCount = 2; // Number of images to preload ahead

function createRequestObject() {
    FORM_DATA = {};
    separator = ',';
    query = '' + this.location;
    query = query.substring((query.indexOf('?')) + 1);
    if (query.length < 1) {
        return false;
    }
    keypairs = {};
    numKP = 1;
    while (query.indexOf('&') > -1) {
        keypairs[numKP] = query.substring(0, query.indexOf('&'));
        query = query.substring((query.indexOf('&')) + 1);
        numKP++;
    }
    keypairs[numKP] = query;
    for (var i in keypairs) {
        keyName = keypairs[i].substring(0, keypairs[i].indexOf('='));
        keyValue = keypairs[i].substring((keypairs[i].indexOf('=')) + 1);
        while (keyValue.indexOf('+') > -1) {
            keyValue = keyValue.substring(0, keyValue.indexOf('+')) + ' ' + keyValue.substring(keyValue.indexOf('+') + 1);
        }
        keyValue = unescape(keyValue);
        if (FORM_DATA[keyName]) {
            FORM_DATA[keyName] = FORM_DATA[keyName] + separator + keyValue;
        } else {
            FORM_DATA[keyName] = keyValue;
        }
    }
    return FORM_DATA;
}
FORM_DATA = createRequestObject();
var glbCacheTimer;
var glbCurrentpage = 1;
var pages = [];
var captions = [];
var linkNames = [];

function getObjectByID(id) {
    if (document.all) {
        return document.all[id];
    } else {
        return document.getElementById(id);
    }
}

function showpage(index) {
    var theURL = "" + this.location;
    if (theURL.indexOf("?") > 0) {
        theURL = theURL.substring(0, theURL.indexOf("?"));
    }
    theURL += "?page=" + index;
    this.location = theURL;
}

function showpage(index) {
    var mainImg = getObjectByID('mainpage');
    mainImg.src = pages[index - 1];

    if (showCaption == true) {
        var pageCaption = getObjectByID(captionID);
        pageCaption.innerHTML = captions[index - 1];
    }
    
    glbCurrentpage = index;

    if (showIndex == true) {
        buildIndex();
    }
}

function showNext() {
    if (glbCurrentpage >= pages.length) {
        if (wrapOn == true) {
            self.location = "https://www.mahakurawa.my.id";
        }
    } else {
        glbCurrentpage += 1;
        showpage(glbCurrentpage);
    }
}

function showPrevious() {
    if (glbCurrentpage <= 1) {
        if (wrapOn == true) {
            glbCurrentpage = pages.length;
            showpage(glbCurrentpage);
        }
    } else {
        glbCurrentpage += -1;
        showpage(glbCurrentpage);
    }
}

function showFirst() {
    glbCurrentpage = 1;
    showpage(glbCurrentpage);
}

function showLast() {
    glbCurrentpage = pages.length;
    showpage(glbCurrentpage);
}

function initpage() {
    var pageLocation = getObjectByID(pictureID);
    var imgString = '';
    var newImg = new Image();
    newImg.src = pages[glbCurrentpage - 1];
    var height = newImg.height;
    var width = newImg.width;
    if (clickMode == true) {
        imgString += "<a href='javascript:void(showNext());'>";
    }
    imgString += "<img border='0' id='mainpage' src='" + pages[glbCurrentpage - 1] + "'";
    if (pageALT == true) {
        imgString += ' alt="' + captions[glbCurrentpage - 1].replace(/"/g, "'").replace(/<[^>]*>/g, "") + '"';
    }
    if (width > 850) {
        imgString += "width='900'";
    }
    imgString += ">";
    if (clickMode == true) {
        imgString += "</a>";
    }
    pageLocation.innerHTML = imgString;
    if (showCaption == true) {
        var pageCaption = getObjectByID(captionID);
        pageCaption.innerHTML = captions[glbCurrentpage - 1];
    }
    if (showIndex == true) {
        buildIndex();
    }
    if ((preCache == true) && (glbCurrentpage < pages.length)) {
        for (var i = 1; i <= preloadCount; i++) {
            var nextPage = glbCurrentpage + i;
            if (nextPage <= pages.length) {
                cache(nextPage);
            }
        }
    }

    if (SequentialView == true) {
        glbSlideTimer = setTimeout(showNext, (sequentialDelay * 1000));
    }
}

function cache(pageID) {
    var mainPageElement = getObjectByID('mainpage');
    var cacheElement = getObjectByID('cache');

    // Ensure cacheElement exists and pageID is valid
    if (cacheElement && pageID >= 1 && pageID <= pages.length) {
        if (mainPageElement && mainPageElement.complete) {
            clearTimeout(glbCacheTimer);
            cacheElement.src = pages[pageID - 1]; // Adjust index to match array indexing (if needed)
        } else {
            glbCacheTimer = setTimeout(function() {
                cache(pageID);
            }, 500);
        }
    } else {
        console.error('Invalid pageID or element with ID "cache" not found.');
    }
}

function addpage(filename, caption, linkName) {
    var len = pages.length;
    pages[len] = filename;
    captions[len] = caption;
    if (typeof linkName == "undefined") {
        linkNames[len] = len + 1;
    } else {
        linkNames[len] = linkName;
    }
}

function buildIndex() {
    var indexString = '';
    var i;
    indexString = " <b>Page</b> <select name='index' onchange='javascript:void(showpage(this.options[this.selectedIndex].value));'>";
    for (i = 1; i < pages.length + 1; i++) {
        indexString += "<option value='" + linkNames[i - 1] + "' ";
        if (i == glbCurrentpage) {
            indexString += "selected='selected'";
        }
        indexString += '>' + linkNames[i - 1] + '</option>';
    }
    indexString += "</select> of " + pages.length;
    getObjectByID(indexID).innerHTML = indexString;
    getObjectByID("index2").innerHTML = indexString;
}

function enableSequentialView(newDelay) {
    SequentialView = Boolean(true);
    if (newDelay > 0) {
        sequentialDelay = newDelay; // Updated variable
    }
    showpage(glbCurrentpage);
}

function disableSequentialView() {
    SequentialView = Boolean(false);
    clearTimeout(glbSlideTimer);
    showpage(glbCurrentpage);
}
if (FORM_DATA.page > 0) {
    glbCurrentpage = Number(FORM_DATA.page);
} else {
    glbCurrentpage = 1;
}
if (FORM_DATA.slideMode == "true") {
    SequentialView = Boolean(true);
    sequentialDelay = FORM_DATA.slideDelay; // Updated variable
}

function handleKeyPressed(event) {
    var keyCode = event.keyCode || event.which;

    switch (keyCode) {
        case 37:
            showPrevious();
            return false;
        case 39:
            showNext();
            return false;
        default:
            return true;
    }
}

document.onkeydown = handleKeyPressed;
var indexSeparator = ' | ';

