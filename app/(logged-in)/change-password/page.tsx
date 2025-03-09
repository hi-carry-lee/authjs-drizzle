"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordMatchSchema } from "@/validation/passwordMatchSchema";
import { changePassword } from "./actions";
import { passwordSchema } from "@/validation/passwordSchema";

const formSchema = z
  .object({
    currentPassword: passwordSchema,
  })
  .and(passwordMatchSchema);

function ChangePassword() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    const response = await changePassword({
      currentPassword: data.currentPassword,
      password: data.password,
      passwordConfirm: data.passwordConfirm,
    });
    console.log(response);
    if (response?.error) {
      form.setError("root", {
        message: response?.message,
      });
    } else {
      toast.custom((t) => (
        <div className="relative bg-green-500 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <button
            onClick={() => toast.dismiss(t)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-200 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            x
          </button>
          <h3 className="font-bold text-gray-200">Change Password</h3>
          <p className="text-gray-200">
            Your password has been changed successfully.
          </p>
        </div>
      ));
      form.reset();
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input placeholder="******" {...field} type="password" />
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
                  <FormLabel>New Password</FormLabel>
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
                  <FormLabel>Confirm New Password</FormLabel>
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
            <Button type="submit">Change Password</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ChangePassword;
