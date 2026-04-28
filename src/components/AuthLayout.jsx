import authImg from "../assets/auth-illustration.png";

function AuthIllustration() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-100">
      <img
        src={authImg}
        alt="Authentication illustration"
        className="h-full w-full object-cover object-center"
      />
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-dvh bg-white lg:grid lg:grid-cols-2">
      {/* Hidden on mobile, visible on PC */}
      <aside className="hidden lg:block lg:h-dvh lg:sticky lg:top-0">
        <AuthIllustration />
      </aside>

      {/* Full screen form area on mobile */}
      <main className="flex h-dvh w-full items-center justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-12">
        <div className="w-full sm:max-w-md lg:max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}
