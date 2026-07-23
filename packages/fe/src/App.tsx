import React from 'react';
import { PolicyList } from './components/PolicyList';
import './styles.css';

export function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Cedar Policy Playground</h1>
        <nav>
          <a href="#policies" className="active">Policies</a>
        </nav>
      </header>
      <main>
        <PolicyList />
      </main>
    </div>
  );
}
