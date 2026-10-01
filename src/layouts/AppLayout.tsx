import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar, Topbar } from '../components/Chrome';

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="shell">
      <Topbar onMenu={() => setOpen(true)} />
      <div className="body">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="main"><Outlet /></main>
      </div>
    </div>
  );
}
