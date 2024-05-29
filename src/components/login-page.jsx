import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useState } from "react";
import PageHeading from "./page-heading";
import { setUserInfo } from "../lib/user-info-methods";
import { useToast } from "./ui/use-toast";

const loginSchema = z.object({
  email: z.string().min(2).max(50),
  password: z.string().min(3).max(50),
});

const LoginPage = () => {
  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { toast } = useToast();

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/login?email=${values.email}&password=${values.password}`
      );
      const userAcc = response.data;
      if (userAcc) {
        setUserInfo(userAcc);
        // Redirect to protected route after successful login
        window.location.href = "/";
      } else {
        throw new Error();
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid Email or Password.",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[450px] mx-auto p-8 rounded-lg border"
        >
          <PageHeading text={"User Login"} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
                  <Input type="password" placeholder="pasword" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={loading}
            variant="primary"
            type="submit"
            className="w-full"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Don't have an account? Sign up{" "}
            <a
              href="/signup"
              className="underline hover:no-underline transition-all duration-200 text-amber-600"
            >
              here
            </a>
          </p>
        </form>
      </Form>
    </>
  );
};

export default LoginPage;
