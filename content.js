window.onload = function() {
    console.log("page load!");
    chrome.storage.sync.get('color', function(data) {
        console.log(data);
    });
}