import { dataLoaderReducer, init, loadStart, loadSuccess, loadFailure } from '../src/DataLoaderReducer'

describe('DataLoaderReducer', function() {
  let initialState = {}
  beforeEach(function() {
    initialState = {}
  });

  it('should init a state', function() {
    const action = init('user')
    const state = dataLoaderReducer(initialState, action)
    const expectedState = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    expect(state).toEqual(expectedState)
  });

  it('should init a state, and set `loading` to true', function() {
    const action1 = init('user')
    const state1 = dataLoaderReducer(initialState, action1)
    const expectedState1 = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    expect(state1).toEqual(expectedState1)

    const action2 = loadStart('user')
    const state2 = dataLoaderReducer(state1, action2)
    const expectedState2 = {
      user: {
        data: null,
        loading: true,
        error: null,
      }
    }
    expect(state2).toEqual(expectedState2)
  });

  it('should init a state, and update the state when load succeed', function() {
    const action1 = init('user')
    const state1 = dataLoaderReducer(initialState, action1)
    const expectedState1 = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    expect(state1).toEqual(expectedState1)

    const action2 = loadSuccess('user', { name: 'username' }, true)
    const state2 = dataLoaderReducer(state1, action2)
    const expectedState2 = {
      user: {
        data: { name: 'username' },
        loading: false,
        error: null,
        lastUpdateTime: action2.value.lastUpdateTime,
      }
    }
    expect(state2).toEqual(expectedState2)
  });

  it('should init a state, and update the state when load failed', function() {
    const action1 = init('user')
    const state1 = dataLoaderReducer(initialState, action1)
    const expectedState1 = {
      user: {
        data: null,
        loading: false,
        error: null,
      }
    }
    expect(state1).toEqual(expectedState1)

    const action2 = loadFailure('user', new Error('some error!'))
    const state2 = dataLoaderReducer(state1, action2)
    const expectedState2 = {
      user: {
        data: null,
        loading: false,
        error: action2.value.error,
        lastErrorTime: action2.value.lastErrorTime,
      }
    }
    expect(state2).toEqual(expectedState2)
  });

});

