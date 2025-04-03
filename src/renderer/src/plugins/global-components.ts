import type { App } from 'vue'
import components from '~/components.js';

export default function registerGlobalComponents (app: App): void {
  const componentsObject = components as { [key: string]: any };
  for (const prop in componentsObject) {
    if (components.hasOwnProperty(prop)) {
      const component = componentsObject[prop];
      app.component(component.name, component);
    }
  }
}
