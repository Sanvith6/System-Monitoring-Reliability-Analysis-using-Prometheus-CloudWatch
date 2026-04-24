import React from 'react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Navigation */}
      <header className="bg-white border-b border-primary-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-accent p-1.5 rounded-lg text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-primary-950">
              User<span className="text-accent">Sync</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 bg-primary-100 text-primary-600 rounded-full border border-primary-200">
              AWS Production Ready
            </span>
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-accent to-blue-400 border-2 border-white shadow-sm"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-4">
        <Dashboard />
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-primary-200 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-primary-500">
            © 2024 UserSync Dashboard • Architected for AWS with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
