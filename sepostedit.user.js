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

// This function executes the provided callback when the dependent
// script has finished loading.
EmbedFunctionOnPage('LoadDependentScript', function(script_filename, callback) {
    
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = script_filename;
    script.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(script);
    
});

// This code will be executed immediately upon insertion into the page DOM
EmbedFunctionOnPageAndExecute(function() {
    
    // Load liveQuery so that we can modify the editor even for
    // inline edits.
    // Load livequery
    LoadDependentScript('http://files.quickmediasolutions.com/js/jquery.livequery.js', function() {
        
        // Now whenever an editor is created, we manipulate it
        $('.wmd-button-row').livequery(function() {
            
            // Do something with the editor: '$(this)'
            
        });
    });
});