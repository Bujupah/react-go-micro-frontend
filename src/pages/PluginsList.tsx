import { FC, useEffect } from "react";
import { usePluginContext } from "../contexts/PluginContext";

export const PluginsList: FC = () => {
  const { loading, plugins } = usePluginContext();

  useEffect(() => {
    console.log("From plugin list", plugins);
  }, [loading]);

  return (
    <>
      {plugins.map((e) => {
        return (
          <div
            key={e.id}
            onClick={(_) => {
              (e as any).plugin.process("Test", "somedata");
            }}
          >
            <div>{e.name}</div>
            <div>{e.description}</div>
            <div>{e.version}</div>
          </div>
        );
      })}
    </>
  );
};
