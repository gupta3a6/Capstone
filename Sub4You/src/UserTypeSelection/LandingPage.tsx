import PageBackground from '@/components/PageBackground'
import HouseShowingImage from '@/assets/HouseShowing-image1.jpeg'
import RoomForSublease from '@/assets/RoomForSublease.jpg'
import GlassSurface from '@/components/GlassSurface'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    const navigate = useNavigate()

    const handleListerClick = async () => {
        // Check local storage mock array for existing listings
        const listingsJson = localStorage.getItem('sub4you_lister_listings_array');
        const listings = listingsJson ? JSON.parse(listingsJson) : [];
        const hasExistingListing = listings.length > 0;
        
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session || !hasExistingListing) {
            // Not signed in OR don't have an active listing yet -> Create Listing Page
            navigate('/lister/createlisting');
        } else {
            // Signed in AND has a listing -> Dashboard
            navigate('/lister/home');
        }
    }

    return (
        <PageBackground>
            <div className='flex flex-col items-center justify-center h-screen'>
                <div
                    className=' absolute top-10 z-20 cursor-pointer hover:scale-105 transition-transform duration-300'
                    onClick={() => navigate('/')}>
                    <img 
                      src="/logo.png" 
                      alt="Sub4You Logo" 
                      className="h-14 sm:h-20 w-auto object-contain drop-shadow-md" 
                    />
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
                        <button
                            className='absolute top-[85%] pt-5 text-xl sm:text-3xl font-bold z-10 text-white text-center'
                            onClick={() => navigate('/seeker/home')}>
                            <GlassSurface {...glassBarProps}>
                                <p className='text-xl sm:text-3xl mx-5 font-bold text-white w-full text-center'>Find Rooms</p>
                            </GlassSurface>
                        </button>
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
                        <button
                            className='absolute top-[85%] pt-5 text-xl sm:text-3xl font-bold z-10 text-white text-center'
                            onClick={handleListerClick}
                        >
                            <GlassSurface {...glassBarProps}>
                                <p className='text-xl sm:text-3xl mx-5 font-bold text-white w-full text-center'>List your room</p>
                            </GlassSurface>
                        </button>
                    </div>
                </div>
            </div>
        </PageBackground>
    )
}

export default LandingPage