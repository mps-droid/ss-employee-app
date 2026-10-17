import { base } from "../../Api/Constants";
import { apiService, apiServiceNewFormate } from "./Constants";

export const userRegisterAuthentication = (data) => {
  const response = apiService.apiCall(base.register, "post", data);
  return response;
};
export const userAccountVerification = (data) => {
  const response = apiService.apiCall(base.verifyOTP, "post", data);
  return response;
};
export const getUserProfile = () => {
  const response = apiService.apiCall(base.getUserProfile, "get");
  return response;
};
