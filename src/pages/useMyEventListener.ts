import { useEffect } from 'react';

type Options = {
  target?: any;
  capture?: boolean;
  once?: boolean;
  passive?: boolean;
};

const useMyEventListener = (
  eventName: string,
  handler: (ev: Event) => void,
  options?: Options
) => {
  const {
    target = window,
    passive,
    once,
    capture
  } = Object.assign({}, options);
  useEffect(() => {
    let dom = target;
    if (typeof target === 'function') {
      dom = target();
    } else if (target.current) {
      dom = target.current;
    }
    dom.addEventListener(eventName, handler, {
      passive,
      once,
      capture
    });
    return () => {
      dom.removeEventListener(eventName, handler, {
        passive,
        once,
        capture
      });
    };
  }, [capture, eventName, handler, once, passive, target]);
};
export default useMyEventListener;
