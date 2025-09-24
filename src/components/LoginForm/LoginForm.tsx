import React, { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "./LoginForm.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { CodeForm } from "../CodeForm";
import { useLoginFormMutation } from "@hooks/useLoginFormMutation";
import type { CodeVerifyResponse, LoginFormData } from "types";

const { Text, Title } = Typography;

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const LoginForm: React.FC = () => {
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  const loginMutation = useLoginFormMutation(setShowTwoFactor);

  const onFinish = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const onCodeSubmit = (data: CodeVerifyResponse) => {
    console.log("2FA code:", data.message);
  };

  const values = watch();
  const isButtonDisabled = !values.email || !values.password;

  return (
    <div className="login-container">
      {!showTwoFactor ? (
        <div className="login-box">
          <div className="company-logo">
            <div className="company-logo-circle"></div>
            <Text>Company</Text>
          </div>
          <Title level={3}>Sign in to your account to continue</Title>
          <Form onFinish={handleSubmit(onFinish)} layout="vertical">
            <Form.Item
              name="email"
            >
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    size="large"
                    prefix={<UserOutlined />}
                    placeholder="Info@email.com"
                    status={errors.email ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
            <Form.Item
              name="password"
            >
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input.Password
                    {...field}
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Password"
                    status={errors.password ? "error" : ""}
                  />
                )}
              />
            </Form.Item>
            {(errors.password || errors.email) && (
              <div className="error-message">Invalid Credentials</div>
            )}
            <Form.Item>
              <Button
                disabled={isButtonDisabled}
                size="large"
                type="primary"
                htmlType="submit"
                loading={loginMutation.isPending}
                block
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      ) : (
        <CodeForm
          onClose={() => setShowTwoFactor(false)}
          onSubmit={onCodeSubmit}
        />
      )}
    </div>
  );
};
