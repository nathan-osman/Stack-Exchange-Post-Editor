// ==UserScript==
// @name          Stack Exchange Post Editor
// @author        Nathan Osman
// @version       1.0
// @namespace     http://quickmediasolutions.com
// @description	  A UserScript for cleaning up Stack Exchange posts according to some simple automatic algorithms.
// @include       http://stackoverflow.com/*
// @include       http://serverfault.com/*
// @include       http://superuser.com/*
// @include       http://meta.stackoverflow.com/*
// @include       http://stackapps.com/*
// @include       http://askubuntu.com/*
// @include       http://*.stackexchange.com/*
// ==/UserScript==

// This function embeds code on the actual page.
function EmbedCodeOnPage(javascript_code)
{
    var code_element = document.createElement('script');
    code_element.type = 'text/javascript';
    code_element.textContent = javascript_code;
    document.getElementsByTagName('head')[0].appendChild(code_element);
}

// This function allows us to embed a named function
// on the page that we can invoke from scripts in the page.
function EmbedFunctionOnPage(function_name, function_contents)
{
    EmbedCodeOnPage(function_contents.toString().replace(/function ?/, 'function ' + function_name));
}

// This function allows us to embed a function on the
// page that will immediately get executed.
function EmbedFunctionOnPageAndExecute(function_contents)
{
    EmbedCodeOnPage("(" + function_contents.toString() + ")()");
}