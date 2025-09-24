import React, { useState, useEffect, useCallback } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import { useForm, Controller, type UseFormSetValue } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./CodeForm.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useCodeVerifyMutation } from "@hooks/useCodeVerifyMutation";
import { useNavigate } from "react-router-dom";
import type { CodeData, CodeVerifyResponse, ResponseErrorType } from "types";
import { CODE_LENGTH, CODE_TIMER_DELAY } from "@constants/constants";

const { Text, Title } = Typography;

const schema = yup.object().shape({
  code: yup
    .string()
    .length(6, "Code must be 6 digits")
    .matches(/^\d+$/, "Code must contain only digits")
    .required("Code is required"),
});

interface CodeFormProps {
  onClose: () => void;
  onSubmit: (data: CodeVerifyResponse) => void;
}

export const CodeForm: React.FC<CodeFormProps> = ({ onClose, onSubmit }) => {
  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CodeData>({
    resolver: yupResolver(schema),
    defaultValues: { code: "" },
  });

  const navigate = useNavigate();
  const [codeInputs, setCodeInputs] = useState<string[]>(
    new Array(CODE_LENGTH).fill("")
  );
  const [timeLeft, setTimeLeft] = useState<number>(CODE_TIMER_DELAY);
  const [timerActive, setTimerActive] = useState<boolean>(true);

  const verifyMutation = useCodeVerifyMutation(onSubmit, () => navigate("/"));

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleInputChange = useCallback(
    (index: number, value: string, setValue: UseFormSetValue<CodeData>) => {
      const newCodeInputs = [...codeInputs];
      newCodeInputs[index] = value.slice(0, 1);
      setCodeInputs(newCodeInputs);

      const inputs = document.querySelectorAll(".code-input") as NodeListOf<HTMLInputElement>;
      if (value && index < 5) {
        inputs[index + 1]?.focus();
      } else if (!value && index > 0) {
        inputs[index - 1]?.focus();
      }

      const codeValue = newCodeInputs.join("");
      setValue("code", codeValue);

      if (codeValue.length === CODE_LENGTH) {
        verifyMutation.mutate({ code: codeValue });
      }
    },
    [codeInputs, verifyMutation]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      const isEmpty = !codeInputs[index] && index > 0;
      const inputs = document.querySelectorAll(".code-input") as NodeListOf<HTMLInputElement>;

      switch (e.key) {
        case "Backspace":
          if (isEmpty) {
            e.preventDefault();
            inputs[index - 1]?.focus();
            const newCodeInputs = [...codeInputs];
            newCodeInputs[index - 1] = "";
            setCodeInputs(newCodeInputs);
            setValue("code", newCodeInputs.join(""));
          }
          break;
        case "ArrowLeft":
          e.preventDefault();
          inputs[index - 1]?.focus();
          break;
        default:
          if (codeInputs[index] && index < 5) {
            e.preventDefault();
            inputs[index + 1]?.focus();
          }
          break;
      }
    },
    [codeInputs, setValue]
  );

  const handleGetNewCode = () => {
    setTimeLeft(CODE_TIMER_DELAY);
    setTimerActive(true);
    setCodeInputs(new Array(CODE_LENGTH).fill(""));
    reset();
    message.success("New code generated (mocked)");
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;

  const getErrorMessage = (): string | null => {
    if (verifyMutation.error) {
      const error = verifyMutation.error as ResponseErrorType;
      if (error.response?.status === 401) return "Invalid 2FA code";
      if (error.response?.status === 403) return "Code expired";
      if (error.response?.status === 500) return "Server error";
      if (error.request) return "Network error";
      return error.message || "Unexpected error";
    }
    return null;
  };

  return (
    <div className="two-factor-container">
      <div className="two-factor-box">
        <button className="back-button" onClick={onClose}>
          <ArrowLeftOutlined />
        </button>
        <div className="company-logo">
          <div className="company-logo-circle"></div>
          <Text>Company</Text>
        </div>
        <Title level={3}>Two-Factor Authentication</Title>
        <Text className="two-factor-text">
          Enter the 6-digit code from the Google Authenticator app
        </Text>
        <Form
          onFinish={handleSubmit(({ code }) => verifyMutation.mutate({ code }))}
          layout="vertical"
          className="code-form"
        >
          <div className="code-inputs">
            {codeInputs.map((value, index) => (
              <Form.Item key={index}>
                <Controller
                  name="code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id={`code-input-${index}`}
                      {...field}
                      value={value}
                      onChange={(e) =>
                        handleInputChange(index, e.target.value, setValue)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="code-input"
                      status={errors.code || getErrorMessage() ? "error" : ""}
                    />
                  )}
                />
              </Form.Item>
            ))}
          </div>
          {(errors.code || getErrorMessage()) && (
            <div className="error-message">
              {errors.code?.message || getErrorMessage()}
            </div>
          )}
          {timerActive ? (
            <Text className="resend-code">
              Get a new code in {formatTime(timeLeft)}
            </Text>
          ) : (
            <Button
              onClick={handleGetNewCode}
              className="resend-code-btn"
              type="primary"
              htmlType="button"
              block
              loading={verifyMutation.isPending}
            >
              Get new
            </Button>
          )}
        </Form>
      </div>
    </div>
  );
};
