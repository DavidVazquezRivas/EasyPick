import { RouterProvider } from 'react-router';
import { router } from './routes';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      {/* iPhone Frame */}
      <div className="relative w-full max-w-[393px] h-[852px] bg-black rounded-[55px] shadow-2xl border-[14px] border-[#1c1c1e] overflow-hidden">
        {/* Dynamic Island / Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[37px] bg-black rounded-b-[20px] z-50"></div>
        
        {/* Screen Content */}
        <div id="phone-screen" className="relative w-full h-full bg-background flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-[54px] flex items-end pb-2 px-8 justify-between text-[15px] z-40 bg-transparent">
            <span className="font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              {/* Signal */}
              <svg className="w-[18px] h-[12px]" viewBox="0 0 18 12" fill="currentColor">
                <rect x="0" y="7" width="3" height="5" rx="1" />
                <rect x="5" y="4" width="3" height="8" rx="1" />
                <rect x="10" y="1" width="3" height="11" rx="1" />
                <rect x="15" y="0" width="3" height="12" rx="1" />
              </svg>
              {/* WiFi */}
              <svg className="w-[17px] h-[12px]" viewBox="0 0 17 12" fill="currentColor">
                <path d="M8.5 3.5C10.433 3.5 12.2668 4.26384 13.6569 5.56066L15.0711 4.14645C13.3132 2.38861 10.9246 1.5 8.5 1.5C6.07538 1.5 3.68677 2.38861 1.92893 4.14645L3.34315 5.56066C4.73319 4.26384 6.567 3.5 8.5 3.5Z" />
                <path d="M8.5 7C9.43464 7 10.3343 7.38625 11.0711 8.12132L12.4853 6.70711C11.3807 5.60254 9.96957 5 8.5 5C7.03043 5 5.61929 5.60254 4.51472 6.70711L5.92893 8.12132C6.66574 7.38625 7.56536 7 8.5 7Z" />
                <path d="M10 10C10 10.8284 9.32843 11.5 8.5 11.5C7.67157 11.5 7 10.8284 7 10C7 9.17157 7.67157 8.5 8.5 8.5C9.32843 8.5 10 9.17157 10 10Z" />
              </svg>
              {/* Battery */}
              <svg className="w-[25px] h-[12px]" viewBox="0 0 25 12" fill="none">
                <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.5" />
                <path d="M23 4.5C23.8284 4.5 24.5 5.17157 24.5 6C24.5 6.82843 23.8284 7.5 23 7.5V4.5Z" fill="currentColor" fillOpacity="0.5" />
                <rect x="2" y="2" width="18" height="8" rx="1.5" fill="currentColor" />
              </svg>
            </div>
          </div>
          
          <RouterProvider router={router} />
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-36 h-1.5 bg-white/30 rounded-full z-50"></div>
      </div>
    </div>
  );
}
