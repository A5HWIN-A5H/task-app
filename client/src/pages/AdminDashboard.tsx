import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, CheckCircle, Clock, LayoutList, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminApi } from '../services/admin.api';
import { useAuth } from '../context/AuthContext';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['adminStats'],
    queryFn: adminApi.getStats,
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: adminApi.getUsers,
  });

  const toggleStatusMutation = useMutation({
    mutationFn: adminApi.toggleUserStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    },
  });

  const handleToggle = (userId: string) => {
    if (window.confirm('Are you sure you want to change this user\'s access?')) {
      toggleStatusMutation.mutate(userId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <ShieldAlert className="text-indigo-600 dark:text-indigo-400" size={28} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Control Panel</h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400">Manage platform users and view system metrics.</p>
          </div>
          <Link to="/dashboard" className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline">
            <ArrowLeft size={16} className="mr-1" /> Back to My Tasks
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Users" value={stats?.totalUsers} icon={<Users />} color="bg-blue-500" loading={statsLoading} />
          <StatCard title="Total Tasks" value={stats?.totalTasks} icon={<LayoutList />} color="bg-indigo-500" loading={statsLoading} />
          <StatCard title="Completed Tasks" value={stats?.statusCounts.COMPLETED} icon={<CheckCircle />} color="bg-green-500" loading={statsLoading} />
          <StatCard title="Pending Tasks" value={(stats?.statusCounts.TODO || 0) + (stats?.statusCounts.IN_PROGRESS || 0)} icon={<Clock />} color="bg-yellow-500" loading={statsLoading} />
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Registered Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {usersLoading ? (
                  <tr><td colSpan={4} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">Loading users...</td></tr>
                ) : (
                  users?.map((u) => (
                    <tr key={u._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {u._id !== user?._id && (
                          <button
                            onClick={() => handleToggle(u._id)}
                            disabled={toggleStatusMutation.isPending}
                            className={`${u.isActive ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300' : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'}`}
                          >
                            {u.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, loading }: any) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex items-center">
    <div className={`p-3 rounded-full ${color} text-white mr-4`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {loading ? (
        <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-1"></div>
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value || 0}</p>
      )}
    </div>
  </div>
);