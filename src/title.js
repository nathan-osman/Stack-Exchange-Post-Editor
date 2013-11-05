// Corrects the title of the question
EmbedFunctionOnPage('SPE_CorrectTitle', function(original_title) {
    
    // First correct any misspellings
    var title = SPE_CorrectCommonMisspellings(original_title);
    
    // Anytime more than two letters are capitalized, switch them to lowercase
    title = title.replace(/([A-Z]{2,})/g, function(i) { return i.toLowerCase() });
    
    // TODO: make sure first word is capitalized and the title ends with punctuation.
    
    return title;
    
});

