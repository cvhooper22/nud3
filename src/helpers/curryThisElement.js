export default function curryThisElement (method, theRealScopeWeWant) {
  return function curriedThisElementHandler (...args) {
    return method.apply(theRealScopeWeWant, [this, ...args]);
  };
}
