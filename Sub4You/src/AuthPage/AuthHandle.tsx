import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PageBackground from "../components/PageBackground";
import GradientText from "../components/GradientText";
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
                    onClick={() => navigate('/')}                                
                    className="w-full flex justify-center pt-6 pb-2 sm:pt-10 sm:pb-6 cursor-pointer"
                >
                    <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={15}
                        showBorder={false}
                        className="text-4xl sm:text-5xl md:text-6xl font-bold transition-all duration-300 transform"
                    >
                        {'Sub4You'}
                    </GradientText>
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
