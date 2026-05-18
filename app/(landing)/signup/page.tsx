"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import SubmitButton from "@/components/SubmitButton";
import Link from "next/link";
export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = async (fd: FormData) => {
    if (password !== confirmPassword) {
      setError("Password Doesn't match!");
      return;
    }
    if (password.length < 6) {
      setError("Password is too short");
      return;
    }
    const request = await fetch("/api/register",{method:"POST",body:fd});
    const response = await request.json();
    if(response.success){
      router.push("/login");
      setError("");
    }else{
      setError(response.error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-background py-10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Account
          </CardTitle>
          <CardDescription className="text-center">
            Join our community and start sharing
          </CardDescription>
        </CardHeader>
        <form action={handleSubmit}>
          <CardContent className="space-y-4">
            {/* <div className="space-y-2">
              <Label htmlFor="name">Username</Label>
              <Input
                name="username"
                type="text"
                placeholder="john-doe"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div> */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                name="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="space-y-2">
                <Label className="text-red-600 text-xs">{error}</Label>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <SubmitButton type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </SubmitButton>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
