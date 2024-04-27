## 1.2.0

- Add `contextSettings` prop.
- Fix layer event handler typing.

## 1.1.2

- Correctly handle nine-argument `drawImage`.

## 1.1.1

- Rebuild package.

## 1.1.0

- Add `pixelRatio: 'auto'` setting.
- `preventDefault` is no longer called on touch events when `layerEvents={true}`.
- `e.detail.x`, `e.detail.y`, and `e.detail.originalEvent.target` are now set correctly on layer `mouseenter` and `mouseleave` events.

## 1.0.2

- Move `hit-canvas` to dependencies.

## 1.0.1

- Fix auto resizing.

## 1.0.0

- Add `autoplay` prop. When `true`, `Canvas` will re-render on every animation frame.
- Remove `t` export. Time since initialization can now be accessed through the `time` render prop.
- When `width` and `height` are unset, `Canvas` now fills its parent container.
- Add `Canvas` `on:resize` event.
- Use Svelte's `devicePixelRatio` binding.
- Move hit detection to [`hit-canvas`](https://npmjs.com/package/hit-canvas) library.
- New [documentation and examples](https://dnass.github.io/svelte-canvas).
- Support Svelte 4.

## 0.9.3

- Fix layer events and autoclear when transforms are applied to the canvas.

## 0.9.2

- Fix new layers not being observed.

## 0.9.1

- Fix layer events when `globalAlpha` and `drawImage` are used.
- Use `@sveltejs/package@2`.

## 0.9.0

- Add layer-level hit detection and event handling.

## 0.8.1

- Remove SvelteKit `browser` check.

## 0.8.0

- TypeScript support.
- New [demo site](https://dnass.github.io/svelte-canvas/).
- Add `class` prop to `Canvas` component. (h/t [LeoDog896](https://github.com/LeoDog896) for all changes)

## 0.7.0

- Remove `priority` prop from `Layer`. Layers are now guaranteed to render in the order they appear.
- Add license.
- Update examples.

## 0.6.1

- Improve render loop performance.

## 0.6.0

- Make components SSR-able.

## 0.5.2

- Add examples.

## 0.5.0

- Forward all DOM events from `Canvas` component.

## 0.4.0

- Add `style` prop to `Canvas`.
- Add `priority` prop to `Layer`.
- Make `autoclear` true by default.

## 0.3.0

- Handle more events.

## 0.2.2

- Fix resizing.

## 0.2.0

- Add `setup` prop to `Layer`.

## 0.1.0

- Initial release.
