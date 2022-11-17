function noop$1() {}
function assign(tar, src) {
  // @ts-ignore
  for (const k in src) tar[k] = src[k];
  return tar;
}
function run(fn) {
  return fn();
}
function blank_object() {
  return Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === 'function';
}
function safe_not_equal(a, b) {
  return a != a
    ? b == b
    : a !== b || (a && typeof a === 'object') || typeof a === 'function';
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}
function get_slot_context(definition, ctx, $$scope, fn) {
  return definition[1] && fn
    ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
    : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    const lets = definition[2](fn(dirty));
    if ($$scope.dirty === undefined) {
      return lets;
    }
    if (typeof lets === 'object') {
      const merged = [];
      const len = Math.max($$scope.dirty.length, lets.length);
      for (let i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }
      return merged;
    }
    return $$scope.dirty | lets;
  }
  return $$scope.dirty;
}
function update_slot_base(
  slot,
  slot_definition,
  ctx,
  $$scope,
  slot_changes,
  get_slot_context_fn
) {
  if (slot_changes) {
    const slot_context = get_slot_context(
      slot_definition,
      ctx,
      $$scope,
      get_slot_context_fn
    );
    slot.p(slot_context, slot_changes);
  }
}
function get_all_dirty_from_scope($$scope) {
  if ($$scope.ctx.length > 32) {
    const dirty = [];
    const length = $$scope.ctx.length / 32;
    for (let i = 0; i < length; i++) {
      dirty[i] = -1;
    }
    return dirty;
  }
  return -1;
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy)
    ? action_result.destroy
    : noop$1;
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  if (node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function space() {
  return text(' ');
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function children(element) {
  return Array.from(element.childNodes);
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value, important ? 'important' : '');
  }
}

let current_component;
function set_current_component(component) {
  current_component = component;
}
function get_current_component() {
  if (!current_component)
    throw new Error('Function called outside component initialization');
  return current_component;
}
/**
 * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
 * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
 * it can be called from an external module).
 *
 * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
 *
 * https://svelte.dev/docs#run-time-svelte-onmount
 */
function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}
/**
 * Schedules a callback to run immediately before the component is unmounted.
 *
 * Out of `onMount`, `beforeUpdate`, `afterUpdate` and `onDestroy`, this is the
 * only one that runs inside a server-side component.
 *
 * https://svelte.dev/docs#run-time-svelte-ondestroy
 */
function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}
/**
 * Associates an arbitrary `context` object with the current component and the specified `key`
 * and returns that object. The context is then available to children of the component
 * (including slotted content) with `getContext`.
 *
 * Like lifecycle functions, this must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-setcontext
 */
function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
  return context;
}
/**
 * Retrieves the context that belongs to the closest parent component with the specified `key`.
 * Must be called during component initialisation.
 *
 * https://svelte.dev/docs#run-time-svelte-getcontext
 */
function getContext(key) {
  return get_current_component().$$.context.get(key);
}
// TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism
function bubble(component, event) {
  const callbacks = component.$$.callbacks[event.type];
  if (callbacks) {
    // @ts-ignore
    callbacks.slice().forEach((fn) => fn.call(this, event));
  }
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
  const saved_component = current_component;
  do {
    // first, call beforeUpdate functions
    // and update components
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length) binding_callbacks.pop()();
    // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach) block.d(1);
        callback();
      }
    });
    block.o(local);
  } else if (callback) {
    callback();
  }
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
      const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
      // if the component was destroyed immediately
      // it will update the `$$.on_destroy` reference to `null`.
      // the destructured on_destroy may still reference to the old array
      if (component.$$.on_destroy) {
        component.$$.on_destroy.push(...new_on_destroy);
      } else {
        // Edge case - component was destroyed immediately,
        // most likely as a result of a binding initialising
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[(i / 31) | 0] |= 1 << i % 31;
}
function init(
  component,
  options,
  instance,
  create_fragment,
  not_equal,
  props,
  append_styles,
  dirty = [-1]
) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = (component.$$ = {
    fragment: null,
    ctx: [],
    // state
    props,
    update: noop$1,
    not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(
      options.context || (parent_component ? parent_component.$$.context : [])
    ),
    // everything else
    callbacks: blank_object(),
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  });
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance
    ? instance(component, options.props || {}, (i, ret, ...rest) => {
        const value = rest.length ? rest[0] : ret;
        if ($$.ctx && not_equal($$.ctx[i], ($$.ctx[i] = value))) {
          if (!$$.skip_bound && $$.bound[i]) $$.bound[i](value);
          if (ready) make_dirty(component, i);
        }
        return ret;
      })
    : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  // `false` as a special case of no DOM component
  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
  if (options.target) {
    if (options.hydrate) {
      const nodes = children(options.target);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.l(nodes);
      nodes.forEach(detach);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }
    if (options.intro) transition_in(component.$$.fragment);
    mount_component(
      component,
      options.target,
      options.anchor,
      options.customElement
    );
    flush();
  }
  set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop$1;
  }
  $on(type, callback) {
    if (!is_function(callback)) {
      return noop$1;
    }
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1) callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
}

// Adapted from https://github.com/hperrin/svelte-material-ui/blob/master/packages/common/forwardEvents.js

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

function forwardEventsBuilder() {
  const component = get_current_component();

  return (node) => {
    const destructors = events.map((event) =>
      listen(node, event, (e) => bubble(component, e))
    );

    return {
      destroy: () => destructors.forEach((destroy) => destroy())
    };
  };
}

class RenderManager {
  constructor() {
    this.register = this.register.bind(this);
    this.unregister = this.unregister.bind(this);
    this.redraw = this.redraw.bind(this);
    this.resize = this.resize.bind(this);
    this.render = this.render.bind(this);

    this.currentLayerId = 0;
    this.setups = new Map();
    this.renderers = new Map();

    this.needsSetup = false;
    this.needsResize = true;
    this.needsRedraw = true;

    this.layerSequence = [];
  }

  redraw() {
    this.needsRedraw = true;
  }

  resize() {
    this.needsResize = true;
    this.needsRedraw = true;
  }

  register({ setup, render }) {
    if (setup) {
      this.setups.set(this.currentLayerId, setup);
      this.needsSetup = true;
    }

    this.renderers.set(this.currentLayerId, render);

    this.needsRedraw = true;
    return this.currentLayerId++;
  }

  unregister(layerId) {
    this.renderers.delete(layerId);
    this.needsRedraw = true;
  }

  render({ autoclear, pixelRatio, context, width, height }) {
    const renderProps = { context, width, height };

    if (this.needsResize) {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      this.needsResize = false;
    }

    if (this.needsSetup) {
      for (const [layerId, setup] of this.setups) {
        setup(renderProps);
        this.setups.delete(layerId);
      }

      this.needsSetup = false;
    }

    if (this.needsRedraw) {
      if (autoclear) {
        context.clearRect(0, 0, width, height);
      }

      for (const layerId of this.layerSequence) {
        this.renderers.get(layerId)(renderProps);
      }

      this.needsRedraw = false;
    }
  }
}

/* src/components/Canvas.svelte generated by Svelte v3.44.1 */

function create_fragment$1(ctx) {
  let canvas_1;
  let canvas_1_style_value;
  let canvas_1_width_value;
  let canvas_1_height_value;
  let t;
  let div;
  let current;
  let mounted;
  let dispose;
  const default_slot_template = /*#slots*/ ctx[13].default;
  const default_slot = create_slot(
    default_slot_template,
    ctx,
    /*$$scope*/ ctx[12],
    null
  );

  return {
    c() {
      canvas_1 = element('canvas');
      t = space();
      div = element('div');
      if (default_slot) default_slot.c();
      attr(
        canvas_1,
        'style',
        (canvas_1_style_value =
          'display: block; width: ' +
          /*width*/ ctx[1] +
          'px; height: ' +
          /*height*/ ctx[2] +
          'px;' +
          /*style*/ (ctx[3] ? ` ${/*style*/ ctx[3]}` : ''))
      );
      attr(
        canvas_1,
        'width',
        (canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0])
      );
      attr(
        canvas_1,
        'height',
        (canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0])
      );
      set_style(div, 'display', 'none');
    },
    m(target, anchor) {
      insert(target, canvas_1, anchor);
      /*canvas_1_binding*/ ctx[14](canvas_1);
      insert(target, t, anchor);
      insert(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      /*div_binding*/ ctx[15](div);
      current = true;

      if (!mounted) {
        dispose = action_destroyer(
          /*forwardEvents*/ ctx[6].call(null, canvas_1)
        );
        mounted = true;
      }
    },
    p(ctx, [dirty]) {
      if (
        !current ||
        (dirty & /*width, height, style*/ 14 &&
          canvas_1_style_value !==
            (canvas_1_style_value =
              'display: block; width: ' +
              /*width*/ ctx[1] +
              'px; height: ' +
              /*height*/ ctx[2] +
              'px;' +
              /*style*/ (ctx[3] ? ` ${/*style*/ ctx[3]}` : '')))
      ) {
        attr(canvas_1, 'style', canvas_1_style_value);
      }

      if (
        !current ||
        (dirty & /*width, pixelRatio*/ 3 &&
          canvas_1_width_value !==
            (canvas_1_width_value = /*width*/ ctx[1] * /*pixelRatio*/ ctx[0]))
      ) {
        attr(canvas_1, 'width', canvas_1_width_value);
      }

      if (
        !current ||
        (dirty & /*height, pixelRatio*/ 5 &&
          canvas_1_height_value !==
            (canvas_1_height_value = /*height*/ ctx[2] * /*pixelRatio*/ ctx[0]))
      ) {
        attr(canvas_1, 'height', canvas_1_height_value);
      }

      if (default_slot) {
        if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
          update_slot_base(
            default_slot,
            default_slot_template,
            ctx,
            /*$$scope*/ ctx[12],
            !current
              ? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
              : get_slot_changes(
                  default_slot_template,
                  /*$$scope*/ ctx[12],
                  dirty,
                  null
                ),
            null
          );
        }
      }
    },
    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(canvas_1);
      /*canvas_1_binding*/ ctx[14](null);
      if (detaching) detach(t);
      if (detaching) detach(div);
      if (default_slot) default_slot.d(detaching);
      /*div_binding*/ ctx[15](null);
      mounted = false;
      dispose();
    }
  };
}

const KEY = {};

function instance$1($$self, $$props, $$invalidate) {
  let { $$slots: slots = {}, $$scope } = $$props;
  let {
    width = 640,
    height = 640,
    pixelRatio = undefined,
    style = null,
    autoclear = true
  } = $$props;
  let canvas, context, animationLoop, layerRef, layerObserver;
  const forwardEvents = forwardEventsBuilder();
  const manager = new RenderManager();

  function redraw() {
    manager.redraw();
  }

  function getCanvas() {
    return canvas;
  }

  function getContext() {
    return context;
  }

  if (pixelRatio === undefined) {
    if (typeof window === 'undefined') {
      pixelRatio = 2;
    } else {
      pixelRatio = window.devicePixelRatio;
    }
  }

  function draw() {
    manager.render({
      context,
      width,
      height,
      pixelRatio,
      autoclear
    });

    animationLoop = window.requestAnimationFrame(draw);
  }

  setContext(KEY, {
    register: manager.register,
    unregister: manager.unregister,
    redraw: manager.redraw
  });

  onMount(() => {
    context = canvas.getContext('2d');
    layerObserver = new MutationObserver(getLayerSequence);
    layerObserver.observe(layerRef, { childList: true });
    getLayerSequence();
    draw();

    function getLayerSequence() {
      const sequence = [...layerRef.children].map(
        (layer) => +layer.dataset.layerId
      );
      $$invalidate(11, (manager.layerSequence = sequence), manager);
      manager.redraw();
    }
  });

  onDestroy(() => {
    if (typeof window === 'undefined') return;
    window.cancelAnimationFrame(animationLoop);
    layerObserver.disconnect();
  });

  function canvas_1_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      canvas = $$value;
      $$invalidate(4, canvas);
    });
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      layerRef = $$value;
      $$invalidate(5, layerRef);
    });
  }

  $$self.$$set = ($$props) => {
    if ('width' in $$props) $$invalidate(1, (width = $$props.width));
    if ('height' in $$props) $$invalidate(2, (height = $$props.height));
    if ('pixelRatio' in $$props)
      $$invalidate(0, (pixelRatio = $$props.pixelRatio));
    if ('style' in $$props) $$invalidate(3, (style = $$props.style));
    if ('autoclear' in $$props)
      $$invalidate(7, (autoclear = $$props.autoclear));
    if ('$$scope' in $$props) $$invalidate(12, ($$scope = $$props.$$scope));
  };

  $$self.$$.update = () => {
    if (
      $$self.$$.dirty & /*width, height, pixelRatio, autoclear, manager*/ 2183
    ) {
      manager.resize();
    }
  };

  return [
    pixelRatio,
    width,
    height,
    style,
    canvas,
    layerRef,
    forwardEvents,
    autoclear,
    redraw,
    getCanvas,
    getContext,
    manager,
    $$scope,
    slots,
    canvas_1_binding,
    div_binding
  ];
}

class Canvas extends SvelteComponent {
  constructor(options) {
    super();

    init(this, options, instance$1, create_fragment$1, safe_not_equal, {
      width: 1,
      height: 2,
      pixelRatio: 0,
      style: 3,
      autoclear: 7,
      redraw: 8,
      getCanvas: 9,
      getContext: 10
    });
  }

  get redraw() {
    return this.$$.ctx[8];
  }

  get getCanvas() {
    return this.$$.ctx[9];
  }

  get getContext() {
    return this.$$.ctx[10];
  }
}

/* src/components/Layer.svelte generated by Svelte v3.44.1 */

function create_fragment(ctx) {
  let div;

  return {
    c() {
      div = element('div');
      attr(div, 'data-layer-id', /*layerId*/ ctx[0]);
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p: noop$1,
    i: noop$1,
    o: noop$1,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}

function instance($$self, $$props, $$invalidate) {
  const { register, unregister, redraw } = getContext(KEY);

  let { setup = undefined, render = () => {} } = $$props;

  if (typeof setup !== 'function' && setup !== undefined) {
    throw new Error('setup must be a function');
  }

  if (typeof render !== 'function') {
    throw new Error('render must be a function');
  }

  const layerId = register({ setup, render });
  onDestroy(() => unregister(layerId));

  $$self.$$set = ($$props) => {
    if ('setup' in $$props) $$invalidate(1, (setup = $$props.setup));
    if ('render' in $$props) $$invalidate(2, (render = $$props.render));
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty & /*render*/ 4) {
      redraw();
    }
  };

  return [layerId, setup, render];
}

class Layer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance, create_fragment, safe_not_equal, {
      setup: 1,
      render: 2
    });
  }
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop$1) {
  let stop;
  const subscribers = new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        // store is ready
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe(run, invalidate = noop$1) {
    const subscriber = [run, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop$1;
    }
    run(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe };
}

let frame;

const now = Date.now();

function start(set) {
  set(Date.now() - now);

  frame = window.requestAnimationFrame(() => start(set));
  return () => window.cancelAnimationFrame(frame);
}

function noop() {}

var timer = readable(
  Date.now() - now,
  typeof window === 'undefined' ? noop : start
);

export { Canvas, Layer, timer as t };
