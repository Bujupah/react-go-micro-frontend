(window as any)["plugins"] = (window as any)["plugins"] || {};

export interface IPluginActions<L, R, P> {
  load(): L;
  read(event: string, data: any): R;
  process(event: string, data: any): P;
}

export interface IPlugin<L, R, P> extends IPluginActions<L, R, P> {
  id: string;
  name: string;
  version: string;
  description?: string;
}

export interface Plugin<L, R, P> {
  id: string;
  name: string;
  version: string;
  description: string;
  plugin: IPluginActions<L, R, P>;
}

export const registerPlugin = (plugin: IPluginActions<any, any, any>) => {
  const _plugin: IPlugin<any, any, any> = {
    ...require("./plugin.json"),
    ...plugin,
  };

  (window as any)["plugins"][_plugin.id] = _plugin;
};
