import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import '../App.css'

interface AuthHandleProps {
    children: ReactNode
}

export const AuthHandle = ({ children }: AuthHandleProps) => {
    const navigate = useNavigate();

    return (
        <PageBackground>
            <div className="min-h-screen flex flex-col relative z-10">
                {/* Logo Section - Responsive scaling and spacing */}
                <div 
                    onClick={() => navigate('/home')}                                
                    className="w-full flex justify-center pt-6 pb-2 sm:pt-10 sm:pb-6 cursor-pointer"
                >
                    <img 
                        src="/logo.png" 
                        alt="Sub4You Logo" 
                        className="h-14 sm:h-16 md:h-20 w-auto object-contain drop-shadow-md transition-all duration-300 transform hover:scale-105" 
                    />
                </div>

                {/* Content Section - Flex grow to fill space and center content */}
                <div className="flex-1 flex flex-col items-center justify-center pt-0 sm:pt-0 pb-8 px-4 sm:px-6 w-full">
                    <div className="w-full max-w-md sm:max-w-lg transition-all duration-300">
                        {children}
                    </div>
                </div>
            </div>
        </PageBackground>
    )
}

export default AuthHandle
