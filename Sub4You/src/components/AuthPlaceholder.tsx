import { useNavigate } from 'react-router-dom'
import { THEME } from '../constants/theme'
import { FiLock } from 'react-icons/fi'

interface AuthPlaceholderProps {
  title: string
  message: string
}

export const AuthPlaceholder = ({ title, message }: AuthPlaceholderProps) => {
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center justify-start px-4">
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white/40 backdrop-blur-md rounded-[32px] border border-white/60 shadow-sm max-w-xl w-full">
        <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
          <FiLock size={40} className="text-black/80" /> 
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-600 font-medium mb-8">
          {message}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-black text-white rounded-xl font-bold text-[17px] hover:bg-gray-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
          >
            Log in to your account
          </button>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-black border border-black/10 rounded-xl font-bold text-[17px] hover:bg-gray-50 transition-all w-full sm:w-auto"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPlaceholder
