import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import logo from "@/assets/estatemaster-icon.svg";
import { SignUpSchema } from "@/utils/schemas.js";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
import { Loader2 } from "lucide-react";
// import { submitForm } from "@/utils/submitForm.js";
import { useAuth } from "@/contexts/AuthContext";

const inputFields = [
  { name: "name", placeholder: "Name" },
  { name: "email", placeholder: "Email" },
  { name: "password", placeholder: "Password" },
  { name: "confPassword", placeholder: "Confirm Password" },
  { name: "phone", placeholder: "Phone No" },
];

function Signup() {
  /*const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confPassword: "",
      phone: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    const { name, email, password, phone } = data;
    data = { name, email, password, phone };
    await submitForm({
      data,
      endpoint: "http://localhost:8000/api/auth/register/",
      navigate,
      setLoading,
      setErrorMessage,
      onSuccess: (response) => {
        console.log("Account created successfully:", response);
        // Additional success logic if needed
      },
    });
  }*/

  const { signup, loading, errorMessage } = useAuth(); // Access auth context
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confPassword: "",
      phone: "",
    },
  });

  const onSubmit = (data) => {
    signup(data); // Use signup function from context
  };

  return (
    <>
      <div className="flex items-start py-20 justify-center min-h-screen bg-secondary">
        <Form {...form}>
          <Card className="mx-auto max-w-sm shadow-md">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="flex items-center text-center">
                <img src={logo} alt="logo" className="size-16" />
                <CardTitle className="text-2xl text-primary">Sign up</CardTitle>
                <CardDescription>
                  Enter your information to create an account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {inputFields.map(({ name, placeholder }) => (
                    <div className="grid gap-2" key={name}>
                      <FormField
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                type={
                                  ["password", "confPassword"].includes(name)
                                    ? "password"
                                    : "text"
                                }
                                placeholder={placeholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
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
                      "Create Account"
                    )}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline">
                    Sign in
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </Form>
      </div>
    </>
  );
}

export default Signup;
