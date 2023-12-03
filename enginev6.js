/*
this code is for https://www.mahakurawa.my.id
bug fixed by Muhammad Umar Hasyim Ashari
Engine Version 6
*/

"use strict";

var showIndex = true;
var indexSeparator = ' ';
var showCaption = true;
var preCache = true;
var pictureID = 'page';
var captionID = 'caption';
var indexID = 'index';
var wrapOn = true;
var clickMode = true;
var pageALT = true;

function createRequestObject() {
    var formData = {};
    var separator = ',';
    var query = '' + window.location;
    query = query.substring((query.indexOf('?')) + 1);
    if (query.length < 1) {
        return false;
    }
    var keyPairs = {};
    var numKP = 1;
    while (query.indexOf('&') > -1) {
        keyPairs[numKP] = query.substring(0, query.indexOf('&'));
        query = query.substring((query.indexOf('&')) + 1);
        numKP++;
    }
    keyPairs[numKP] = query;
    for (var i in keyPairs) {
        var keyName = keyPairs[i].substring(0, keyPairs[i].indexOf('='));
        var keyValue = keyPairs[i].substring((keyPairs[i].indexOf('=')) + 1);
        while (keyValue.indexOf('+') > -1) {
            keyValue = keyValue.substring(0, keyValue.indexOf('+')) + ' ' + keyValue.substring(keyValue.indexOf('+') + 1);
        }
        keyValue = decodeURIComponent(keyValue);
        if (formData[keyName]) {
            formData[keyName] = formData[keyName] + separator + keyValue;
        } else {
            formData[keyName] = keyValue;
        }
    }
    return formData;
}
var formData = createRequestObject();
var glbCacheTimer;
var glbCurrentpage = 1;
var pages = [];
var captions = [];
var linkNames = [];

function getObjectByID(id) {
    return document.getElementById(id);
}

function showpage(index) {
    var theURL = "" + window.location;
    if (theURL.indexOf("?") > 0) {
        theURL = theURL.substring(0, theURL.indexOf("?"));
    }
    theURL += "?page=" + index;
    window.location = theURL;
}

function showNext() {
    if (glbCurrentpage >= pages.length) {
        if (wrapOn) {
            window.location = "https://www.mahakurawa.my.id";
        }
    } else {
        glbCurrentpage += 1;
        showpage(glbCurrentpage);
    }
}

function showPrevious() {
    if (glbCurrentpage <= 1) {
        if (wrapOn) {
            glbCurrentpage = pages.length;
            showpage(glbCurrentpage);
        }
    } else {
        glbCurrentpage -= 1;
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
    if (clickMode) {
        imgString += "<a href='#' onclick='showNext(); return false;'>";
    }
    imgString += "<img border='0' id='mainpage' src='" + pages[glbCurrentpage - 1] + "'";
    if (pageALT) {
        imgString += ' alt="' + captions[glbCurrentpage - 1].replace(/"/g, "'").replace(/<[^>]*>/g, "") + '"';
    }
    if (width > 850) {
        imgString += "width='900'";
    }
    imgString += ">";
    if (clickMode) {
        imgString += "</a>";
    }
    pageLocation.innerHTML = imgString;
    if (showCaption) {
        var pageCaption = getObjectByID(captionID);
        pageCaption.innerHTML = captions[glbCurrentpage - 1];
    }
    if (showIndex) {
        buildIndex();
    }
    if (preCache && (glbCurrentpage < pages.length)) {
        glbCacheTimer = setTimeout(function() {
            cache(glbCurrentpage);
        }, 500);
    }
}

function cache(pageID) {
    if (getObjectByID('mainpage').complete) {
        clearTimeout(glbCacheTimer);
        getObjectByID('cache').src = pages[pageID];
    } else {
        glbCacheTimer = setTimeout(function() {
            cache(glbCurrentpage);
        }, 500);
    }
}

function addpage(filename, caption, linkName) {
    var len = pages.length;
    pages[len] = filename;
    captions[len] = caption;
    if (typeof linkName === "undefined") {
        linkNames[len] = len + 1;
    } else {
        linkNames[len] = linkName;
    }
}

function buildIndex() {
    var indexString = '';
    var i;
    indexString = " <b>Page</b> <select name='index' onchange='showpage(this.options[this.selectedIndex].value);'>";
    for (i = 1; i < pages.length + 1; i++) {
        indexString += "<option value='" + linkNames[i - 1] + "' ";
        if (i === glbCurrentpage) {
            indexString += "selected='selected'";
        }
        indexString += '>' + linkNames[i - 1] + '</option>';
    }
    indexString += "</select> of " + pages.length;
    getObjectByID(indexID).innerHTML = indexString;
    getObjectByID("index2").innerHTML = indexString;
}

function omvKeyPressed(e) {
    var keyCode = 0;
    if (navigator.appName === "Microsoft Internet Explorer") {
        if (!e) {
            e = window.event;
        }
        if (e.keyCode) {
            keyCode = e.keyCode;
            if ((keyCode === 37) || (keyCode === 39)) {
                e.preventDefault();
            }
        } else {
            keyCode = e.which;
        }
    } else {
        if (e.which) {
            keyCode = e.which;
        } else {
            keyCode = e.keyCode;
        }
    }
    switch (keyCode) {
        case 37:
            showPrevious();
            break;
        case 39:
            showNext();
            break;
        default:
            return true;
    }
    return false;
}
document.onkeydown = omvKeyPressed;
indexSeparator = ' |  ';
