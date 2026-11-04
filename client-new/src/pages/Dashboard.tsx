import { useQuery } from '@tanstack/react-query';
import { Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { goalsAPI, tasksAPI, statsAPI } from '../lib/api';
import dayjs from 'dayjs';

export function Dashboard() {
  const today = dayjs().format('YYYY-MM-DD');
  const weekStart = dayjs().startOf('week').format('YYYY-MM-DD');

  const { data: goals } = useQuery({
    queryKey: ['goals', 'active'],
    queryFn: () => goalsAPI.getAll('active'),
  });

  const { data: todayTasks } = useQuery({
    queryKey: ['tasks', 'today'],
    queryFn: () => tasksAPI.getAll({ date: today }),
  });

  const { data: stats } = useQuery({
    queryKey: ['stats', weekStart, today],
    queryFn: () => statsAPI.getDashboard(weekStart, today),
  });

  const activeGoals = goals?.data || [];
  const tasks = todayTasks?.data || [];
  const completedTasks = tasks.filter((t: any) => t.status === 'completed');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">工作台</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">今天也要加油哦！</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">{dayjs().format('YYYY年MM月DD日')}</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">{dayjs().format('dddd')}</div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">进行中的目标</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.data?.activeGoals || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">今日任务</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {completedTasks.length}/{tasks.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">本周学习时长</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {Math.floor((stats?.data?.totalStudyMinutes || 0) / 60)}h
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">完成任务数</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                {stats?.data?.completedTasks || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 今日任务 */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">今日任务</h2>
        {tasks.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">暂无任务，添加一个新任务开始吧！</p>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 5).map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center space-x-3 flex-1">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    className="w-5 h-5 text-primary-600 rounded"
                    readOnly
                  />
                  <div className="flex-1">
                    <p className={`font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                      {task.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      预计 {task.estimatedMinutes} 分钟
                    </p>
                  </div>
                </div>
                <span className={`badge ${task.priority === '高' ? 'badge-danger' : task.priority === '中' ? 'badge-warning' : 'badge-primary'}`}>
                  {task.priority}优先级
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 进行中的目标 */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">进行中的目标</h2>
        {activeGoals.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">还没有目标，创建一个新目标吧！</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.slice(0, 4).map((goal: any) => (
              <div key={goal.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{goal.title}</h3>
                  <span className="badge badge-primary">{goal.category}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">进度</span>
                    <span className="font-medium text-gray-900 dark:text-white">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    目标日期：{dayjs(goal.targetDate).format('YYYY-MM-DD')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
