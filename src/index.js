import snippet from './snippet';

const axios = require('axios').default;

const body = document.getElementsByTagName('body')[0];

// TEST CASE: script injection
const tag = document.createElement('script');
tag.src = 'https://code.jquery.com/jquery-3.4.1.slim.min.js';
body.appendChild(tag);

// TEST CASE: image injection
const img = document.createElement('img');
img.src = 'https://media.giphy.com/media/hVTouq08miyVo1a21m/giphy.gif';
body.appendChild(img);

// TEST CASE: one-time immediate XHR request
const runOnce = async () => {
  await axios.get('https://developer.mozilla.org');
};
runOnce();

// TEST CASE: repeating + delayed XHR request
setInterval(async () => {
  await axios.get('https://www.google.com').data;
}, 3000);

const fs = () => window[window._fs_namespace];

const ensureSnippetLoaded = () => {
  const snippetLoaded = !!fs();
  if (!snippetLoaded) {
    throw Error('FullStory is not loaded, please ensure the init function is invoked before calling FullStory API functions');
  }
};

const hasFullStoryWithFunction = (...testNames) => {
  ensureSnippetLoaded();
  return testNames.every(current => fs()[current]);
};

const wrapFunction = name => (...args) => {
  if (hasFullStoryWithFunction(name)) {
    return fs()[name](...args);
  }
  console.warn(`FS.${name} not ready`); // eslint-disable-line no-console
  return null;
};

const wrappedFS = ['event', 'log', 'getCurrentSessionURL', 'identify', 'setUserVars', 'consent', 'shutdown', 'restart'].reduce((acc, current) => {
  acc[current] = wrapFunction(current);
  return acc;
}, {});

const init = (options) => {
  if (fs()) {
    // eslint-disable-next-line no-console
    console.warn('The FullStory snippet has already been defined elsewhere (likely in the <head> element)');
    return;
  }

  snippet(options);
};

const initOnce = (fn, message) => (...args) => {
  if (window._fs_initialized) {
    // eslint-disable-next-line no-console
    if (message) console.warn(message);
    return;
  }
  fn(...args);
  window._fs_initialized = true;
};

wrappedFS.init = initOnce(init, 'FullStory init has already been called once, additional invocations are ignored');
wrappedFS.anonymize = () => wrappedFS.identify(false);

export default wrappedFS;
