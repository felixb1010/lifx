
import axios, { AxiosError } from "axios";
import { Api } from "./interfaces";

export async function SetLightState(selector: string, params: Api.lightStateParam, config: {}) {
    try{
        const result = await axios.put(`https://api.lifx.com/v1/lights/${selector ? selector : "all"}/state`, params, config)
        const data: Api.lightStateResult = result.data;
        if(data.results[0].status === "ok"){
            const returnData: Api.lightStateResult = result.data;
            return returnData;
        } else {
            throw new Error("Light "+data.results[0].status || "Error")
        }
    } catch(err){
       handleCommonError(err)
    }
}

export async function toggleLight(selector: string, params: Api.toggleLight, config: {}) {
    try{
        const result = await axios.post(`https://api.lifx.com/v1/lights/${selector ? selector : "all"}/toggle`, params, config)
        const data: Api.lightStateResult = result.data;
        if (data.results[0].status === "offline") {
                throw new Error("Light is offline");
        }
        if(result.status === 200 || 202 || 207){
            const returnData: Api.lightStateResult = result.data;
            return returnData;
        } else {
            const potentialErrorData: Api.Error = result.data;
            throw new Error(potentialErrorData.error || "Unknown error" + result.status);
        }
    } catch(err){
       handleCommonError(err)
    }
}

export async function FetchScenes(config: {}) {
    try{
        const result = await axios.get("https://api.lifx.com/v1/scenes", config)
        const data: Api.Scene[] = result.data;
        if(data.length === 0){
            throw new Error("No scenes found")
        }
        if(result.status === 200 || 202 || 207){
            const returnData: Api.Scene[] = result.data;
            return returnData;
        } else {
            const potentialErrorData: Api.Error = result.data;
            throw new Error(potentialErrorData.error || "Unknown error" + result.status);
        }
    } catch(err){
        handleCommonError(err)
    }
}

export async function SetScenes(scene_uuid: string, params: {}, config: {}) {
    try{
        const result = await axios.put(`https://api.lifx.com/v1/scenes/scene_id:${scene_uuid}/activate`, params, config)
        const data: Api.lightStateResult = result.data;
        if(data.results[0].status === "ok"){
            const returnData: Api.lightStateResult = result.data;
            return returnData;
        } else {
            throw new Error("Light "+data.results[0].status || "Error")
        }
    } catch(err){
       handleCommonError(err)
    }
}

function handleCommonError(err: any){
    if(err instanceof AxiosError){
        console.info(err.response?.data.error)
        throw new Error(err.response?.data.error || "Unknown error")
    } else if(err instanceof Error){
        throw new Error(err.message || "Unknown error")
    } else {
        throw new Error("Unexpected error")
    }
}