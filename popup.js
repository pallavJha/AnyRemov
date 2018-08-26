  let changeColor = document.getElementById('changeColor');
  var OUR_KEY_CONSTANT_FOR_LOCAL_STORAGE = "!!!AnyRemove!!!";

  chrome.storage.sync.get('color', function(data) {
      changeColor.style.backgroundColor = data.color;
      changeColor.setAttribute('value', data.color);
  });

  changeColor.onclick = function(element) {
      let color = element.target.value;
      chrome.tabs.query({
          active: true,
          currentWindow: true
      }, function(tabs) {
          chrome.tabs.executeScript(
              tabs[0].id, {
                  code: 'document.body.style.backgroundColor = "' + color + '";'
              });
      });
  };

  function validateHost(str) {
      return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(str);
  }


  let saveButton = document.getElementById('saveButton');

  saveButton.onclick = function(element) {

      console.log("ABC");
      var host = document.getElementById("host").value;
      var selectors = document.getElementById("selectors").value;


      if (host === "*" || validateHost(host)) {
          chrome.storage.local.get(
              ["!!!AnyRemove!!!"],
              function(items) {
                  var allCollections;
                  if (!items || (Object.keys(items).length === 0 && items.constructor === Object)) {
                      //Adding data for the first time
                      allCollections = "{}";

                  } else {
                      //data is already present which means that the app is being used
                      allCollections = items["!!!AnyRemove!!!"];
                  }

                  allCollections = JSON.parse(allCollections)
                  allCollections[host] = selectors;
                  allCollectionsStr = JSON.stringify(allCollections);

                  chrome.storage.local.set({
                      "!!!AnyRemove!!!": allCollectionsStr
                  }, function() {
                      console.log("Data updated for " + host + "!")
                  });

                  console.log("Updated the selectors for " + host);
                  document.getElementById("errors").style.visibility = "hidden";
              });
      } else {
          if (document.getElementById("errors").style.visibility == "hidden") {
              //its visible
              //check if input fie type has file selected
              document.getElementById("errors").style.visibility = "visible"
          }
          console.error("Invalid hostname inserted, Please try again with valid hostname");
      }
  };



  let showAllButton = document.getElementById('showAllButton');

  showAllButton.onclick = function(element) {

      chrome.storage.local.get({
          OUR_KEY_CONSTANT_FOR_LOCAL_STORAGE
      }, function(items) {
          if (!items) {
              //Adding data for the first time
              console.log("No Values were found!")
              allCollections = {}
          } else {
              //data is already present which means that the app is being used
              allCollections = JSON.parse(items);
          }



          var table = document.getElementById("allCollections");
          if (table) {
              table.parentNode.removeChild(table);
          }

          table = document.createElement("table")
          thead = document.createElement("thead")

          th1 = document.createElement("th")
          th1.appendChild(document.createTextNode("Host"));

          th2 = document.createElement("th")
          th2.appendChild(document.createTextNode("Identifier(';' Separated)"));

          thead.appendChild(th1)
          thead.appendChild(th2)
          table.appendChild(thead)

          tbody = document.createElement("tbody")

          for (var host in allCollections) {
              var tr = document.createElement("tr");

              var host_td = document.createElement("td")
              var _host = document.createTextNode(host);
              host_td.appendChild(_host);

              var selectors_td = document.createElement("td");
              var selectors = document.createTextNode(allCollections[host]);
              selectors_td.appendChild(selectors);

              tr.appendChild(td);
              tbody.appendChild(tr);
          }
          table.appendChild(tbody);

          document.getElementById("body").appendChild(table);
      });
  };