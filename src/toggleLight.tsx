import { getPreferenceValues, showHUD } from "@raycast/api";
import { toggleLight } from "./lib/api";
import { Api } from "./lib/interfaces";

export default async function ToggleLight() {
  const preferences = getPreferenceValues();

  const config = {
    headers: {
      Authorization: "Bearer " + preferences.lifx_token,
    },
  };

  const body: Api.toggleLight = {
    duration: 1,
  };

  try{
    const response = await toggleLight("all", body, config);
    await showHUD("Succses" + response.results[0].status);
  } catch (error) {
    console.info(error);
    if(error instanceof Error) {
      await showHUD(error.message)
    } else {
      await showHUD("error not instance of Error")
    }
  } 

  return;
}
