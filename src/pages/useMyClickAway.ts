import { useEventListener } from 'ahooks';

type Target = any;
type DocumentEventKey = keyof DocumentEventMap;

function useMyClickAway<T extends Event = Event>(
  onClickAway: (event: T) => void,
  target: Target,
  eventName: any = 'click'
) {
  useEventListener(eventName, (e) => {
    let dom = target;
    if (typeof target === 'function') {
      dom = target();
    } else if (target.current) {
      dom = target.current;
    }
    if (!dom.contains(e.target)) {
      onClickAway(e);
    }
  });
}

export default useMyClickAway;
