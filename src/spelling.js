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

