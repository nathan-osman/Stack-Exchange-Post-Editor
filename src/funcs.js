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

