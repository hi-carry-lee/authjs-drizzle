"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updatePassword } from "./actions";
import Link from "next/link";

function UpdatePasswordForm({ token }: { token: string }) {
  const form = useForm<z.infer<typeof passwordMatchSchema>>({
    resolver: zodResolver(passwordMatchSchema),
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  async function handleSubmit(data: z.infer<typeof passwordMatchSchema>) {
    console.log(data);
    const response = await updatePassword({
      token,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });

    if (response?.tokenIsValid) {
      window.location.reload();
    }

    if (response?.error) {
      form.setError("root", {
        message: response?.message,
      });
    } else {
      toast.custom(
        (t) => (
          <div className="relative bg-green-500 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <button
              onClick={() => toast.dismiss(t)}
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              x
            </button>
            <h3 className="font-bold text-gray-200">Update Password</h3>
            <p className="text-gray-200">
              Your password has been updated successfully.
            </p>
          </div>
        ),
        {
          duration: 1500, // 持续时间，单位为毫秒（默认是3000毫秒）
          // 其他可选配置
          // position: "top-center", // 位置
          // id: "password-updated", // 唯一ID
          // icon: "🔑",
        }
      );
      form.reset();
    }
  }
  return form.formState.isSubmitSuccessful ? (
    <div>
      You had reset your password successfully!
      <Link className="underline" href="/login">
        Click here to login to your account
      </Link>
    </div>
  ) : (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Confirm</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {!!form.formState.errors.root?.message && (
          <FormMessage>{form.formState.errors.root.message}</FormMessage>
        )}
        <Button type="submit">Update Password</Button>
      </form>
    </Form>
  );
}

export default UpdatePasswordForm;
