import React from 'react'
import PageBackground from '@/components/PageBackground'
import HouseShowingImage from '@/assets/HouseShowing-image1.jpeg'
import RoomForSublease from '@/assets/RoomForSublease.jpg'
import GlassSurface from '@/components/GlassSurface'
import GradientText from '@/components/GradientText'
// import { THEME } from '@/constants/theme'


export const LandingPage = () => {

    const glassBarProps = {
        distortionScale: -70,
        redOffset: 5,
        greenOffset: 15,
        blueOffset: 25,
        brightness: 60,
        opacity: 0.93,
        mixBlendMode: 'screen' as const,
        saturation: 1,
        blur: 7,
        width: 'auto',
        height: 'auto',
        borderRadius: 50,
    }

    

  return  (
    <PageBackground>
        <div className='flex flex-col items-center justify-center h-screen'>
            <div className=' absolute top-10 z-20 '>
                <GradientText
                        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                        animationSpeed={15}
                        showBorder={false}
                        className="text-5xl font-bold"
                >
                        {'Sub4You'}
            </GradientText>
            </div>
            <div className='flex items-center w-full h-screen relative'>
                <div className='flex flex-col items-center w-full h-screen relative overflow-hidden'>
                    <div
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105'
                        style={{ 
                            backgroundImage: `url(${HouseShowingImage})`,
                            maskImage: 'linear-gradient(to top, black 50%, transparent 85%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 85%)'
                            }}
                    />
                    <p className='absolute top-[75%] text-2xl sm:text-5xl font-bold z-10 text-white w-full text-center'>Looking for a Room?</p>
                    <button className='absolute top-[85%] pt-5 text-xl sm:text-3xl font-bold z-10 text-white text-center'>
                        <GlassSurface {...glassBarProps}>
                            <p className='text-xl sm:text-3xl mx-5 font-bold text-white w-full text-center'>Find Rooms</p>
                        </GlassSurface>
                    </button>
                    {/* <button className='absolute top-[85%] px-8 py-3 text-xl sm:text-2xl font-bold z-10 text-white bg-white/20 backdrop-blur-sm rounded-full shadow-inner border border-white/30 hover:bg-white/30 transition-all'>Find Rooms</button> */}
                </div>
                <div className='flex flex-col justify-center items-center w-full h-screen relative overflow-hidden'>
                    <div 
                        className='absolute inset-0 bg-cover bg-center transition-transform duration-500 hover:scale-105'
                        style={{ 
                            backgroundImage: `url(${RoomForSublease})`,
                            maskImage: 'linear-gradient(to top, black 50%, transparent 85%)',
                            WebkitMaskImage: 'linear-gradient(to top, black 50%, transparent 85%)'
                            }}
                    />
                    <p className='absolute top-[75%] text-2xl sm:text-5xl font-bold z-10 text-white w-full text-center'>Renting out a Room?</p>
                    <button className='absolute top-[85%] pt-5 text-xl sm:text-3xl font-bold z-10 text-white text-center'>
                        <GlassSurface {...glassBarProps}>
                            <p className='text-xl sm:text-3xl mx-5 font-bold text-white w-full text-center'>List your room</p>
                        </GlassSurface>
                    </button>
                    {/* <button className='absolute top-[85%] px-8 py-3 text-xl sm:text-2xl font-bold z-10 text-white bg-white/20 backdrop-blur-sm rounded-full shadow-inner border border-white/30 hover:bg-white/30 transition-all'>List your room</button> */}
                </div>
            </div>
        </div>
    </PageBackground>
  )
}

export default LandingPage