import { Controller } from "@hotwired/stimulus"
// Import the Mapbox GL JS library
import mapboxgl from 'mapbox-gl'
// Import the MapboxGeocoder from the Mapbox GL JS library
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

// Connects to data-controller="map"
export default class extends Controller {
  static values = {
    apiKey: String,
    markers: Array
  }

  connect() {
    // Initialize the Mapbox GL JS map with the API key
    mapboxgl.accessToken = this.apiKeyValue

    // Initialize the map with the style and add the geocoder
    this.map = new mapboxgl.Map({
      container: this.element,
      style: "mapbox://styles/kailaulau/clp9syl68003m01o01p266rin"
    })

    this.#addMarkersToMap()
    this.#fitMapToMarkers()

    // Add the search field to the map
    this.map.addControl(new MapboxGeocoder({ accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl }))
  }

  #addMarkersToMap() {
    this.markersValue.forEach((marker) => {
      // Create a popup for each marker
      const popup = new mapboxgl.Popup().setHTML(marker.info_window_html)

      // Create a custom marker for each marker
      const customMarker = document.createElement("div")
      customMarker.innerHTML = marker.marker_html

      // Add the marker to the map
      new mapboxgl.Marker(customMarker)
        .setLngLat([ marker.lng, marker.lat ])
        .setPopup(popup)
        .addTo(this.map)
    })
  }

  #fitMapToMarkers() {
    // Create a new bounds object with the map's current viewport
    const bounds = new mapboxgl.LngLatBounds()
    this.markersValue.forEach((marker) => {
      // Extend the bounds to include each marker's location
      bounds.extend([ marker.lng, marker.lat ])
    })

    // Fit the map to the bounds
    this.map.fitBounds(bounds, { padding: 70, maxZoom: 20, duration: 5000 })
  }
}
