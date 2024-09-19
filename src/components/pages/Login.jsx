"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
// import { useToast } from "../../components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate();
  const [email, setEmail] = useState("")
  const [name,setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("user")
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
//   const { toast } = useToast()

  const toggleForm = () => {
    setIsLogin(!isLogin)
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setRole("user")
    setKey("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!isLogin && password !== confirmPassword) {
    //   toast({
    //     title: "Error",
    //     description: "Passwords do not match",
    //     variant: "destructive",
    //   })
      setIsLoading(false)
      return
    }

    if (!isLogin && (role === "admin" || role === "verifier") && !key) {
    //   toast({
    //     title: "Error",
    //     description: `Please enter the ${role} key`,
    //     variant: "destructive",
    //   })
      setIsLoading(false)
      return
    }

    const endpoint = isLogin ? "http://localhost:5000/api/v1/login" : "http://localhost:5000/api/v1/register"

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name,email, password, role, adminKey:key }),
      })

      const data = await response.json();
      console.log(response)
      console.log(data)
      if (response.ok) {
        // toast({
        //   title: "Success",
        //   description: isLogin ? "Logged in successfully" : "Account created successfully",
        // })
        // Handle successful login/signup (e.g., store token, redirect)
        localStorage.setItem('token',data.token);
        localStorage.setItem('role',data.user.role);
      console.log(data.user.role)

        window.location.href = '/user'
      } else {
        // toast({
        //   title: "Error",
        //   description: data.message || "An error occurred",
        //   variant: "destructive",
        // })
      }
    } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "An unexpected error occurred",
    //     variant: "destructive",
    //   })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Sign Up"}</CardTitle>
          <CardDescription>
            {isLogin
              ? "Enter your credentials to login"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!isLogin && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="verifier">Verifier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {(role === "admin" || role === "verifier") && (
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="key">{role.charAt(0).toUpperCase() + role.slice(1)} Key</Label>
                      <Input
                        id="key"
                        type="password"
                        placeholder={`Enter ${role} key`}
                        value={key}
                        onChange={(e) => setKey(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 mt-6"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="mt-4 text-sm text-center">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button
              variant="link"
              className="text-green-600 hover:text-green-700"
              onClick={toggleForm}
            >
              {isLogin ? "Sign Up" : "Login"}
            </Button>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}