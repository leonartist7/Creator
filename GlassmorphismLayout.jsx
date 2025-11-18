'use client';

import { useState } from 'react';

export default function GlassmorphismLayout() {
  const [bgColor, setBgColor] = useState('#050816');

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      {/* Glassmorphism Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="text-white text-2xl font-bold tracking-wide">
              Lionovart
            </div>

            {/* Background Color Picker */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-lg hover:bg-white/15 transition-all duration-300">
              <label htmlFor="bgPicker" className="text-white/90 text-sm font-medium">
                Background
              </label>
              <input
                id="bgPicker"
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border-2 border-white/30 hover:border-white/50 transition-all duration-200 shadow-md"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-white mb-6">
            Glassmorphism Design
          </h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Experience the beauty of liquid-glass aesthetics. Use the color picker above
            to dynamically change the background and see how the glassmorphism effect
            adapts to different colors. The navbar features a semi-transparent backdrop
            with blur effects, creating an elegant floating appearance.
          </p>
        </div>
      </main>
    </div>
  );
}
