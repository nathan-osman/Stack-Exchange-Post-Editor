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
EmbedFunctionOnPage('SPE_LoadDependentScript', function(script_filename, callback) {
    
    var script    = document.createElement('script');
    script.type   = 'text/javascript';
    script.src    = script_filename;
    script.onload = callback;
    document.getElementsByTagName('head')[0].appendChild(script);
    
});

// This function adds an icon to the toolbar, playing nice with other scripts that
// may have also injected buttons on the toolbar
EmbedFunctionOnPage('SPE_AddToolbarButton', function(toolbar, icon, tooltip, callback) {
    
    // First, retrieve the offset that this new button will assume
    var left = toolbar.find('li:not(.wmd-help-button):last').css('left');
    
    if(left !== null && left != undefined)
        left = parseInt(left.replace(/\D/g, '')) + 50;
    else
        left = 400; // assume the default location of extra buttons
    
    // Now create the new button
    var button = $('<li class="wmd-button" style="left: ' + left + 'px; background-image: url(' + icon + '); background-repeat: no-repeat; background-position: center center;" title="' + tooltip + '"></li>');
    
    // ...set its click handler
    button.click(callback);
    
    // ...and append it to the toolbar
    toolbar.append(button);
    
});

// Corrects common misspellings (this includes improperly capitalized words too)
EmbedFunctionOnPage('SPE_CorrectCommonMisspellings', function(original_text) {
    
    var text = original_text;
    
    var replacements = { 'dont':   'don\'t',
                         'i':      'I',
                         'i\'?m':  'I\'m',
                         'teh':    'the',
                         '(?:ubunto|ubunut|ubunutu|ubunu|ubntu|ubutnu|uuntu|unbuntu|ubunt|ubutu)': 'Ubuntu',
    };
    
    for(var wrong_word in replacements)
        text = text.replace(new RegExp('\\b' + wrong_word + '\\b', 'gi'), replacements[wrong_word]);
    
    return text;
    
});

// Removes Thank You from the post body
EmbedFunctionOnPage('SPE_RemoveThankYou', function(text) {
    
    // You are officially a genius if you can understand what this
    // RegEx I wrote does:
    return text.replace(/(?:, |many )?(?:thank|k?thn?x(?:bye)?)(?:s|(?: |-)you)?(?: (?:so|very) much)?(?:\s?(?:,|-)(?:[\w\s]+)| :-?\)| a lot| and regards| for(?: any| the)? (?:help|ideas)| in advance)?/i, '');
    
});

// Corrects the title of the question
EmbedFunctionOnPage('SPE_CorrectTitle', function(original_title) {
    
    // First correct any misspellings
    var title = SPE_CorrectCommonMisspellings(original_title);
    
    // Anytime more than two letters are capitalized, switch them to lowercase
    title = title.replace(/([A-Z]{2,})/g, function(i) { return i.toLowerCase() });
    
    // TODO: make sure first word is capitalized and the title ends with punctuation.
    
    return title;
    
});

// Corrects the body of the post
EmbedFunctionOnPage('SPE_CorrectBody', function(original_body) {
    
    // Correct any misspellings
    var body = SPE_CorrectCommonMisspellings(original_body);
    
    // Remove any 'thank-you' sentences
    body = SPE_RemoveThankYou(body);
    
    return body;
    
});

EmbedFunctionOnPage('SPE_CreateDiff', function(preview, textarea) {
    
    // Create the DIFF <div>
    var diff = $('<div class="spe_diff wmd-preview"></div>');
    
    // Setup the event handler
    textarea.keyup(function() {
        
        // Grab the original HTML for the post and the current HTML
        var original = preview.data('original_contents');
        var current  = preview.html();
        
        diff.html(diffString(original, current));
        
    });
    
    // Create the wrapper <div> that will contain the preview and diff
    // and append it after the preview element.
    var container = $('<div></div>');
    preview.after(container);
    
    // Now attach the two items
    container.append(preview.detach()).append(diff);
    
    // Trigger the keyup event to seed the diff <div>
    textarea.trigger('keyup');
    
});

// This code will be executed immediately upon insertion into the page DOM
EmbedFunctionOnPageAndExecute(function() {
    
    // Inject the stylesheet we need
    $('head').append('<style>\
                      .spe_diff ins {\
                          background-color: #cfc;\
                      }\
                      .spe_diff del {\
                          background-color: #fcc;\
                      }\
                      .spe_diff {\
                          display: none;\
                      }\
                      </script>');
    
    // Load jsdiff
    SPE_LoadDependentScript('http://files.quickmediasolutions.com/js/jsdiff.min.js', function() {
        
        // Load liveQuery so that we can modify the editor even for inline edits.
        SPE_LoadDependentScript('http://files.quickmediasolutions.com/js/jquery.livequery.js', function() {
        
            // Now whenever an editor is created, we manipulate it
            $('.post-editor').livequery(function() {
                
                // Wait for up to 100 ms to append the button since otherwise our button might
                // actually end up getting appended before the standard toolbar buttons.
                var editor = $(this);
                
                window.setTimeout(function() {
                    
                    // Grab a copy of the original contents
                    var preview = editor.find('.wmd-preview');
                    preview.data('original_contents', preview.html());
                    
                    // Set up the diff / preview
                    var textarea = editor.find('.wmd-input');
                    SPE_CreateDiff(preview, textarea);
                    
                    // Then append the editor button to the toolbar
                    var toolbar = editor.find('.wmd-button-row');
                    SPE_AddToolbarButton(toolbar, 'http://i.stack.imgur.com/wWIIc.png', 'Stack Exchange Post Editor',
                                         function() {
                        
                        // Check for the title
                        var title = $('#title').val();
                        if(title.length) {
                            
                            var new_title = SPE_CorrectTitle(title);
                            $('#title').val(new_title);
                            $('#question-header .question-hyperlink').text(new_title)
                            
                        }
                        
                        // Now correct the body
                        textarea.val(SPE_CorrectBody(textarea.val()));
                        
                        // ...and update the preview
                        StackExchange.MarkdownEditor.refreshAllPreviews();
                        textarea.trigger('keyup');
                        
                    });
                    
                    // Now append the diff button to the toolbar
                    SPE_AddToolbarButton(toolbar, 'http://i.stack.imgur.com/pHHIq.png', 'Toggle diff of Post Modifications',
                                         function() {
                        
                        // Make the diff viewer active
                        preview.toggle();
                        editor.find('.spe_diff').toggle();
                        
                    });
                    
                }, 200);
                
            });
        });
    });
});