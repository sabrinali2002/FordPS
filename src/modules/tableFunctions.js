import trims from "../jsons/trims.json";

const modelOptionsFromJson = Object.keys(trims).map((model) => ({ value: model, label: model }));

export const modelOptions=[{ value: "no model", label: "Select Model" }, ...modelOptionsFromJson]

export function getTrimOptions(selectedModel){
    const trimOptions = selectedModel === "" || selectedModel === "no model" ? [{ value: "no trim", label: "Select A Model First" }] : trims[selectedModel].map((trim) => ({ value: trim, label: trim }));
    if (trimOptions[0].value !== "no trim") {
        trimOptions.unshift({ value: "all trim", label: "View All Trims" });
    }
    return trimOptions;
}