"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/get-proto";
exports.ids = ["vendor-chunks/get-proto"];
exports.modules = {

/***/ "(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js":
/*!*********************************************************!*\
  !*** ./node_modules/get-proto/Object.getPrototypeOf.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\r\n\r\nvar $Object = __webpack_require__(/*! es-object-atoms */ \"(ssr)/./node_modules/es-object-atoms/index.js\");\r\n\r\n/** @type {import('./Object.getPrototypeOf')} */\r\nmodule.exports = $Object.getPrototypeOf || null;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL09iamVjdC5nZXRQcm90b3R5cGVPZi5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiO0FBQ0EsY0FBYyxtQkFBTyxDQUFDLHNFQUFpQjtBQUN2QztBQUNBLFdBQVcsbUNBQW1DO0FBQzlDIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEJlcm5hcmRvU2ltw7Vlc1xcdjItZHRhXFxkYXNoYm9hcmQtZ3VtbXktZnJvbnQtZW5kXFxub2RlX21vZHVsZXNcXGdldC1wcm90b1xcT2JqZWN0LmdldFByb3RvdHlwZU9mLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnZXMtb2JqZWN0LWF0b21zJyk7XHJcblxyXG4vKiogQHR5cGUge2ltcG9ydCgnLi9PYmplY3QuZ2V0UHJvdG90eXBlT2YnKX0gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IG51bGw7XHJcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js":
/*!**********************************************************!*\
  !*** ./node_modules/get-proto/Reflect.getPrototypeOf.js ***!
  \**********************************************************/
/***/ ((module) => {

eval("\r\n\r\n/** @type {import('./Reflect.getPrototypeOf')} */\r\nmodule.exports = (typeof Reflect !== 'undefined' && Reflect.getPrototypeOf) || null;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL1JlZmxlY3QuZ2V0UHJvdG90eXBlT2YuanMiLCJtYXBwaW5ncyI6IkFBQWE7QUFDYjtBQUNBLFdBQVcsb0NBQW9DO0FBQy9DIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEJlcm5hcmRvU2ltw7Vlc1xcdjItZHRhXFxkYXNoYm9hcmQtZ3VtbXktZnJvbnQtZW5kXFxub2RlX21vZHVsZXNcXGdldC1wcm90b1xcUmVmbGVjdC5nZXRQcm90b3R5cGVPZi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG4vKiogQHR5cGUge2ltcG9ydCgnLi9SZWZsZWN0LmdldFByb3RvdHlwZU9mJyl9ICovXHJcbm1vZHVsZS5leHBvcnRzID0gKHR5cGVvZiBSZWZsZWN0ICE9PSAndW5kZWZpbmVkJyAmJiBSZWZsZWN0LmdldFByb3RvdHlwZU9mKSB8fCBudWxsO1xyXG4iXSwibmFtZXMiOltdLCJpZ25vcmVMaXN0IjpbMF0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/get-proto/index.js":
/*!*****************************************!*\
  !*** ./node_modules/get-proto/index.js ***!
  \*****************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\r\n\r\nvar reflectGetProto = __webpack_require__(/*! ./Reflect.getPrototypeOf */ \"(ssr)/./node_modules/get-proto/Reflect.getPrototypeOf.js\");\r\nvar originalGetProto = __webpack_require__(/*! ./Object.getPrototypeOf */ \"(ssr)/./node_modules/get-proto/Object.getPrototypeOf.js\");\r\n\r\nvar getDunderProto = __webpack_require__(/*! dunder-proto/get */ \"(ssr)/./node_modules/dunder-proto/get.js\");\r\n\r\n/** @type {import('.')} */\r\nmodule.exports = reflectGetProto\r\n\t? function getProto(O) {\r\n\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\r\n\t\treturn reflectGetProto(O);\r\n\t}\r\n\t: originalGetProto\r\n\t\t? function getProto(O) {\r\n\t\t\tif (!O || (typeof O !== 'object' && typeof O !== 'function')) {\r\n\t\t\t\tthrow new TypeError('getProto: not an object');\r\n\t\t\t}\r\n\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\r\n\t\t\treturn originalGetProto(O);\r\n\t\t}\r\n\t\t: getDunderProto\r\n\t\t\t? function getProto(O) {\r\n\t\t\t\t// @ts-expect-error TS can't narrow inside a closure, for some reason\r\n\t\t\t\treturn getDunderProto(O);\r\n\t\t\t}\r\n\t\t\t: null;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZ2V0LXByb3RvL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFhO0FBQ2I7QUFDQSxzQkFBc0IsbUJBQU8sQ0FBQywwRkFBMEI7QUFDeEQsdUJBQXVCLG1CQUFPLENBQUMsd0ZBQXlCO0FBQ3hEO0FBQ0EscUJBQXFCLG1CQUFPLENBQUMsa0VBQWtCO0FBQy9DO0FBQ0EsV0FBVyxhQUFhO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXEJlcm5hcmRvU2ltw7Vlc1xcdjItZHRhXFxkYXNoYm9hcmQtZ3VtbXktZnJvbnQtZW5kXFxub2RlX21vZHVsZXNcXGdldC1wcm90b1xcaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIHJlZmxlY3RHZXRQcm90byA9IHJlcXVpcmUoJy4vUmVmbGVjdC5nZXRQcm90b3R5cGVPZicpO1xyXG52YXIgb3JpZ2luYWxHZXRQcm90byA9IHJlcXVpcmUoJy4vT2JqZWN0LmdldFByb3RvdHlwZU9mJyk7XHJcblxyXG52YXIgZ2V0RHVuZGVyUHJvdG8gPSByZXF1aXJlKCdkdW5kZXItcHJvdG8vZ2V0Jyk7XHJcblxyXG4vKiogQHR5cGUge2ltcG9ydCgnLicpfSAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9IHJlZmxlY3RHZXRQcm90b1xyXG5cdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xyXG5cdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXHJcblx0XHRyZXR1cm4gcmVmbGVjdEdldFByb3RvKE8pO1xyXG5cdH1cclxuXHQ6IG9yaWdpbmFsR2V0UHJvdG9cclxuXHRcdD8gZnVuY3Rpb24gZ2V0UHJvdG8oTykge1xyXG5cdFx0XHRpZiAoIU8gfHwgKHR5cGVvZiBPICE9PSAnb2JqZWN0JyAmJiB0eXBlb2YgTyAhPT0gJ2Z1bmN0aW9uJykpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdnZXRQcm90bzogbm90IGFuIG9iamVjdCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIEB0cy1leHBlY3QtZXJyb3IgVFMgY2FuJ3QgbmFycm93IGluc2lkZSBhIGNsb3N1cmUsIGZvciBzb21lIHJlYXNvblxyXG5cdFx0XHRyZXR1cm4gb3JpZ2luYWxHZXRQcm90byhPKTtcclxuXHRcdH1cclxuXHRcdDogZ2V0RHVuZGVyUHJvdG9cclxuXHRcdFx0PyBmdW5jdGlvbiBnZXRQcm90byhPKSB7XHJcblx0XHRcdFx0Ly8gQHRzLWV4cGVjdC1lcnJvciBUUyBjYW4ndCBuYXJyb3cgaW5zaWRlIGEgY2xvc3VyZSwgZm9yIHNvbWUgcmVhc29uXHJcblx0XHRcdFx0cmV0dXJuIGdldER1bmRlclByb3RvKE8pO1xyXG5cdFx0XHR9XHJcblx0XHRcdDogbnVsbDtcclxuIl0sIm5hbWVzIjpbXSwiaWdub3JlTGlzdCI6WzBdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/get-proto/index.js\n");

/***/ })

};
;