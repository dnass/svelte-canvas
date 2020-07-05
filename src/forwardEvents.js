// Adapted from https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js
import { bubble, listen, current_component } from 'svelte/internal';

// prettier-ignore
const events = [
    'focus', 'blur',
    'fullscreenchange', 'fullscreenerror', 'scroll',
    'cut', 'copy', 'paste',
    'keydown', 'keypress', 'keyup',
    'auxclick', 'click', 'contextmenu', 'dblclick',
    'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
    'pointerlockchange', 'pointerlockerror', 'select', 'wheel',
    'drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop',
    'touchcancel', 'touchend', 'touchmove', 'touchstart',
    'pointerover', 'pointerenter', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerout', 'pointerleave', 
    'gotpointercapture', 'lostpointercapture'
  ];

export default function forwardEventsBuilder() {
  const component = current_component;

  return node => {
    const destructors = events.map(event =>
      listen(node, event, e => bubble(component, e))
    );

    return {
      destroy: () => destructors.forEach(destroy => destroy())
    };
  };
}
