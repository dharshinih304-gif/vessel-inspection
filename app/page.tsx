'use client';

import { motion } from 'framer-motion';
import { ShieldAlert, Ship, ChevronRight, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-600/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 shadow-2xl rounded-[2rem] p-12 text-center overflow-hidden relative">
          
          {/* Subtle top gradient bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400"></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
            className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-slate-700/50 relative group"
          >
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Ship className="w-10 h-10 text-blue-400 relative z-10" />
          </motion.div>

          <h1 className="text-2xl font-bold text-white tracking-wide mb-6 uppercase">
            Enterprise Inspection System
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
            Authorized access only. Proceed to the secure authentication gateway to manage global fleet operations and technical audits.
          </p>

          <Link href="/login" className="group block w-full">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white py-4 px-6 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all duration-300 border border-blue-500/30"
            >
              <Lock className="w-4 h-4 opacity-70" />
              <span>Access Secure Portal</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform opacity-70" />
            </motion.div>
          </Link>

          <div className="mt-8 pt-6 border-t border-slate-800/50 flex items-center justify-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            <ShieldAlert className="w-3.5 h-3.5" />
            Super Admin Gateway
          </div>
        </div>
      </motion.div>
    </div>
  );
}
