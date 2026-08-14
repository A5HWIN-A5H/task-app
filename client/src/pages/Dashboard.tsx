import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { LogOut, Loader2, Plus, Trash2, Edit2, Calendar, Search, Filter, ChevronLeft, ChevronRight, Moon, Sun, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { taskApi, type Task } from '../services/task.api';
import { TaskModal } from '../components/tasks/TaskModal';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const queryClient = useQueryClient();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tasks', { page, status, priority, search }],
    queryFn: () => taskApi.getTasks({ page, limit: 9, status, priority, search }),
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteMutation.mutate(id);
    }
  };

  const openEditModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const statusColors: Record<string, string> = {
    TODO: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    IN_PROGRESS: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'text-gray-500 dark:text-gray-400',
    MEDIUM: 'text-yellow-600 dark:text-yellow-500',
    HIGH: 'text-orange-600 dark:text-orange-500',
    URGENT: 'text-red-600 font-bold dark:text-red-400',
  };

  const pagination = data?.data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">TaskFlow</h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">Hello, {user?.name}</span>
              
              {user?.role === 'ADMIN' && (
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-1 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-md transition text-sm font-medium"
                >
                  <ShieldAlert size={18} />
                  <span>Admin</span>
                </Link>
              )}
              
              <button 
                onClick={toggleTheme} 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button 
                onClick={logout} 
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition" 
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>

          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
          <button 
            onClick={openCreateModal}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 dark:hover:bg-indigo-500 transition shadow-sm whitespace-nowrap"
          >
            <Plus size={20} />
            <span>New Task</span>
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div className="flex gap-4">
            <div className="relative flex items-center">
              <Filter size={18} className="text-gray-400 dark:text-gray-500 absolute left-3" />
              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">All Statuses</option>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <select
              value={priority}
              onChange={(e) => { setPriority(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          </div>
        )}

        {!isLoading && !isError && data?.data?.tasks?.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or create a new task.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {!isLoading && data?.data?.tasks?.map((task: Task) => (
            <div key={task._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition group flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
                  {task.status.replace('_', ' ')}
                </span>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => openEditModal(task)} className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => handleDelete(task._id)} disabled={deleteMutation.isPending} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{task.title}</h3>
              {task.description && <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{task.description}</p>}
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className={`text-sm ${priorityColors[task.priority]}`}>{task.priority} Priority</span>
                {task.dueDate && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar size={14} className="mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {!isLoading && pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-auto">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 border dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page <span className="font-medium text-gray-900 dark:text-white">{page}</span> of <span className="font-medium text-gray-900 dark:text-white">{pagination.totalPages}</span>
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="p-2 border dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} taskToEdit={selectedTask} />
    </div>
  );
};