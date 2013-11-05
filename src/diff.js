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

