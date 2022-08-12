import { ActionPanel, Cache, List, Action, showToast, Toast } from "@raycast/api";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Command() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const cache = new Cache();


  let config = {
    headers: {
      'Authorization':'Bearer c7d0879d0ac5c1b006d9cfd4c587f97af404f15870042e03408f6a4b759f8d86'
    }
  }

  function fetchLights() {
    if (cache.isEmpty){

    } else {
      setData(JSON.parse(cache.get("lights")));
      setIsLoading(false);
    }
    axios.get("https://api.lifx.com/v1/lights/all", config)
    .then(res => {
      console.log(res.data);
      setData(res.data)
      setIsLoading(false)
      cache.set("lights", JSON.stringify(res.data));
    })
    .catch(err => {
      console.log(err.response);
    })
  }

  async function setLightState(id: string) {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Setting light state",
    });
    axios.put("https://api.lifx.com/v1/lights/all/state", {}, config).then(res => {
      console.log(res);
      toast.style = Toast.Style.Success;
      toast.title = "Light state updated";
    }).catch(err => {
      console.log(err.response.data);
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to toggle light";
      toast.message = err.response.data.error;
    })
  }

  async function togglePowerLight(id: string) {
    const toast = await showToast({
      style: Toast.Style.Animated,
      title: "Toggling light",
    });
    axios.post(`https://api.lifx.com/v1/lights/${id}/toggle`, {}, config)
    .then(res => {
      console.log(res.data);
      toast.style = Toast.Style.Success;
      toast.title = "Light " + res.data.results[0].power
    })
    .catch(err => {
      console.log(err.response);
      toast.style = Toast.Style.Failure;
      toast.title = "Failed to toggle light";
      toast.message = err.response.data.error;
    })
  }

  useEffect(() => {
    fetchLights();
  }, [])

  return (
    <List isLoading={isLoading} navigationTitle="Lights">
      {(data.length === 0) ? (
        <List.EmptyView
          icon="list-icon.png"
          title="No lights found"
        />
      ) : (
        data.map((light, index) => (
          <List.Item
            key={index}
            icon="list-icon.png"
            title={light.label}
            actions={
              <ActionPanel>
                <Action title="Toggle power" onAction={() => togglePowerLight(light.id)} />
                <Action title="Set state" onAction={() => setLightState(light.id)} />
              </ActionPanel>
            }
          />
        ))
      )}
    </List>
  );
}
