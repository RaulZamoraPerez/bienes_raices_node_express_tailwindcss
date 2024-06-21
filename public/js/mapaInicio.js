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

/***/ "./src/js/mapaInicio.js":
/*!******************************!*\
  !*** ./src/js/mapaInicio.js ***!
  \******************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function(){\r\n    const lat =  18.8154729;\r\n    const lng = -97.5095447;\r\n    const mapa = L.map('mapa-inicio').setView([lat, lng ], 10);//1l 10 es el zoom\r\n\r\n   let markers = new L.FeatureGroup().addTo(mapa)\r\n  \r\n   let  propiedades = [];\r\n\r\n   //filttros de busqueda\r\n     const filtros={\r\n        categoria:\"\",\r\n        precio:\"\"\r\n     }\r\n     const categoriasSelect= document.querySelector('#categorias')\r\n     const preciossSelect= document.querySelector('#precios')\r\n\r\n    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\r\n        attribution: '&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors'\r\n    }).addTo(mapa);\r\n  \r\n       categoriasSelect.addEventListener('change', e=>{\r\n        filtros.categoria = +e.target.value\r\n        filtrarPropiedades();\r\n      \r\n       })\r\n       \r\n       preciossSelect.addEventListener('change', e=>{\r\n        filtros.precio= +e.target.value\r\n        filtrarPropiedades()\r\n     \r\n       })\r\n\r\n\r\n    const obtenerPropiedes = async () => {\r\n        try {\r\n              const url = '/api/propiedades';\r\n              const respuesta  = await fetch(url);\r\n              console.log(respuesta)\r\n              propiedades = await respuesta.json()\r\n           \r\n              mostrarPropiedades(propiedades)\r\n\r\n        } catch (error) {\r\n            console.log(error)\r\n        }\r\n    }\r\n\r\n    const mostrarPropiedades = propiedades=>{\r\n        //limpiar los markers previos\r\n        markers.clearLayers()\r\n\r\n        propiedades.forEach(propiedad => {\r\n            //agregar un pin \r\n            const marker = new L.marker([propiedad?.lat, propiedad?.lng ], {\r\n                autoPan: true// cuando de click en el marker  va a centrarse la vista\r\n        })\r\n        .addTo(mapa)\r\n        .bindPopup(`\r\n            <p class=\"text-indigo-600 font-bold\">${propiedad.categoria.nombre}</p>\r\n            <h1 class=\"text-xl font-extrabold uppercase my-2 \">${propiedad?.titulo}</h1>\r\n            <img src=\"/uploads/${propiedad?.imagen}\" alt=\"${propiedad?.titulo}\">\r\n            <p class=\"text-gray-600 font-bold\">${propiedad.precio.nombre}</p>\r\n            <a href=\"/propiedad/${propiedad.id}\" class=\"bg-indigo-600 block p-2 text-center font-bold uppercase text-white \">Ver propiedad</a>\r\n          \r\n        `)\r\n\r\n\r\n        markers.addLayer(marker)\r\n        \r\n    })\r\n}\r\n  const filtrarPropiedades = ()=>{\r\n     const resultado = propiedades.filter(filtrarCategoria ).filter(filtrarPrecio)\r\n     mostrarPropiedades(resultado)\r\n  }\r\n\r\n  const filtrarCategoria =propiedad=>filtros.categoria ? propiedad.categoriaId ===filtros.categoria : propiedad //retorna  \r\n\r\n  const filtrarPrecio =propiedad=>filtros.precio ? propiedad.precioId ===filtros.precio : propiedad\r\n\r\n\r\n    obtenerPropiedes()\r\n})()\r\n\r\n/**\r\n\r\nel de filtrarcategoria sirve para \r\nSi tiene algo pues vamos a iterar sobre el objeto de propiedad, que recuerda es el que tenia aquí cda uno de los elementos del arreglo de propiedades\r\n\r\nAsi que pones  eso , y pues si hay algo en el filtro pues vamos a a filtrar las propiedess que tengan esa categoríaId  por ejemplo que tengan el id 5\r\n\r\n */\r\n\r\n/*\r\nSi filtros.categoria tiene un valor (es decir, no es null o undefined o algún valor falsy):\r\nLa función comprueba si propiedad.categoriaId es igual a filtros.categoria.\r\nSi la condición se cumple (es decir, propiedad.categoriaId === filtros.categoria es true), la propiedad se incluye en el resultado.\r\nSi no se cumple, la propiedad se excluye del resultado.\r\nSi filtros.categoria no tiene un valor (es falsy):\r\nLa función devuelve la propiedad tal cual, lo que en el contexto de filter significa que no se aplica ningún filtro y la propiedad se incluye en el resultado.\r\n*/\n\n//# sourceURL=webpack://primerproyecto/./src/js/mapaInicio.js?");

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
/******/ 	__webpack_modules__["./src/js/mapaInicio.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;