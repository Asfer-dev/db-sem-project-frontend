import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";

import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import PageHeading from "./page-heading";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

const signupSchema = z.object({
  email: z.string(),
  name: z.string().min(2).max(50),
  gender: z.string(),
  cnic: z.string().min(13).max(13),
  contact_no: z.string().min(11).max(11),
  password: z.string().min(3).max(50),
  confirmPassword: z.string(),
});

const SignupPage = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // 1. Define your form.
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
      cnic: "",
      contact_no: "",
      gender: "",
    },
  });

  const { toast } = useToast();

  // 2. Define a submit handler.
  async function onSubmit(values) {
    console.log(values);
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/signup", values);
      const userAcc = response.data;
      console.log(userAcc);
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Sign up Failed",
        description: "Something went wrong.",
      });
    } finally {
      setLoading(true);
    }
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[500px] mx-auto"
        >
          <PageHeading text={"User Sign up"} />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormDescription>
                  This will be your Account Username
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be your Display Name
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="M">Male</SelectItem>
                    <SelectItem value="F">Female</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>Choose your gender.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cnic"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CNIC</FormLabel>
                <FormControl>
                  <Input placeholder="CNIC" {...field} />
                </FormControl>
                <FormDescription>
                  Your CNIC is required for buying tickets.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_no"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact No.</FormLabel>
                <FormControl>
                  <Input placeholder="Your phone number" {...field} />
                </FormControl>
                <FormDescription>
                  Enter your Contact Number here.
                </FormDescription>
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
                <FormDescription>
                  Choose a strong password for your account.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="confirm password"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Confirm your password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="primary"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign up"}
          </Button>
          {error && <p className="text-red-500">{error}</p>}
          <p>
            Already have an account? Log in{" "}
            <a
              href="/login"
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

export default SignupPage;
