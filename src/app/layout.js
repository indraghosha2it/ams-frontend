

// // src/app/layout.js
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import { Toaster } from 'react-hot-toast';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata = {
//   title: "AppointmentPro - Professional Appointment Management",
//   description: "Streamline your appointments with our professional management system",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en" className="scroll-smooth">
//       <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//         {children}
//         <Toaster 
//           position="top-right"
//           toastOptions={{
//             duration: 3000,
//             style: {
//               background: 'var(--card)',
//               color: 'var(--foreground)',
//               border: '1px solid rgba(255, 255, 255, 0.1)',
//               borderRadius: 'var(--radius-md)',
//             },
//           }}
//         />
//       </body>
//     </html>
//   );
// };

// src/app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AppointmentPro - Professional Appointment Management",
  description: "Streamline your appointments with our professional management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'var(--card)',
              color: 'var(--foreground)',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            }
          }}
        />
      </body>
    </html>
  );
}