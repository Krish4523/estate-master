// import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import logo from "@/assets/estatemaster-icon.svg";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
// import { submitForm } from "@/utils/submitForm.js";
import { LoginSchema } from "@/utils/schemas.js";
import { useAuth } from "@/contexts/AuthContext";

function Login() {
  /*const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    const isEmail = z.string().email().safeParse(data.emailOrPhone).success;

    const formData = {
      email: isEmail ? data.emailOrPhone : "",
      phone: isEmail ? "" : data.emailOrPhone,
      password: data.password,
    };

    await submitForm({
      data: formData,
      endpoint: `${import.meta.env.VITE_API_BASE_URL}/auth/login/`,
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log("Account created successfully:", response);
        // Example for storing token in localStorage
        localStorage.setItem("authToken", response?.token);
        navigate("/");
      },
      onError: (error) => {
        console.error("Error creating account:", error);
      }
    });
  }*/
  const { login, loading, errorMessage } = useAuth();
  const form = useForm({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const onSubmit = (data) => {
    login(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Form {...form}>
        <Card className="mx-auto max-w-sm shadow-md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="flex items-center text-center">
              <img src={logo} alt="logo" className="size-16" />
              <CardTitle className="text-2xl text-primary">Login</CardTitle>
              <CardDescription>
                Enter your details to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="emailOrPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Email or Phone No." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Password"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {errorMessage && (
                  <div className="text-red-500 text-sm text-center">
                    {errorMessage}
                  </div>
                )}
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin text-white me-2" />{" "}
                      Loading...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
                <a href="#" className="text-center text-sm underline">
                  Forgot your password?
                </a>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link to="/signup" className="underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </form>
        </Card>
      </Form>
    </div>
  );
}

export default Login;
