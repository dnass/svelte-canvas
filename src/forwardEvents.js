import { bubble, listen } from 'svelte/internal';

// From https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js

export default function forwardEventsBuilder(component) {
  const events = [
    'focus',
    'blur',
    'fullscreenchange',
    'fullscreenerror',
    'scroll',
    'cut',
    'copy',
    'paste',
    'keydown',
    'keypress',
    'keyup',
    'auxclick',
    'click',
    'contextmenu',
    'dblclick',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseover',
    'mouseout',
    'mouseup',
    'pointerlockchange',
    'pointerlockerror',
    'select',
    'wheel',
    'drag',
    'dragend',
    'dragenter',
    'dragstart',
    'dragleave',
    'dragover',
    'drop',
    'touchcancel',
    'touchend',
    'touchmove',
    'touchstart',
    'pointerover',
    'pointerenter',
    'pointerdown',
    'pointermove',
    'pointerup',
    'pointercancel',
    'pointerout',
    'pointerleave',
    'gotpointercapture',
    'lostpointercapture'
  ];

  return node => {
    const destructors = events.map(event =>
      listen(node, event, e => bubble(component, e))
    );

    return {
      destroy: () => destructors.forEach(destroy => destroy())
    };
  };
}
