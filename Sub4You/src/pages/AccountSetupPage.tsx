import type { FormEvent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import type { AccountRole, UserIntent } from '../context/AppFlowContext'
import { useAppFlow } from '../context/AppFlowContext'

const roleCopy: Record<AccountRole, string> = {
  subleaseSeeker: 'I am looking for a sublease',
  subletProvider: 'I have a place to sublet',
}

const intentMap: Record<UserIntent, AccountRole> = {
  find: 'subleaseSeeker',
  offer: 'subletProvider',
}

export const AccountSetupPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { intent, setIntent, saveAccount } = useAppFlow()
  const query = useMemo(() => new URLSearchParams(location.search), [location.search])
  const intentFromQuery = query.get('intent') as UserIntent | null
  const sessionIntent: UserIntent = intentFromQuery ?? intent ?? 'find'

  useEffect(() => {
    if (intentFromQuery && intentFromQuery !== intent) {
      setIntent(intentFromQuery)
    }
  }, [intentFromQuery, intent, setIntent])

  const [role, setRole] = useState<AccountRole>(() => intentMap[sessionIntent])
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'sending' | 'verified'>(
    'idle',
  )
  const [error, setError] = useState<string | null>(null)

  const handleVerifyEmail = () => {
    setError(null)
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to verify.')
      return
    }

    setVerificationStatus('sending')
    setTimeout(() => {
      setVerificationStatus('verified')
    }, 600)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (verificationStatus !== 'verified') {
      setError('Please verify your email before continuing.')
      return
    }
    if (!fullName || !email) {
      setError('Add your name and email to continue.')
      return
    }

    saveAccount({
      role,
      fullName,
      email,
      isEmailVerified: verificationStatus === 'verified',
    })

    const nextRoute = sessionIntent === 'find' ? '/profile-builder' : '/listing-builder'
    navigate(nextRoute)
  }

  return (
    <div className="page">
      <TopBar />
      <main className="content single-column">
        <section className="card">
          <span className="badge subtle">Create your account</span>
          <h1 className="section-title">Let’s personalize your sub4you experience</h1>
          <p className="section-subtitle">
            Tell us what brings you here so we can tailor listings, matches, and messaging to your
            goals.
          </p>
          <form className="form" onSubmit={handleSubmit}>
            <div className="field-group horizontal">
              {(Object.keys(roleCopy) as Array<AccountRole>).map((option) => (
                <label
                  className={`chip ${role === option ? 'selected' : ''}`}
                  key={option}
                  htmlFor={option}
                >
                  <input
                    id={option}
                    type="radio"
                    name="role"
                    value={option}
                    checked={role === option}
                    onChange={() => setRole(option)}
                  />
                  {roleCopy[option]}
                </label>
              ))}
            </div>
            <div className="field-group">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                placeholder="Jordan Smith"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <div className="field-with-button">
                <input
                  id="email"
                  type="email"
                  placeholder="you@university.edu"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    setVerificationStatus('idle')
                  }}
                />
                <button
                  type="button"
                  className="ghost-button"
                  onClick={handleVerifyEmail}
                  disabled={verificationStatus === 'sending'}
                >
                  {verificationStatus === 'verified'
                    ? 'Verified'
                    : verificationStatus === 'sending'
                    ? 'Verifying...'
                    : 'Verify email'}
                </button>
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            <button className="primary-button expanded" type="submit">
              Sign up
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}
