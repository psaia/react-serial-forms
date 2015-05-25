import jsdom from 'jsdom';

global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = document.parentWindow;

// https://github.com/facebook/react/issues/3863
global.navigator = {
  userAgent: 'node.js'
};
