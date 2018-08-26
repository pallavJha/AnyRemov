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
      let host = document.getElementById("host").value;
      let selectors = document.getElementById("selectors").value;


      if (host === "*" || validateHost(host)) {
          chrome.storage.local.get(
              ["!!!AnyRemove!!!"],
              function(items) {
                  let allCollections;
                  if (!items || (Object.keys(items).length === 0 && items.constructor === Object)) {
                      //Adding data for the first time
                      allCollections = "{}";

                  } else {
                      //data is already present which means that the app is being used
                      allCollections = items["!!!AnyRemove!!!"];
                  }

                  allCollections = JSON.parse(allCollections)
                  allCollections[host] = selectors;
                  let allCollectionsStr = JSON.stringify(allCollections);

                  chrome.storage.local.set({
                      "!!!AnyRemove!!!": allCollectionsStr
                  }, function() {
                      console.log("Data updated for " + host + "!")
                  });

                  console.log("Updated the selectors for " + host);
                  makeErrorsInVisible();
                  clearTable();
              });
      } else {
          makeErrorsVisible();
          console.error("Invalid hostname inserted, Please try again with valid hostname.");
      }
  };


  function makeErrorsVisible() {
      if (document.getElementById("errors").style.display == "none") {
          //its visible
          //check if input fie type has file selected
          document.getElementById("errors").style.display = "block"
      }
  }

  function makeErrorsInVisible() {
      document.getElementById("errors").style.display = "none";
  }


  let showAllButton = document.getElementById('showAllButton');

  showAllButton.onclick = addTable;

  function addTable(element) {

      makeErrorsInVisible();
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
              }

              allCollections = JSON.parse(allCollections)

              let table = document.getElementById("allCollections");
              if (table) {
                  table.parentNode.removeChild(table);
              }

              table = document.createElement("table")
              table.setAttribute("id", "allCollections");

              let thead = document.createElement("thead")

              let th1 = document.createElement("th")
              th1.appendChild(document.createTextNode("Host"));

              let th2 = document.createElement("th")
              th2.appendChild(document.createTextNode("Identifier(';' Separated)"));

              let th3 = document.createElement("th")
              th3.appendChild(document.createTextNode("Actions"));

              thead.appendChild(th1)
              thead.appendChild(th2)
              thead.appendChild(th3)
              table.appendChild(thead)

              let tbody = document.createElement("tbody")

              for (let host in allCollections) {
                  let tr = document.createElement("tr");

                  let host_td = document.createElement("td")
                  host_td.classList.add("allCollections");
                  let _host = document.createTextNode(host);
                  host_td.appendChild(_host);

                  let selectors_td = document.createElement("td");
                  selectors_td.classList.add("allCollections");
                  let selectors = document.createTextNode(allCollections[host]);
                  selectors_td.appendChild(selectors);

                  let actions_td = document.createElement("td");
                  actions_td.classList.add("allCollections");

                  let editButton = document.createElement("button");
                  editButton.appendChild(document.createTextNode("Edit"));
                  editButton.classList.add("edit_button");
                  editButton.classList.add("button");
                  editButton.onclick = function() {
                      editHost(host);
                  }

                  let delButton = document.createElement("button");
                  delButton.appendChild(document.createTextNode("Delete"));
                  delButton.classList.add("delete_button");
                  delButton.classList.add("button");
                  delButton.onclick = function() {
                      deleteHost(host);
                  }

                  actions_td.appendChild(editButton);
                  actions_td.appendChild(delButton);

                  tr.appendChild(host_td);
                  tr.appendChild(selectors_td);
                  tr.appendChild(actions_td);
                  tbody.appendChild(tr);
              }
              table.appendChild(tbody);

              document.getElementById("body").appendChild(table);
          });
  }


  let clearAllButton = document.getElementById('clearAllButton');

  clearAllButton.onclick = clearTable;

  function clearTable() {
      let table = document.getElementById("allCollections");
      if (table) {
          table.parentNode.removeChild(table);
      }
      return table;
  }

  function deleteHost(host) {

      console.log("Deleting host = " + host);

      if (host === "*" || validateHost(host)) {
          chrome.storage.local.get(
              ["!!!AnyRemove!!!"],
              function(items) {
                  let allCollections;
                  if (!items || (Object.keys(items).length === 0 && items.constructor === Object)) {
                      //Adding data for the first time
                      allCollections = "{}";

                  } else {
                      //data is already present which means that the app is being used
                      allCollections = items["!!!AnyRemove!!!"];
                  }

                  allCollections = JSON.parse(allCollections)
                  delete allCollections[host];
                  allCollectionsStr = JSON.stringify(allCollections);

                  chrome.storage.local.set({
                      "!!!AnyRemove!!!": allCollectionsStr
                  }, function() {
                      console.log("Data deleted for " + host + "!");
                      addTable();
                  });


              });
      }
  }

  function editHost(host) {

      console.log("Editing host = " + host);

      if (host === "*" || validateHost(host)) {
          chrome.storage.local.get(
              ["!!!AnyRemove!!!"],
              function(items) {
                  let allCollections;
                  if (!items || (Object.keys(items).length === 0 && items.constructor === Object)) {
                      //Adding data for the first time
                      allCollections = "{}";

                  } else {
                      //data is already present which means that the app is being used
                      allCollections = items["!!!AnyRemove!!!"];
                  }

                  allCollections = JSON.parse(allCollections)
                  let selectors = allCollections[host];

                  document.getElementById("host").value = host;
                  document.getElementById("selectors").value = selectors;
              });
      }
  }

  let fetchHostNameButton = document.getElementById('fetchHostNameButton');

  fetchHostNameButton.onclick = getCurrentTabHostName;

  function getCurrentTabHostName() {
      chrome.tabs.query({
          currentWindow: true,
          active: true
      }, function(tabs) {
          console.log(tabs[0].url);
          var url = new URL(tabs[0].url)
          var domain = url.hostname
          document.getElementById("host").value = domain;
      });
  }