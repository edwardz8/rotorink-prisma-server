"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logError = void 0;
const logError = (message, error) => {
    console.error(`[${message}]`, error?.stack);
};
exports.logError = logError;
