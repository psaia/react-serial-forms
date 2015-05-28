/**
 * Copyright 2015, Lev Interactive, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @module ValidationError
 */
export default class ValidationError extends Error {
  constructor(message) {
    super();
    Object.defineProperty(this, 'message', {
      value: message
    });
  }
  get name() {
    return 'ValidationError';
  }
}
