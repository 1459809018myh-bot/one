import { NavLink } from 'react-router-dom';
import { Home, Target, CheckSquare, BookOpen, BarChart3, Settings } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

const navItems = [
  { path: '/dashboard', icon: Home, label: '工作台' },
  { path: '/goals', icon: Target, label: '学习目标' },
  { path: '/tasks', icon: CheckSquare, label: '任务管理' },
  { path: '/study', icon: BookOpen, label: '学习记录' },
  { path: '/analytics', icon: BarChart3, label: '数据分析' },
  { path: '/settings', icon: Settings, label: '设置' },
];

export function Sidebar() {
  const { sidebarOpen } = useAppStore();

  if (!sidebarOpen) return null;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">学</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">智能学习平台</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI助力成长</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 px-4 py-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">学习者</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">个人空间</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
