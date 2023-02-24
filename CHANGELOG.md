# 0.9.1

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
