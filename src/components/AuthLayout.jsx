import authImg from "../assets/auth-illustration.png";

function AuthIllustration() {
  return (
    <div className="w-full h-screen overflow-hidden">
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
      <div className="hidden md:block">
        <AuthIllustration />
      </div>
      <div className="flex items-center justify-center px-6">{children}</div>
    </div>
  );
}
