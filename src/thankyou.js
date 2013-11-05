// Removes Thank You from the post body
EmbedFunctionOnPage('SPE_RemoveThankYou', function(text) {
    
    // You are officially a genius if you can understand what this
    // RegEx I wrote does:
    return text.replace(/(?:, |many )?(?:thank|k?thn?x(?:bye)?)(?:s|(?: |-)you)?(?: (?:so|very) much)?(?:\s?(?:,|-)(?:[\w\s]+)| :-?\)| a lot| and regards| for(?: any| the)? (?:help|ideas)| in advance)?/i, '');
    
});

