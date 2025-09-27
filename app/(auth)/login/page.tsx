import { LoginForm } from '@/components/auth/login-form'
import { redirectIfAuthenticated } from '@/lib/auth-guard'

export default async function Page() {
  await redirectIfAuthenticated("/app");

  return (
    <div className="flex min-h-svh w-full justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
