import { Controller } from "@hotwired/stimulus"
// Import the MapboxGeocoder from the Mapbox GL JS library
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder"

// Connects to data-controller="address-autocomplete"
export default class extends Controller {
  static targets = ["address"]

  static values = {
    apiKey: String
  }

  connect() {
    // Initialize the MapboxGeocoder with the API key and the types of results to return
    this.geocoder = new MapboxGeocoder({
      accessToken: this.apiKeyValue,
      types: "country,region,place,postcode,locality,neighborhood,address"
    })

    // Add event listener to update the input field when a result is selected
    this.geocoder.on("result", event => this.#setInputValue(event))
    // Add event listener to clear the input field when the geocoder is cleared
    this.geocoder.on("clear", () => this.#clearInputValue())

    // Add the geocoder to the page
    this.geocoder.addTo(this.element)
  }

  #setInputValue(event) {
    // Set the value of the input field to the place name of the selected result
    this.addressTarget.value = event.result["place_name"]
  }

  #clearInputValue() {
    // Clear the value of the input field
    this.addressTarget.value = ""
  }

  disconnect() {
    // Remove the geocoder from the page
    this.geocoder.onRemove()
  }
}
