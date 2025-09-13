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

// 2025-09 Secure KNX helpers for GA autocompletes
// Cache for secure GA lists per serverId
window.__knxSecureGAsCache = window.__knxSecureGAsCache || {};

function KNX_fetchSecureGAs(serverId) {
    return new Promise((resolve) => {
        try {
            if (window.__knxSecureGAsCache[serverId] instanceof Set) {
                resolve(window.__knxSecureGAsCache[serverId]);
                return;
            }
            $.getJSON("knxUltimateKeyringDataSecureGAs?serverId=" + serverId + "&_=" + new Date().getTime(), (data) => {
                try {
                    const set = new Set();
                    if (Array.isArray(data)) data.forEach(ga => { if (typeof ga === 'string') set.add(ga); });
                    window.__knxSecureGAsCache[serverId] = set;
                    resolve(set);
                } catch (e) { resolve(new Set()); }
            }).fail(function(){ resolve(new Set()); });
        } catch (e) { resolve(new Set()); }
    });
}

function KNX_enableSecureFormatting($input, serverId) {
    try {
        KNX_fetchSecureGAs(serverId).then((secureSet) => {
            try {
                const inst = $input.autocomplete("instance");
                if (!inst) return;
                inst._renderItem = function (ul, item) {
                    // Try to detect GA from item.ga or from item.value string
                    let ga = item.ga;
                    if (!ga && typeof item.value === 'string') {
                        const m = item.value.match(/\b\d{1,2}\/\d{1,3}\/\d{1,3}\b/);
                        if (m) ga = m[0];
                    }
                    const isSecure = ga ? secureSet.has(ga) : false;
                    const colorStyle = isSecure ? 'color: green;' : '';
                    const shield = isSecure ? '<i class="fa fa-shield"></i> ' : '';
                    const label = (typeof item.label === 'string') ? item.label : (item.value || '');
                    return $("<li>").append(`<div style="${colorStyle}">${shield}${label}</div>`).appendTo(ul);
                };
            } catch (e) { }
        });
    } catch (e) { }
}

// Expose helpers
window.htmlUtilsfullCSVSearch = htmlUtilsfullCSVSearch;
window.KNX_fetchSecureGAs = KNX_fetchSecureGAs;
window.KNX_enableSecureFormatting = KNX_enableSecureFormatting;
