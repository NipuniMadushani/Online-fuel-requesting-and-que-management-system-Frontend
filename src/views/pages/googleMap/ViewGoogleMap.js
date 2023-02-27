// import React, { Component } from 'react';
// import { useEffect } from 'react';

// import React from 'react'

// class ViewGoogleMap extends Component {
//     render() {
//       return <h2>Hi, I am a Car!</h2>;
//     }
//   }

// // const ViewGoogleMap = () => {
// //     //   return (
// //     //     <div>

// //     //     </div>
// //     //   )
// //     // let map;
// //     // initMap();
// //     // function initMap() {
// //     //     map = new google.maps.Map(document.getElementById('map'), {
// //     //         center: { lat: 7.508712, lng: 80.572102 },
// //     //         zoom: 7.5
// //     //     });
// //     // }
// //     // getCoordinates();
// //     // function getCoordinates() {
// //     //     let address = 'Matugama';
// //     //     let assetCount = 5;
// //     //     var theUrl =
// //     //         'https://geocoder.ls.hereapi.com/6.2/geocode.json?searchtext=' +
// //     //         address +
// //     //         '&gen=9&apiKey=uuE6bkUWwubximzHSlm9pL4sNCPiVq0z5_v1tP_vXxw';
// //     //     var xmlHttp = new XMLHttpRequest();
// //     //     xmlHttp.open('GET', theUrl, false);
// //     //     xmlHttp.send(null);
// //     //     var json = JSON.parse(xmlHttp.responseText);
// //     //     var latitude = json.Response.View[0].Result[0].Location.DisplayPosition.Latitude;
// //     //     var longtude = json.Response.View[0].Result[0].Location.DisplayPosition.Longitude;
// //     //     console.log(typeof assetCount);
// //     //     var marker = new google.maps.Marker({
// //     //         position: { lat: latitude, lng: longtude },
// //     //         map,
// //     //         label: {
// //     //             text: assetCount.toString(),
// //     //             color: '#5e03fc',
// //     //             fontSize: '16px',
// //     //             fontWeight: 'bold',
// //     //             fontFamily: 'custom-label'
// //     //         },
// //     //         animation: google.maps.Animation.DROP,
// //     //         title: address
// //     //     });

// //     //     marker.addListener('click', toggleBounce);
// //     //     function toggleBounce() {
// //     //         if (marker.getAnimation() !== null) {
// //     //             marker.setAnimation(null);
// //     //         } else {
// //     //             marker.setAnimation(google.maps.Animation.BOUNCE);
// //     //         }
// //     //     }
// //     // }
// //     // useEffect(() => {
// //     //     const ifameData = document.getElementById('iframeId');
// //     //     // const lat = 1.305385;
// //     //     const lat = 7.508712;
// //     //     const lon = 80.572102;
// //     //     // const lon = 30.923029;
// //     //     ifameData.src = `https://maps.google.com/maps?q=${lat},${lon}&hl=es;&output=embed`;
// //     // });
// //     return (
// //         <div>
// //             <div>
// //                 {/* <%--&lt;%&ndash;<br>&ndash;%&gt;--%> */}
// //                 <div id="mapId">
// //                     <div id="map"></div>
// //                 </div>
// //             </div>

// //             {/* <script
// //                 src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDwMhBD5oxN2VV-6NEDdVGLTKRQYTglzgY&callback=initMap&libraries=&v=weekly"
// //                 async
// //             ></script> */}
// //             {/* <iframe id="iframeId" title="map" height="500px" width="100%"></iframe> */}
// //         </div>
// //     );
// // };

// export default ViewGoogleMap;

// // import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

// // export class ViewGoogleMap extends Component {
// //     render() {
// //         return (
// //             <Map google={this.props.google} zoom={14}>
// //                 <Marker onClick={this.onMarkerClick} name={'Current location'} />

// //                 <InfoWindow onClose={this.onInfoWindowClose}>
// //                     <div>{/* <h1>{this.state.selectedPlace.name}</h1> */}</div>
// //                 </InfoWindow>
// //             </Map>
// //         );
// //     }
// // }

// // export default GoogleApiWrapper({
// //     apiKey: 'AIzaSyCmlZj4mYFWhw5LZPMRTLZPThcO0qE5HCM'
// // })(ViewGoogleMap);
