import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Shirt, Loader2 } from 'lucide-react';
import wardrobeImage from '../../assets/5389512520a665a5d868e1007d17a39727f9fb1b.png';

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    // Simulación de autenticación OAuth con Google
    setTimeout(() => {
      setIsLoading(false);
      navigate('/wardrobe');
    }, 1800);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-background flex flex-col pt-[54px]">
      {/* Header con imagen de fondo */}
      <div className="relative h-[45vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background z-10"></div>
        <img
          src={wardrobeImage}
          alt="Wardrobe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6">
          <div className="w-[72px] h-[72px] rounded-[22px] bg-white/95 backdrop-blur-xl shadow-2xl flex items-center justify-center mb-5">
            <Shirt className="w-9 h-9 text-primary" strokeWidth={2.5} />
          </div>
          <h1 className="text-white text-[32px] mb-2 text-center drop-shadow-2xl tracking-tight">EasyPick</h1>
          <p className="text-white/90 text-center text-[15px] drop-shadow-lg font-medium">
            Tu armario inteligente
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8 -mt-8 relative z-30">
        {/* Card principal */}
        <div className="bg-card rounded-[28px] shadow-[0_10px_40px_rgba(0,0,0,0.15)] p-7 mb-5">
          <h2 className="text-center mb-2 text-[22px]">Bienvenido</h2>
          <p className="text-center text-muted-foreground text-[15px] mb-9 leading-snug">
            Inicia sesión para acceder a tu armario
          </p>

          {/* Botón de Google OAuth */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full h-[52px] bg-white border border-[#00000012] rounded-[14px] flex items-center justify-center gap-3 active:scale-[0.98] active:bg-[#f5f5f5] transition-all shadow-sm disabled:opacity-70 disabled:pointer-events-none"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            )}
            <span className="text-foreground text-[16px] font-medium">
              {isLoading ? 'Iniciando sesión...' : 'Continuar con Google'}
            </span>
          </button>
        </div>

        {/* Info adicional */}
        <div className="text-center px-6">
          <p className="text-[8px] text-muted-foreground leading-relaxed">
            Al continuar, aceptas nuestros{' '}
            <button className="text-[8px]">Términos de Servicio</button>
            {' '}y{' '}
            <button className="text-[8px]">Política de Privacidad</button>
          </p>
        </div>
      </div>

      {/* Bottom spacing for home indicator */}
      <div className="h-8"></div>
    </div>
  );
}
