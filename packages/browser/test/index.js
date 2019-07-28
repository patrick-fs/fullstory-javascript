import * as FullStory from '../src';

describe('core', () => {
  it('should define snippet functions', () => {
    const functions = ['event',
      'log',
      'getCurrentSessionURL',
      'identify',
      'setUserVars',
      'consent',
      'shutdown',
      'restart'];

    functions.forEach(i => assert(typeof FullStory[i] === 'function', `${i} has not been exported from the FullStory module`));
  });
});

describe('init', () => {
  it('should add _fs_org value to window object', () => {
    FullStory.init('123');
    assert(window._fs_org === '123');
  });
});