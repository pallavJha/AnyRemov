window.onload = function() {
    console.log("page load!");
    chrome.storage.local.get('color', function(data) {
        console.log(data);
    });

    console.log("Hostname = " + window.location.hostname)

    chrome.storage.local.get(
        ["!!!AnyRemove!!!"],
        function(items) {
            let allCollections;
            if (!items || (Object.keys(items).length === 0 && items.constructor === Object)) {
                //Adding data for the first time
                console.log("No Values were found!")
                allCollections = {}
            } else {
                //data is already present which means that the app is being used
                allCollections = items["!!!AnyRemove!!!"];
                allCollections = JSON.parse(allCollections)
                thisHostSelector = allCollections[window.location.hostname];
                removeElements(window.location.hostname, thisHostSelector);
                commonSelectorsForAllHosts = allCollections["*"];
                removeElements("*", commonSelectorsForAllHosts);
            }
        });
}

function removeElements(hostname, selectors) {
    if (selectors && selectors.length > 0) {
        splited_selectors = selectors.split(";");
        for (var i = 0; i < splited_selectors.length; i++) {
            try {
                selector = splited_selectors[i];
                selector = selector.trim();
                if (!selector || selector.length == 0) {
                	continue;
                }
                console.log(selector);
                removeElementsFromSelector(selector);
            } catch (e) {
                console.error("Error while executing the removal process with hostname = " + hostname +
                    " splited_selectors = " + splited_selectors + " i = " + i, e);
            }
        }
    }
}

function removeElementsFromSelector(selector) {
    elements = Array.from(document.querySelectorAll(selector));
    if (elements) {
        console.log("Found " + elements.length + " elements for removal process with selector = " + selector);
        for (var i = 0; i < elements.length; i++) {
            try {
                let element = elements[i];
                if (element) {
                    element.parentNode.removeChild(element);
                }
            } catch (e) {
                console.error("Error while removing element", e);
            }
        }
    } else {
        console.log("No elements were found with selector = " + selector)
    }
}