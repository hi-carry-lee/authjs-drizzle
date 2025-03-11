"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Input } from "@/components/ui/input";
import { passwordSchema } from "@/validation/passwordSchema";
import { Button } from "@/components/ui/button";
import { loginWithDentials, preLoginCheck } from "./actions";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import toastUtil from "@/lib/toastUtil";

const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required!",
  }),
  password: passwordSchema,
});

function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const otpRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // login handler
  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    // clear errors before submit is a best practice
    form.clearErrors();

    const preLoginCheckResponse = await preLoginCheck({
      email: data.email,
      password: data.password,
    });

    if (preLoginCheckResponse?.error) {
      form.setError("root", {
        message: preLoginCheckResponse.message,
      });
    }
    if (preLoginCheckResponse.twoFactorActivated) {
      setStep(2);
    } else {
      const response = await loginWithDentials({
        email: data.email,
        password: data.password,
      });
      if (response?.error) {
        form.setError("root", {
          message: response.message,
        });
      } else {
        router.push("my-account");
      }
    }
  };

  // Two Factor handler
  const handleOPTSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await loginWithDentials({
      email: form.getValues("email"),
      password: form.getValues("password"),
      token: otp,
    });
    if (response?.error) {
      toastUtil({
        title: "Two-Factor Authentication",
        message: "Two-Factor Authentication successfully",
      });
      return;
    } else {
      router.push("my-account");
    }
  };

  // back to the login ui
  const handleGoBack = () => {
    setStep(1);
    setOtp(""); // 清空OTP输入，避免旧数据保留
  };

  // 使用useEffect自动聚焦到OTP输入框
  useEffect(() => {
    if (step === 2 && otpRef.current) {
      // 添加类型安全的超时调用
      const timeoutId = setTimeout(() => {
        otpRef.current?.focus();
      }, 0);

      // 清理函数，防止内存泄漏
      return () => clearTimeout(timeoutId);
    }
  }, [step]);

  return (
    <main className="min-h-screen flex justify-center items-center">
      {step === 2 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>One-Time Passcode</CardTitle>
            <CardDescription>
              Enter the one-time passcode displayed in your Google Authenticator
              app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleOPTSubmit} className="flex flex-col gap-2">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={setOtp}
                ref={otpRef}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <Button disabled={otp.length !== 6} type="submit">
                Verify OTP
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleGoBack}
                className="flex-1"
              >
                Back
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
      {step === 1 && (
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Please login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="flex flex-col gap-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John@Doe.com"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="******"
                          {...field}
                          type="password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {!!form.formState.errors.root?.message && (
                  <FormMessage>
                    {form.formState.errors.root.message}
                  </FormMessage>
                )}
                <Button type="submit">Login</Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <div className="text-muted-foreground text-sm">
              Doesn&apos;t have an account?{" "}
              <Link href="/register" className="underline">
                Register
              </Link>
            </div>
            <div className="text-muted-foreground text-sm">
              Forget password?{" "}
              <Link
                // this is a best practice of passing valur from url
                href={{
                  pathname: "/password-reset",
                  query: form.getValues("email")
                    ? { email: form.getValues("email") }
                    : {},
                }}
                className="underline"
              >
                Reset my password
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </main>
  );
}

export default LoginPage;
