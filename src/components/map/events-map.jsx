import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';
import { css } from 'emotion';


const latLng = (object) => {
  return {
    name: object.name,
    description: object.description,
    datetime: object.datetime,
    point : {
      lat: object.lat,
      lng: object.lng
    },
    id: object.id

  }
}


export class EventMap extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mapData: [],
      showingInfoWindow: false,
      selectedPlace: {},
      name: '',
      description: '',
      datetime: '',
      loading: true
    }
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/event_maps')
      .then((response) => {
        const data = response.data;
        console.log("data is", data)
        const oldMapData = this.state.mapData
        const newMapData = []
        data.forEach((location) => {
          newMapData.push(latLng(location))
        })
        this.setState( {mapData: [...newMapData, ...oldMapData], loading: false} )
      })
  }

  onMarkerClick = (props, marker, event) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {
    console.log("this.state.selectedPlace",this.state.selectedPlace);
    const generateMapMarkers = this.state.mapData.map ((marker, index) => {
      return <Marker position={marker.point} key={index} onClick={this.onMarkerClick} name={marker.name}/>
    })

    const myPlacesArray = this.state.mapData;
    const mapInfos = !myPlacesArray ? null : myPlacesArray.filter(event => event.name === this.state.selectedPlace.name).map((mapInfo) => {
      let date = mapInfo.datetime;
      let splitDate = date.split('T')
      let dateStr = splitDate.slice(0,1);
      let timeStr = splitDate.slice(1,2);
      let splitTimeStr = timeStr[0].split('.');
      let time = splitTimeStr[0];
      let timeResult = dateStr + " " + time;
      return (
        <div>
          <h3>{mapInfo.name }</h3>
          <p>{mapInfo.description }</p>
          <p>{timeResult}</p>
        </div>
      )
    });

    return (
      <div className="eventsMap">
        <h2>Nearby Events:</h2>
        <Map google={this.props.google} zoom={16} initialCenter={{lat: 43.6446002, lng: -79.3951586}}>
          {generateMapMarkers}
          <InfoWindow onClose={this.onInfoWindowClose} marker={this.state.activeMarker} visible={this.state.showingInfoWindow}>
            <div>
              {mapInfos}
            </div>
          </InfoWindow>
        </Map>
      </div>
  )}
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(EventMap)

/*
const myPlaces = this.state.mapData
const toRender = myPlaces.map()
*/



