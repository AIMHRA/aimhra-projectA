import { useState } from 'react'
import ScreeningPage from './pages/screeningpage'
import './App.css'

export default function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f7f8fa',
      paddingTop: '1rem',
      paddingBottom: '3rem'
    }}>
      {/* Top bar */}
      <nav style={{
        background: '#1D9E75', color: 'white',
        padding: '0.75rem 1.5rem', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: 10
      }}>
        <span style={{ fontSize: 18, fontWeight: 700 }}>AIMHRA</span>
        <span style={{ fontSize: 13, opacity: 0.85 }}>
          AI-Assisted Maternal Health Risk Assessment
        </span>
      </nav>

      <ScreeningPage />
    </div>
  )
}