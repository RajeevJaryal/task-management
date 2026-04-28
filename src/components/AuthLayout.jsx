import authImg from "../assets/auth-illustration.png";

function AuthIllustration() {
  return (
    <div className="w-full h-full overflow-hidden">
      <img
        src={authImg}
        alt="Auth"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Illustration — hidden on mobile */}
      <div className="hidden md:block h-screen sticky top-0">
        <AuthIllustration />
      </div>

      {/* Form side */}
      <div className="flex items-center justify-center px-5 py-10 md:px-8 lg:px-12 min-h-screen">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}