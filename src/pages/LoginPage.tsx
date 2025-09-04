import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, School, Eye, EyeOff, Shield, Mail, User, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { signIn, signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Cursor animation state
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState("default");

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

  // Mouse move event for cursor animation (only for non-mobile)
  useEffect(() => {
    if (isMobile) return;
    
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener("mousemove", mouseMove);

    return () => {
      window.removeEventListener("mousemove", mouseMove);
    };
  }, [isMobile]);

  // Cursor variants for different states
  const variants = {
    default: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#3b82f6",
      mixBlendMode: "difference" as const,
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      backgroundColor: "#ef4444",
      mixBlendMode: "difference" as const,
      scale: 1.5,
    },
    click: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      backgroundColor: "#10b981",
      mixBlendMode: "difference" as const,
      scale: 0.8,
    }
  };

  // Handle mouse events for cursor (only for non-mobile)
  const handleMouseEnter = () => !isMobile && setCursorVariant("hover");
  const handleMouseLeave = () => !isMobile && setCursorVariant("default");
  const handleMouseDown = () => !isMobile && setCursorVariant("click");
  const handleMouseUp = () => !isMobile && setCursorVariant("hover");

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

  return (
    <div 
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden ${isMobile ? '' : 'cursor-none'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
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

      {/* Custom Animated Cursor (only for non-mobile) */}
      {!isMobile && (
        <>
          <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50"
            variants={variants}
            animate={cursorVariant}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
          />
          
          <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full bg-blue-300/50 pointer-events-none z-40"
            animate={{
              x: mousePosition.x - 8,
              y: mousePosition.y - 8,
            }}
            transition={{
              type: "spring",
              damping: 40,
              stiffness: 200,
              delay: 0.05,
            }}
          />
        </>
      )}

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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Public Site
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}