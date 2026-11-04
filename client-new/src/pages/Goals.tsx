import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { goalsAPI } from '../lib/api';

export function Goals() {
  const [filter, setFilter] = useState<string>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['goals', filter],
    queryFn: () => filter === 'all' ? goalsAPI.getAll() : goalsAPI.getAll(filter),
  });

  const goals = data?.data || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">学习目标</h1>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>新建目标</span>
        </button>
      </div>

      <div className="flex space-x-2">
        {['all', 'planning', 'active', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {status === 'all' ? '全部' : status === 'planning' ? '规划中' : status === 'active' ? '进行中' : '已完成'}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12">加载中...</div>
      ) : goals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">还没有目标，创建你的第一个学习目标吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal: any) => (
            <div key={goal.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <span className="badge badge-primary">{goal.category}</span>
                <span className={`badge ${goal.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                  {goal.status}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{goal.title}</h3>
              {goal.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{goal.description}</p>
              )}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">进度</span>
                  <span className="font-medium">{goal.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-primary-500 h-2 rounded-full"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  目标：{goal.targetDate} · {goal.estimatedHours}小时
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
