// Corrects the body of the post
EmbedFunctionOnPage('SPE_CorrectBody', function(original_body) {
    
    // Correct any misspellings
    var body = SPE_CorrectCommonMisspellings(original_body);
    
    // Remove any 'thank-you' sentences
    body = SPE_RemoveThankYou(body);
    
    return body;
    
});

