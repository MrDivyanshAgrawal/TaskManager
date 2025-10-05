import React, { useState, useEffect, useMemo, useRef } from 'react'
import { AnimatePresence } from 'framer-motion'
import { TodoProvider } from './contexts/TodoContext'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import { FaTasks, FaPalette, FaChevronDown } from 'react-icons/fa';
import { BsSearch, BsSortDown, BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { BiX } from 'react-icons/bi';
import { MdOutlineDone, MdOutlineClearAll } from 'react-icons/md';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import logo from '/task.svg'; 

function App() {
  const [todos, setTodos] = useState([])
  const [darkMode, setDarkMode] = useState(() => 
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [filter, setFilter] = useState('all') // all, active, completed
  const [sortBy, setSortBy] = useState('newest') // newest, oldest, priority
  const [searchTerm, setSearchTerm] = useState('')
  const [bgPattern, setBgPattern] = useState(() => 
    localStorage.getItem('bgPattern') || 'pattern' // pattern, dots, grid, circuit
  )
  const [animated, setAnimated] = useState(() => 
    localStorage.getItem('animatedBg') === 'true' || false
  )
  const [bgMenuOpen, setBgMenuOpen] = useState(false)
  const bgMenuRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (bgMenuRef.current && !bgMenuRef.current.contains(event.target)) {
        setBgMenuOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [bgMenuRef]);

  // Load todos from localStorage
  useEffect(() => {
    try {
      const savedTodos = JSON.parse(localStorage.getItem("todos"))
      if (savedTodos && savedTodos.length > 0) {
        setTodos(savedTodos)
      }
    } catch (error) {
      console.error("Error loading todos from localStorage:", error);
    }
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Save background preferences
  useEffect(() => {
    localStorage.setItem('bgPattern', bgPattern)
    localStorage.setItem('animatedBg', animated.toString())
  }, [bgPattern, animated])

  // CRUD Operations
  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev])
  }

  const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }

  const toggleComplete = (id) => {
    setTodos((prev) => 
      prev.map((prevTodo) => 
        prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))
  }

  // Filter and sort todos
  const filteredAndSortedTodos = useMemo(() => {
    let filtered = [...todos]
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(todo => 
        todo.todo.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply status filter
    if (filter === 'active') {
      filtered = filtered.filter(todo => !todo.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter(todo => todo.completed)
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      filtered.sort((a, b) => b.id - a.id)
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => a.id - b.id)
    } else if (sortBy === 'priority') {
      const priorityOrder = { high: 1, normal: 2, low: 3 }
      filtered.sort((a, b) => 
        (priorityOrder[a.priority] || 99) - (priorityOrder[b.priority] || 99)
      )
    }
    
    return filtered
  }, [todos, filter, sortBy, searchTerm])

  // Bulk actions
  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed))
  }
  
  const markAllCompleted = () => {
    setTodos(todos.map(todo => ({ ...todo, completed: true })))
  }

  // Get background class based on preferences
  const getBackgroundClass = () => {
    let bgClass = '';

    // Add base pattern
    switch (bgPattern) {
      case 'dots':
        bgClass = darkMode ? 'bg-dots-dark' : 'bg-dots-light';
        break;
      case 'grid':
        bgClass = darkMode ? 'bg-grid-dark' : 'bg-grid-light';
        break;
      case 'circuit':
        bgClass = darkMode ? 'bg-circuit-dark' : 'bg-circuit-light';
        break;
      default:
        bgClass = darkMode ? 'bg-pattern-dark' : 'bg-pattern-light';
    }

    // Add animation if enabled
    if (animated) {
      bgClass += ' bg-pattern-animated';
    }

    return bgClass;
  }

  // Calculate adaptive height for todo list
  const getListHeight = () => {
    const baseHeight = 300; // Minimum height
    const itemHeight = 80; // Approximate height per item
    const maxHeight = 600; // Maximum height

    // Calculate based on number of todos
    const calculatedHeight = Math.max(baseHeight, Math.min(maxHeight, filteredAndSortedTodos.length * itemHeight));
    
    // Return appropriate height
    return calculatedHeight;
  }

  // Background pattern options with preview colors
  const bgOptions = [
    { 
      value: 'pattern', 
      label: 'Diamond Pattern',
      lightColor: 'from-indigo-100 to-indigo-50',
      darkColor: 'from-indigo-900/30 to-indigo-800/30'
    },
    { 
      value: 'dots', 
      label: 'Dots Pattern',
      lightColor: 'from-blue-100 to-blue-50',
      darkColor: 'from-blue-900/30 to-blue-800/30'
    },
    { 
      value: 'grid', 
      label: 'Grid Pattern',
      lightColor: 'from-purple-100 to-purple-50',
      darkColor: 'from-purple-900/30 to-purple-800/30'
    },
    { 
      value: 'circuit', 
      label: 'Circuit Pattern',
      lightColor: 'from-emerald-100 to-emerald-50',
      darkColor: 'from-emerald-900/30 to-emerald-800/30'
    }
  ];

  return (
    <TodoProvider value={{todos, addTodo, updateTodo, deleteTodo, toggleComplete}}>
      <div className={`min-h-screen py-8 ${getBackgroundClass()}`}>
        <div className="w-full max-w-3xl mx-auto px-4">
          {/* App header */}
          <header className="mb-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Task Manager Logo" className="w-12 h-12" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-indigo-600 dark:text-indigo-400">Task Manager</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Organize your tasks efficiently</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {/* Background Pattern Menu */}
              <div className="relative" ref={bgMenuRef}>
                <button 
                  className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                  onClick={() => setBgMenuOpen(!bgMenuOpen)}
                  aria-label="Change background pattern"
                >
                  <FaPalette className="text-indigo-600 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Theme</span>
                  <FaChevronDown className={`transition-transform text-xs ${bgMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {bgMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-20 border border-gray-200 dark:border-gray-700 min-w-[220px]">
                    <div className="font-medium text-gray-800 dark:text-gray-200 mb-3 pb-2 border-b border-gray-200 dark:border-gray-700">
                      Background Pattern
                    </div>
                    <div className="grid gap-2">
                      {bgOptions.map(option => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setBgPattern(option.value);
                            setBgMenuOpen(false);
                          }}
                          className={`text-left p-2 rounded-lg flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                        >
                          <div className="flex items-center">
                            <div className={`w-5 h-5 rounded mr-2 bg-gradient-to-br ${darkMode ? option.darkColor : option.lightColor} border border-gray-300 dark:border-gray-600`}></div>
                            <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                          </div>
                          {bgPattern === option.value && (
                            <IoMdCheckmarkCircle className="text-indigo-600 dark:text-indigo-400 text-lg" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <label className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                        <span className="text-gray-700 dark:text-gray-300">Animated Background</span>
                        <div className={`w-10 h-5 rounded-full p-1 ${animated ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-600'}`}>
                          <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-300 ${animated ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                        <input
                          type="checkbox"
                          className="hidden"
                          checked={animated}
                          onChange={() => setAnimated(!animated)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Toggle */}
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-md border border-gray-200 dark:border-gray-700 text-indigo-600 dark:text-yellow-400"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode 
                  ? <BsFillSunFill className="text-xl" /> 
                  : <BsFillMoonFill className="text-xl" />}
              </button>
            </div>
          </header>
        
          {/* TodoForm component */}
          <TodoForm />
        
          {/* Search and filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                  dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <BsSearch className="absolute left-3 top-2.5 text-gray-400" />
                
                {searchTerm && (
                  <button
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                  >
                    <BiX />
                  </button>
                )}
              </div>
            
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-[120px]">
                  <select 
                    className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    aria-label="Filter tasks"
                  >
                    <option value="all">All tasks</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="flex-1 min-w-[120px] flex items-center relative">
                  <BsSortDown className="absolute left-3 text-gray-500 dark:text-gray-400" />
                  <select 
                    className="w-full pl-8 p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    aria-label="Sort tasks"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="priority">Priority</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                <FaTasks className="mr-2" />
                <span className="font-medium">{todos.filter(t => !t.completed).length}</span> items left
              </span>
              
              <div className="flex gap-4 flex-wrap">
                <button 
                  className={`text-sm flex items-center px-3 py-1 rounded-lg transition-colors ${
                    todos.length > 0 && !todos.every(t => t.completed)
                      ? "text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={markAllCompleted}
                  disabled={todos.length === 0 || todos.every(t => t.completed)}
                >
                  <MdOutlineDone className="mr-1" /> Mark all complete
                </button>
                <button 
                  className={`text-sm flex items-center px-3 py-1 rounded-lg transition-colors ${
                    todos.some(t => t.completed)
                      ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={clearCompleted}
                  disabled={!todos.some(t => t.completed)}
                >
                  <MdOutlineClearAll className="mr-1" /> Clear completed
                </button>
              </div>
            </div>
          </div>
        
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
            <AnimatePresence>
              {filteredAndSortedTodos.length > 0 ? (
                filteredAndSortedTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium flex items-center justify-center">
                    <FaTasks className="mr-2" /> No tasks found
                  </p>
                  <p className="text-sm mt-1">
                    {searchTerm 
                      ? 'Try a different search term or filter' 
                      : todos.length === 0 
                        ? 'Add a new task to get started' 
                        : 'No tasks match the current filter'}
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="flex items-center justify-center">
              <img src={logo} alt="Task Manager Logo" className="w-5 h-5 mr-2" />
              © {new Date().getFullYear()} Task Manager • Simple and efficient todo management
            </p>
          </footer>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
