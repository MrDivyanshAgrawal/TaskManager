import React, { useState } from 'react'
import { useTodo } from '../contexts/TodoContext';
import { motion } from 'framer-motion';
import { FaSave, FaTrashAlt, FaEdit } from 'react-icons/fa';
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox } from 'react-icons/md';
import { BsFlagFill } from 'react-icons/bs';

function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false)
  const [todoMsg, setTodoMsg] = useState(todo.todo)
  const { updateTodo, deleteTodo, toggleComplete } = useTodo()

  const editTodo = () => {
    updateTodo(todo.id, { ...todo, todo: todoMsg })
    setIsTodoEditable(false)
  }
  
  const toggleCompleted = () => {
    toggleComplete(todo.id)
  }

  // Get priority color for border
  const getPriorityColor = () => {
    switch (todo.priority) {
      case 'high': return 'border-red-500';
      case 'low': return 'border-green-500';
      default: return 'border-yellow-500';
    }
  }

  // Get priority flag color
  const getPriorityFlagColor = () => {
    switch (todo.priority) {
      case 'high': return 'text-red-500';
      case 'low': return 'text-green-500';
      default: return 'text-yellow-500';
    }
  }

  // Get priority background color
  const getPriorityBgColor = () => {
    switch (todo.priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={`group flex items-center p-3 mb-2 rounded-lg shadow-md hover:shadow-lg ${
        todo.completed 
          ? "bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500" 
          : `bg-white dark:bg-gray-800 border-l-4 ${getPriorityColor()}`
      }`}
    >
      <div className="flex-1 flex items-center">
        <button 
          onClick={toggleCompleted}
          className="text-xl mr-3 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none"
        >
          {todo.completed 
            ? <MdOutlineCheckBox className="text-green-600" /> 
            : <MdOutlineCheckBoxOutlineBlank />}
        </button>
        
        <input
          type="text"
          className={`flex-1 outline-none ${
            isTodoEditable ? "bg-white dark:bg-gray-700 p-1 rounded border" : "bg-transparent border-none"
          } ${todo.completed ? "line-through text-gray-500" : "text-gray-800 dark:text-white"}`}
          value={todoMsg}
          onChange={(e) => setTodoMsg(e.target.value)}
          readOnly={!isTodoEditable}
        />
      </div>

      <div className="flex gap-1 opacity-80 group-hover:opacity-100">
        {!todo.completed && (
          <button
            className={`p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 ${
              isTodoEditable ? "text-blue-600" : "text-gray-600 dark:text-gray-400"
            }`}
            onClick={() => {
              if (isTodoEditable) {
                editTodo();
              } else setIsTodoEditable(true);
            }}
            disabled={todo.completed}
          >
            {isTodoEditable 
              ? <FaSave className="text-blue-600" /> 
              : <FaEdit />}
          </button>
        )}
        
        <button
          className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-600 dark:text-gray-400 hover:text-red-500"
          onClick={() => deleteTodo(todo.id)}
        >
          <FaTrashAlt />
        </button>
      </div>
      
      {!isTodoEditable && todo.priority && (
        <div className={`ml-2 px-2 py-0.5 text-xs rounded-full flex items-center ${getPriorityBgColor()}`}>
          <BsFlagFill className={`mr-1 ${getPriorityFlagColor()}`} />
          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
        </div>
      )}
    </motion.div>
  );
}

export default TodoItem;
