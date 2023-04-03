// Should make this a separate package cause it is used by both the master app and its plugins

export interface IPlugin {
  name: string;
  version: string;
  description: string;
  load(): void;
  read(event: string, data: any): any;
  process(event: string, data: any): void;
}

export interface Plugin {
  name: string;
  version: string;
  description: string;
  plugin: IPlugin;
}

export interface PluginDefinition {
  name: string;
  modulePath: string;
}

export class PluginManager {
  private plugins: Plugin[] = [];

  async loadPlugins(pluginDefinitions: PluginDefinition[]) {
    this.plugins = await Promise.all(
      pluginDefinitions.map(async (pluginDefinition) => {
        const { name, modulePath } = pluginDefinition;
        const plugin = (await this.loadPluginFromUrl(modulePath)) as IPlugin;
        if (!plugin) {
          throw new Error(
            `Plugin ${name} does not implement the required interface`
          );
        }

        plugin.load();
        return {
          name,
          version: plugin.version,
          description: plugin.description,
          plugin,
        };
      })
    );
  }

  loadPluginFromUrl = async (url: string): Promise<IPlugin> => {
    const script = document.createElement("script");
    script.src = url;
    script.type = "module";

    const scriptLoaded = new Promise((resolve, reject) => {
      script.onload = () => resolve("Loaded");
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
    });

    document.head.appendChild(script);
    await scriptLoaded;

    const plugin = (window as any).myPlugin as IPlugin;
    if (!plugin) {
      throw new Error(`Plugin not found in global scope: ${url}`);
    }

    return plugin;
  };

  read(event: string, data: any) {
    for (const plugin of this.plugins) {
      const result = plugin.plugin.read(event, data);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  process(event: string, data: any) {
    for (const plugin of this.plugins) {
      plugin.plugin.process(event, data);
    }
  }

  getPlugins(): Plugin[] {
    return this.plugins;
  }
}
