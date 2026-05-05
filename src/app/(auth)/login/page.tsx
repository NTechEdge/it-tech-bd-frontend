import { Suspense } from 'react'
import LoginPage from './LoginPage'

export default function page() {
  return (
    <div>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="w-12 h-12 border-4 border-[#0099ff] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <LoginPage />
      </Suspense>
    </div>
  )
}
