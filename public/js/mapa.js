/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/mapa.js":
/*!************************!*\
  !*** ./src/js/mapa.js ***!
  \************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function() {\r\n \r\n    const lat = document.querySelector('#lat').value || 18.8154729;\r\n    const lng = document.querySelector('#lng').value || -97.5095447;\r\n    const mapa = L.map('mapa').setView([lat, lng ], 10);//1l 10 es el zoom\r\n    let marker;\r\n\r\n//utilizar provider y geocoder\r\nconst geocodeService = L.esri.Geocoding.geocodeService();//obtener nombre de calle por coordenadas\r\n\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n  \r\n    //El Pin\r\n    marker = new L.marker([lat, lng],{\r\n        draggable:true,// poderlo mover el pin \r\n        autoPan:true // una vez que muevas el pin se vuelve a centrar el mapa, va siguiendo el mapa\r\n    })\r\n    .addTo(mapa)//instancia del mapa, agregas el pin a ese mapa\r\n\r\n\r\n    //detectar el movimiento del Pin\r\n\r\n    marker.on('moveend',function(e){//evento llamado moveend cuando mueves y sueltas el pin\r\n          marker = e.target  //el target el elemento que estamos moviendo\r\n          console.log(marker)\r\n           const posicion = marker.getLatLng();\r\n           console.log(posicion)\r\n\r\n           mapa.panTo(new L.LatLng(posicion.lat, posicion.lng))\r\n\r\n\r\n\r\n           //oBtener informacion de las calles al soltar el pin\r\n           geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado){\r\n                         //console.log(resultado)\r\n\r\n                        marker.bindPopup(resultado.address.LongLabel)\r\n\r\n\r\n                        //LENNAR LOS CAMPOS\r\n                        document.querySelector('.calle').textContent=resultado?.address?.Address ?? '';\r\n                        document.querySelector('#calle').value=resultado?.address?.Address ?? '';\r\n                        document.querySelector('#lat').value=resultado?.latlng?.lat ?? '';\r\n                        document.querySelector('#lng').value=resultado?.latlng?.lng ?? '';\r\n           })\r\n    })\r\n})()\n\n//# sourceURL=webpack://primerproyecto/./src/js/mapa.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/mapa.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;