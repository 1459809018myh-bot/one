import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Tasks } from './pages/Tasks';
import { Study } from './pages/Study';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';
import { LoadingScreen } from './components/LoadingScreen';
import { useAppStore } from './store/useAppStore';
import { settingsAPI } from './lib/api';

function App() {
  const { setSettings, theme, setTheme } = useAppStore();

  // 加载用户设置
  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await settingsAPI.get();
      return res.data;
    },
  });

  useEffect(() => {
    if (data) {
      setSettings(data);
      setTheme(data.theme || 'auto');
    }
  }, [data, setSettings, setTheme]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="goals" element={<Goals />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="study" element={<Study />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App;
