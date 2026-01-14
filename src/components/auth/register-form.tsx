"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { User, Mail, Lock } from "lucide-react";
import { useLoginModal } from "@/providers/login-modal-provider";
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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { registerSchema, type RegisterFormData } from "@/schemas/auth";
import { useAuth } from "@/hooks/use-auth";

export function RegisterForm() {
  const { register, isLoading } = useAuth();
  const { openLoginModal } = useLoginModal();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: RegisterFormData) {
    // Transform form data to match RegisterCredentials
    const result = await register({
      username: data.name,
      email: data.email,
      password: data.password,
      confirmPassword: data.confirmPassword,
      phone: "", // This legacy form doesn't have phone field
    });
    if (!result.success) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full border-0 shadow-none">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-roboto-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <FormInput
                        placeholder="John Doe"
                        prefix={<User className="w-auto h-auto" />}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <FormInput
                        type="email"
                        placeholder="you@example.com"
                        prefix={<Mail className="w-auto h-6" />}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        placeholder="••••••••"
                        prefix={<Lock className="w-auto h-6" />}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <FormInput
                        type="password"
                        placeholder="••••••••"
                        prefix={<Lock className="w-auto h-6" />}
                        error={fieldState.error?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive"
                >
                  {form.formState.errors.root.message}
                </motion.p>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={openLoginModal}
              className="text-primary hover:underline font-roboto-medium"
            >
              Sign in
            </button>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
