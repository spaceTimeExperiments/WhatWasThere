import * as globeletjs from "https://unpkg.com/globeletjs@0.1.6/dist/globelet.js";

const container = document.getElementById("globe");

const globePromise = globeletjs.initGlobe({
  container,
  style: "/WhatWasThere/klokantech-basic-style-geojson-fixed.json",
  center: [-100, 38.5],
  altitude: 6280,
  width: container.clientWidth + 512,
  height: container.clientHeight + 512,
});

globePromise
  .then((globeAPI) => {
    console.log("Globelet initialized", globeAPI);
    globeAPI.startAnimation();

    // Move the XML Fetch inside the resolved Promise block so 'globeAPI' is accessible!
    fetch("markers.xml")
      .then((response) => response.text())
      .then((xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const xmlMarkers = xmlDoc.getElementsByTagName("marker");

        Array.from(xmlMarkers).forEach((xmlMarker) => {
          const name = xmlMarker.getElementsByTagName("name")[0].textContent;
          const lng = parseFloat(
            xmlMarker.getElementsByTagName("lng")[0].textContent,
          );
          const lat = parseFloat(
            xmlMarker.getElementsByTagName("lat")[0].textContent,
          );

          // Create standard DOM element for visual style
          const markerElement = document.createElement("div");
          markerElement.className = "custom-map-pin";
          markerElement.title = name;
          markerElement.style.width = "12px";
          markerElement.style.height = "12px";
          markerElement.style.backgroundColor = "red";
          markerElement.style.borderRadius = "50%";
          markerElement.style.position = "absolute"; // Essential for CSS overlay shifts

          // GlobeletJS uses 'addMarker' and accepts an object with 'element' and 'position'
          globeAPI.addMarker({
            element: markerElement,
            position: [lng, lat],
          });
        });
      })
      .catch((error) => console.error("Error loading XML data:", error));
  })
  .catch((error) => {
    console.error("Globelet initialization failed:", error);
  });
