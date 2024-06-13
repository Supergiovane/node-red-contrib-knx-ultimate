// 31/03/2020 Search Helper
function htmlUtilsfullCSVSearch(sourceText, searchString) {
    let aSearchWords = [];
    if (searchString.toLowerCase().includes('exactmatch')) {
        // Find only the strict exact match of group address. For example, if the string is 0/0/2exactmatch, i return only the item in the csv having
        // group address 0/0/2 (and not also, for example 0/0/20)
        // I can have also an exact string like '0/0/1exactmatch 1.000', (GA or any text, plus the datapoint) and i must take it into consideration
        let aSearchStrings = searchString.split(' ');
        for (let index = 0; index < aSearchStrings.length; index++) {
            const element = aSearchStrings[index];
            if (element.includes('exactmatch')) {
                aSearchWords.push(element.replace('exactmatch', ' ')); // The last ' ' allow to return the exact match
            } else {
                aSearchWords.push(element); // The last ' ' allow to return the exact match
            }
        }
    } else {
        aSearchWords = searchString.toLowerCase().split(" ");
    }

    // This searches for all words in a string
    let i = 0;
    for (let index = 0; index < aSearchWords.length; index++) {
        if (sourceText.toLowerCase().indexOf(aSearchWords[index]) > -1) i += 1;
    }
    return i == aSearchWords.length;
}