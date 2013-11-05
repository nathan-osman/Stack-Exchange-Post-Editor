// ==UserScript==
// @name          Stack Exchange Post Editor
// @author        Nathan Osman
// @version       1.1
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

/* @include utils.js */
/* @include funcs.js */
/* @include spelling.js */
/* @include thankyou.js */
/* @include title.js */
/* @include body.js */
/* @include diff.js */

// This code will be executed immediately upon insertion into the page DOM
EmbedFunctionOnPageAndExecute(function() {
    
    // Inject the stylesheet we need
    $('head').append(/* @include style.css quote minify */);
    
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
