import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";
import type { LoginFormData, LoginResponse, ResponseErrorType } from "../types";

export const useLoginFormMutation = (setShowTwoFactor: (data: boolean) => void) => {
  return useMutation<LoginResponse, ResponseErrorType, LoginFormData>({
    mutationFn: async (data: LoginFormData) => {
      const response = await axios.post("/api/login", data);
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      message.success(data.message);
      setShowTwoFactor(true);
    },
    onError: (error: ResponseErrorType) => {
      if (error.response) {
        if (error.response.status === 401) {
          message.error("Invalid credentials");
        } else if (error.response.status === 500) {
          message.error("Server error, please try again later");
        } else {
          message.error(error.response.data?.error || "An error occurred");
        }
      } else if (error.request) {
        message.error("Network error: No response from server");
      } else {
        message.error("Unexpected error");
      }
    },
  });
};
