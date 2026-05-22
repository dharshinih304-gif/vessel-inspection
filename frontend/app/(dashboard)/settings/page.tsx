'use client';

import React, { useState } from 'react';
import { useAccessibility } from '@/components/AccessibilityProvider';
import { 
  Type, 
  Sun, 
  Moon, 
  Contrast, 
  Eye, 
  Smartphone, 
  Check, 
  RefreshCw, 
  Table as TableIcon,
  Layout
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsPage = () => {
  const { 
    textSize, 
    fontFamily, 
    highContrast, 
    darkMode, 
    eyeComfort, 
    dyslexiaFriendly, 
    compactMode, 
    tableTextSize, 
    tableRowSpacing,
    setSettings, 
    resetToFactory 
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'typography' | 'modes' | 'table'>('typography');

  const textSizes: { id: typeof textSize; label: string; size: string }[] = [
    { id: 'small', label: 'Small', size: '14px' },
    { id: 'medium', label: 'Medium', size: '16px' },
    { id: 'large', label: 'Large', size: '18px' },
    { id: 'extra-large', label: 'Extra Large', size: '20px' },
  ];

  const fonts: typeof fontFamily[] = ['Inter', 'Roboto', 'Poppins', 'Open Sans', 'Arial'];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground italic leading-none">Settings</h1>
          <p className="text-muted-foreground mt-4 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Operational Accessibility & Readability Control
          </p>
        </div>
        <button 
          onClick={resetToFactory}
          className="px-6 py-3 bg-secondary/50 rounded-2xl text-[10px] font-black text-accent uppercase tracking-widest hover:bg-accent hover:text-white transition-all flex items-center gap-2 border border-border shadow-sm"
        >
          <RefreshCw className="w-3 h-3" /> Reset to Factory
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Navigation Sidebar (Mobile Horizontal, Desktop Vertical) */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'typography', label: 'Typography', icon: Type },
            { id: 'modes', label: 'Visual Modes', icon: Eye },
            { id: 'table', label: 'Data Readability', icon: TableIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-6 py-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all border",
                activeTab === tab.id 
                  ? "bg-accent text-white border-accent shadow-lg shadow-accent/20" 
                  : "bg-card text-muted-foreground border-border hover:border-accent/50"
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-9 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'typography' && (
              <motion.div 
                key="typography"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                {/* Text Size Presets */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-accent tracking-[0.3em] block">Base Typography Scale</label>
                  <div className="grid grid-cols-2 gap-3">
                    {textSizes.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => setSettings({ textSize: size.id })}
                        className={cn(
                          "px-4 py-6 rounded-[2rem] border transition-all flex flex-col items-center gap-3",
                          textSize === size.id 
                            ? "bg-accent/10 border-accent text-accent shadow-inner" 
                            : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        <span className="font-black text-xs uppercase tracking-widest">{size.label}</span>
                        <span className="text-[10px] font-bold opacity-60">{size.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font Family Selection */}
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-accent tracking-[0.3em] block">Interface Typeface</label>
                  <div className="space-y-2">
                    {fonts.map((font) => (
                      <button
                        key={font}
                        onClick={() => setSettings({ fontFamily: font })}
                        style={{ fontFamily: font }}
                        className={cn(
                          "w-full px-6 py-4 rounded-2xl border transition-all flex items-center justify-between",
                          fontFamily === font 
                            ? "bg-accent/10 border-accent text-accent" 
                            : "bg-card border-border text-foreground hover:bg-secondary/50"
                        )}
                      >
                        <span className="font-bold text-sm">{font}</span>
                        {fontFamily === font && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'modes' && (
              <motion.div 
                key="modes"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <label className="text-[10px] font-black uppercase text-accent tracking-[0.3em] block">Display Environments</label>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { id: 'darkMode', label: 'Dark Mode (Midnight)', icon: Moon, value: darkMode },
                      { id: 'highContrast', label: 'High Contrast Mode', icon: Contrast, value: highContrast },
                      { id: 'eyeComfort', label: 'Eye Comfort (Warm)', icon: Sun, value: eyeComfort },
                      { id: 'dyslexiaFriendly', label: 'Dyslexia Friendly Font', icon: Smartphone, value: dyslexiaFriendly },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setSettings({ [mode.id]: !mode.value } as any)}
                        className={cn(
                          "w-full px-6 py-5 rounded-[2rem] border transition-all flex items-center justify-between",
                          mode.value 
                            ? "bg-accent/10 border-accent text-accent" 
                            : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <mode.icon className="w-5 h-5" />
                          <span className="font-black text-[10px] uppercase tracking-[0.2em]">{mode.label}</span>
                        </div>
                        <div className={cn(
                          "w-10 h-5 rounded-full relative transition-all border toggle-track",
                          mode.value ? "bg-accent border-accent" : "bg-muted border-transparent"
                        )}>
                          <div className={cn(
                            "absolute top-1 w-3 h-3 bg-white rounded-full transition-all toggle-thumb",
                            mode.value ? "left-6" : "left-1"
                          )} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'table' && (
              <motion.div 
                key="table"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="space-y-8">
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase text-accent tracking-[0.3em]">Registry Text Size</label>
                      <span className="text-xl font-black text-foreground">{tableTextSize}PX</span>
                    </div>
                    <input 
                      type="range" min="10" max="30" step="1"
                      value={tableTextSize}
                      onChange={(e) => setSettings({ tableTextSize: parseInt(e.target.value) })}
                      className="w-full h-2 bg-secondary rounded-full appearance-none accent-accent cursor-pointer"
                    />
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase text-accent tracking-[0.3em]">Registry Row Spacing</label>
                      <span className="text-xl font-black text-foreground">{tableRowSpacing}PX</span>
                    </div>
                    <input 
                      type="range" min="4" max="48" step="4"
                      value={tableRowSpacing}
                      onChange={(e) => setSettings({ tableRowSpacing: parseInt(e.target.value) })}
                      className="w-full h-2 bg-secondary rounded-full appearance-none accent-accent cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => setSettings({ compactMode: !compactMode })}
                    className={cn(
                      "w-full px-6 py-5 rounded-[2rem] border transition-all flex items-center justify-between",
                      compactMode 
                        ? "bg-accent/10 border-accent text-accent" 
                        : "bg-card border-border text-muted-foreground hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Layout className="w-5 h-5" />
                      <span className="font-black text-[10px] uppercase tracking-[0.2em]">Compact Reading Mode</span>
                    </div>
                    <Check className={cn("w-4 h-4 transition-opacity", compactMode ? "opacity-100" : "opacity-0")} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
