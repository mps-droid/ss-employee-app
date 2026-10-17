import {
  CommonActions,
  createNavigationContainerRef,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Used outside React components, e.g. when the API reports an expired session.
export const resetTo = routeName => {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(
    CommonActions.reset({ index: 0, routes: [{ name: routeName }] }),
  );
};
