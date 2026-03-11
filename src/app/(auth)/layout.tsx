import { InteractiveBackground } from "@/components/layout/InteractiveBackground";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <InteractiveBackground />

      <div className="fixed inset-0 z-0 flex items-center justify-center p-4 lg:p-8 overflow-hidden">
        <div
          className="
            relative w-full max-w-md lg:max-w-lg
            bg-white/80 backdrop-blur-2xl
            rounded-[32px] border border-white/40
            shadow-2xl overflow-hidden flex flex-col
            transition-all duration-500 ease-out
            max-h-[90dvh]
          "
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
