const fs = () => window[window._fs_namespace];

const ensureSnippetLoaded = () => {
  const snippetLoaded = !!fs();
  if (!snippetLoaded) {
    throw Error('FullStory is not loaded, please ensure the FullStory snippet is executed before calling FullStory API functions');
  }
  return true;
};

const hasFullStoryWithFunction = (...testNames) => {
  const functionsCreated = () => testNames.reduce((acc, current) => acc && fs()[current], true);
  return ensureSnippetLoaded() && functionsCreated();
};

const wrapFunction = name => (...params) => {
  if (hasFullStoryWithFunction(name)) {
    return fs()[name](...params);
  }
  console.warn(`FS.${name} not ready`); // eslint-disable-line no-console
  return null;
};

const wrappedFS = ['event', 'log', 'getCurrentSessionURL', 'identify', 'setUserVars', 'consent', 'shutdown', 'restart'].reduce((acc, current) => {
  acc[current] = wrapFunction(current);
  return acc;
}, {});

const { event } = wrappedFS;
const { log } = wrappedFS;
const { getCurrentSessionURL } = wrappedFS;
const { identify } = wrappedFS;
const { setUserVars } = wrappedFS;
const { consent } = wrappedFS;
const { shutdown } = wrappedFS;
const { restart } = wrappedFS;

export {
  event,
  log,
  getCurrentSessionURL,
  identify,
  setUserVars,
  consent,
  shutdown,
  restart,
};
