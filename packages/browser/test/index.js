import { assert } from 'chai';
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

    functions.forEach(i => assert(typeof FullStory[i] === 'function'));
  });
});
