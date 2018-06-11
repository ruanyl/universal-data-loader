import { init, loadStart, loadSuccess, loadFailure } from '../src/DataLoaderState'

describe('DateLoaderState', () => {
  let state;
  beforeEach(() => {
    state = {}
  });

  it('init the state with a key', () => {
    const key = 'user'
    const expectedState = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    const initialState = init('user')(state)
    expect(initialState).toEqual(expectedState)
  })

  it('should update `loading` to true when load started', function() {
    const key = 'user'
    const expectedState = {
      user: {
        data: null,
        loading: true,
        error: null,
      }
    }
    const initialState = loadStart('user')(state)
    expect(initialState).toEqual(expectedState)
  });

  it('when load succeed, it should set `error` to null, `loading` to false, `data` to the actual value and `lastUpdateTime` to a timestamp', function() {
    const initialState = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    const payload = {
      key: 'user',
      data: { name: 'username' },
      lastUpdateTime: Date.now(),
    }
    const expectedState = {
      user: {
        data: payload.data,
        lastUpdateTime: payload.lastUpdateTime,
        error: null,
        loading: false,
      }
    }
    expect(loadSuccess(payload)(initialState)).toEqual(expectedState)
  });

  it('when load failed, it should set `error` to Error, `loading` to false, lastErrorTime to a timestamp', function() {
    const initialState = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    const payload = {
      key: 'user',
      lastErrorTime: Date.now(),
      error: new Error('error happened!'),
    }
    const expectedState = {
      user: {
        data: initialState.user.data,
        lastErrorTime: payload.lastErrorTime,
        error: payload.error,
        loading: false,
      }
    }
    expect(loadFailure(payload)(initialState)).toEqual(expectedState)
  });
});
