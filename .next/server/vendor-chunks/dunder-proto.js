"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/dunder-proto";
exports.ids = ["vendor-chunks/dunder-proto"];
exports.modules = {

/***/ "(ssr)/./node_modules/dunder-proto/get.js":
/*!******************************************!*\
  !*** ./node_modules/dunder-proto/get.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\r\n\r\nvar callBind = __webpack_require__(/*! call-bind-apply-helpers */ \"(ssr)/./node_modules/call-bind-apply-helpers/index.js\");\r\nvar gOPD = __webpack_require__(/*! gopd */ \"(ssr)/./node_modules/gopd/index.js\");\r\n\r\nvar hasProtoAccessor;\r\ntry {\r\n\t// eslint-disable-next-line no-extra-parens, no-proto\r\n\thasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */ ([]).__proto__ === Array.prototype;\r\n} catch (e) {\r\n\tif (!e || typeof e !== 'object' || !('code' in e) || e.code !== 'ERR_PROTO_ACCESS') {\r\n\t\tthrow e;\r\n\t}\r\n}\r\n\r\n// eslint-disable-next-line no-extra-parens\r\nvar desc = !!hasProtoAccessor && gOPD && gOPD(Object.prototype, /** @type {keyof typeof Object.prototype} */ ('__proto__'));\r\n\r\nvar $Object = Object;\r\nvar $getPrototypeOf = $Object.getPrototypeOf;\r\n\r\n/** @type {import('./get')} */\r\nmodule.exports = desc && typeof desc.get === 'function'\r\n\t? callBind([desc.get])\r\n\t: typeof $getPrototypeOf === 'function'\r\n\t\t? /** @type {import('./get')} */ function getDunder(value) {\r\n\t\t\t// eslint-disable-next-line eqeqeq\r\n\t\t\treturn $getPrototypeOf(value == null ? value : $Object(value));\r\n\t\t}\r\n\t\t: false;\r\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvZHVuZGVyLXByb3RvL2dldC5qcyIsIm1hcHBpbmdzIjoiQUFBYTtBQUNiO0FBQ0EsZUFBZSxtQkFBTyxDQUFDLHNGQUF5QjtBQUNoRCxXQUFXLG1CQUFPLENBQUMsZ0RBQU07QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0NBQXNDO0FBQ3ZFLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyRUFBMkUsK0JBQStCO0FBQzFHO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVyxpQkFBaUI7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzIjpbIkM6XFxVc2Vyc1xcQmVybmFyZG9TaW3DtWVzXFx2Mi1kdGFcXGRhc2hib2FyZC1ndW1teS1mcm9udC1lbmRcXG5vZGVfbW9kdWxlc1xcZHVuZGVyLXByb3RvXFxnZXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGNhbGxCaW5kID0gcmVxdWlyZSgnY2FsbC1iaW5kLWFwcGx5LWhlbHBlcnMnKTtcclxudmFyIGdPUEQgPSByZXF1aXJlKCdnb3BkJyk7XHJcblxyXG52YXIgaGFzUHJvdG9BY2Nlc3NvcjtcclxudHJ5IHtcclxuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZXh0cmEtcGFyZW5zLCBuby1wcm90b1xyXG5cdGhhc1Byb3RvQWNjZXNzb3IgPSAvKiogQHR5cGUge3sgX19wcm90b19fPzogdHlwZW9mIEFycmF5LnByb3RvdHlwZSB9fSAqLyAoW10pLl9fcHJvdG9fXyA9PT0gQXJyYXkucHJvdG90eXBlO1xyXG59IGNhdGNoIChlKSB7XHJcblx0aWYgKCFlIHx8IHR5cGVvZiBlICE9PSAnb2JqZWN0JyB8fCAhKCdjb2RlJyBpbiBlKSB8fCBlLmNvZGUgIT09ICdFUlJfUFJPVE9fQUNDRVNTJykge1xyXG5cdFx0dGhyb3cgZTtcclxuXHR9XHJcbn1cclxuXHJcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1leHRyYS1wYXJlbnNcclxudmFyIGRlc2MgPSAhIWhhc1Byb3RvQWNjZXNzb3IgJiYgZ09QRCAmJiBnT1BEKE9iamVjdC5wcm90b3R5cGUsIC8qKiBAdHlwZSB7a2V5b2YgdHlwZW9mIE9iamVjdC5wcm90b3R5cGV9ICovICgnX19wcm90b19fJykpO1xyXG5cclxudmFyICRPYmplY3QgPSBPYmplY3Q7XHJcbnZhciAkZ2V0UHJvdG90eXBlT2YgPSAkT2JqZWN0LmdldFByb3RvdHlwZU9mO1xyXG5cclxuLyoqIEB0eXBlIHtpbXBvcnQoJy4vZ2V0Jyl9ICovXHJcbm1vZHVsZS5leHBvcnRzID0gZGVzYyAmJiB0eXBlb2YgZGVzYy5nZXQgPT09ICdmdW5jdGlvbidcclxuXHQ/IGNhbGxCaW5kKFtkZXNjLmdldF0pXHJcblx0OiB0eXBlb2YgJGdldFByb3RvdHlwZU9mID09PSAnZnVuY3Rpb24nXHJcblx0XHQ/IC8qKiBAdHlwZSB7aW1wb3J0KCcuL2dldCcpfSAqLyBmdW5jdGlvbiBnZXREdW5kZXIodmFsdWUpIHtcclxuXHRcdFx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVxZXFlcVxyXG5cdFx0XHRyZXR1cm4gJGdldFByb3RvdHlwZU9mKHZhbHVlID09IG51bGwgPyB2YWx1ZSA6ICRPYmplY3QodmFsdWUpKTtcclxuXHRcdH1cclxuXHRcdDogZmFsc2U7XHJcbiJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOlswXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/dunder-proto/get.js\n");

/***/ })

};
;