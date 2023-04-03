import { IPluginActions, registerPlugin } from "./plugin";

const plugin: IPluginActions<any, any, any> = {
  load() {
    console.log(`[${this.id}] Loaded`);
  },
  read(event: string, data: any) {
    if (event === "greet") {
      console.log(`[${this.name}] Received event "${event}" with data`, data);
      return "Hello, world!";
    }
    return undefined;
  },
  process(event: string, data: any) {
    console.log(`[${this.name}] Received event "${event}" with data`, data);
  },
};

registerPlugin(plugin);
