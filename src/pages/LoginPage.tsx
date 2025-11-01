import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, School, Eye, EyeOff, Shield, Mail, User, Lock, ArrowLeft, Chrome, Facebook } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp, isAuthenticated, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);
  
  
  // Password strength calculation
  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 12.5;
      if (/[^A-Za-z0-9]/.test(password)) strength += 12.5;
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [password]);
  
  // Email validation
  useEffect(() => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  }, [email]);
  
  // Password validation for sign up
  useEffect(() => {
    if (password && password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
    } else {
      setPasswordError('');
    }
  }, [password]);
  
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Login Successful",
          description: "Welcome to the SBO Dashboard",
        });
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account",
        });
      }
    } catch (err) {
      setError('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth('google');
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An error occurred during Google sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const { error } = await signInWithOAuth('facebook');
      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An error occurred during Facebook sign in');
    } finally {
      setIsLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'bg-red-500';
    if (passwordStrength <= 50) return 'bg-orange-500';
    if (passwordStrength <= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-100/30"
            style={{
              width: Math.random() * 150 + 50,
              height: Math.random() * 150 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
            }}
            transition={{
              duration: Math.random() * 15 + 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="w-full max-w-md mx-auto z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div 
            className="flex justify-center mb-4"
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full shadow-lg">
              <Shield className="h-10 w-10 text-white" />
            </div>
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-gray-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            SBO Dashboard
          </motion.h1>
          <motion.p 
            className="text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            School Body Organization System
          </motion.p>
        </motion.div>
        
        {/* Auth Card */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-sm bg-white/95 border-0 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-6">
              <CardTitle className="text-center text-xl font-semibold text-gray-800">
                Welcome to SBO Portal
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-6 pb-8">
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="signin" 
                    className="rounded-md py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="rounded-md py-2 text-sm font-medium transition-all duration-300 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <motion.form 
                    onSubmit={handleSignIn} 
                    className="space-y-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signin-email" className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email Address
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Input
                          id="signin-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="officer@sbo.edu"
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 h-11"
                        />
                      </motion.div>
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signin-password" className="text-gray-700 font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        Password
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative">
                        <Input
                          id="signin-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </motion.div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <input
                          id="remember-me"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <Label htmlFor="remember-me" className="text-sm text-gray-700">
                          Remember me
                        </Label>
                      </div>
                      <motion.button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/forgot-password')}
                      >
                        Forgot password?
                      </motion.button>
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 h-11 transition-all duration-300 shadow-md hover:shadow-lg" 
                        disabled={isLoading || !!emailError || !!passwordError}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          "Sign In to Your Account"
                        )}
                      </Button>
                    </motion.div>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10 flex items-center justify-center gap-2"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                        >
                          <Chrome className="h-4 w-4" />
                          <span>Google</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10 flex items-center justify-center gap-2"
                          onClick={handleFacebookSignIn}
                          disabled={isLoading}
                        >
                          <Facebook className="h-4 w-4" />
                          <span>Facebook</span>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <motion.form 
                    onSubmit={handleSignUp} 
                    className="space-y-5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname" className="text-gray-700 font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-500" />
                        Full Name
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Input
                          id="signup-fullname"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 h-11"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-gray-700 font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-500" />
                        Email Address
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                        <Input
                          id="signup-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="officer@sbo.edu"
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 h-11"
                        />
                      </motion.div>
                      {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-gray-700 font-medium flex items-center gap-2">
                        <Lock className="h-4 w-4 text-blue-500" />
                        Password
                      </Label>
                      <motion.div whileFocus={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          required
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-300 pr-10 h-11"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </motion.div>
                      {password && (
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">Password strength</span>
                            <span className={`font-medium ${passwordStrength <= 25 ? 'text-red-500' : passwordStrength <= 50 ? 'text-orange-500' : passwordStrength <= 75 ? 'text-yellow-500' : 'text-green-500'}`}>
                              {getPasswordStrengthText()}
                            </span>
                          </div>
                          <Progress value={passwordStrength} className="h-1.5" />
                          <div className="mt-1 text-xs text-gray-500">
                            Use 8+ characters with uppercase, lowercase, numbers & symbols
                          </div>
                        </div>
                      )}
                      {passwordError && <p className="text-red-500 text-xs mt-1">{passwordError}</p>}
                    </div>
                    
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert variant="destructive" className="border-red-200 bg-red-50 text-red-800">
                          <AlertDescription className="text-sm">{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium py-3 h-11 transition-all duration-300 shadow-md hover:shadow-lg" 
                        disabled={isLoading || !!emailError || !!passwordError || passwordStrength < 50}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Your Account"
                        )}
                      </Button>
                    </motion.div>
                    
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10 flex items-center justify-center gap-2"
                          onClick={handleGoogleSignIn}
                          disabled={isLoading}
                        >
                          <Chrome className="h-4 w-4" />
                          <span>Google</span>
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-10 flex items-center justify-center gap-2"
                          onClick={handleFacebookSignIn}
                          disabled={isLoading}
                        >
                          <Facebook className="h-4 w-4" />
                          <span>Facebook</span>
                        </Button>
                      </motion.div>
                    </div>
                  </motion.form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Public Access */}
        <motion.div 
          className="text-center mt-6"
          variants={itemVariants}
        >
          <motion.button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-blue-600 transition-colors text-sm font-medium flex items-center justify-center gap-1"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Public Site
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}