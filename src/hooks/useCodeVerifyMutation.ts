import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { message } from "antd";
import type { CodeData, CodeVerifyResponse, ResponseErrorType } from "../types";


export const useCodeVerifyMutation = (
  onSubmit: (data: CodeVerifyResponse) => void,
  onSuccessRedirect?: () => void 
) => {
  return useMutation<CodeVerifyResponse, ResponseErrorType, CodeData>({
    mutationFn: async (data: CodeData) => {
      const response = await axios.post("/api/verify-2fa", data);
      return response.data;
    },
    onSuccess: (data) => {
      message.success(data.message);
      onSubmit(data);
      if (onSuccessRedirect) {
        onSuccessRedirect();
      }
    },
    onError: (error: ResponseErrorType) => {
      if (error.response) {
        if (error.response.status === 401) {
          message.error("Invalid 2FA code");
        } else if (error.response.status === 403) {
          message.error("Code expired");
        } else if (error.response.status === 500) {
          message.error("Server error");
        } else {
          message.error(error.response.data?.error || "An error occurred");
        }
      } else if (error.request) {
        message.error("Network error");
      } else {
        message.error("Unexpected error");
      }
    },
  });
};
