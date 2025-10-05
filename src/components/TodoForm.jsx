import React, { useState, useRef, useEffect } from 'react'
import { useTodo } from '../contexts/TodoContext';
import { IoMdAdd } from 'react-icons/io';
import { BiDownArrow, BiMinus, BiUpArrow } from 'react-icons/bi';

function TodoForm() {
    const [todo, setTodo] = useState("");
    const [priority, setPriority] = useState("normal");
    const {addTodo} = useTodo();
    const inputRef = useRef(null);

    useEffect(() => {
      // Auto-focus the input field when component mounts
      inputRef.current.focus();
    }, []);

    const add = (e) => {
      e.preventDefault();
      if (!todo.trim()) return;

      addTodo({ 
        todo: todo.trim(), 
        completed: false,
        priority,
        createdAt: new Date().toISOString()
      });
      setTodo("");
      setPriority("normal");
      inputRef.current.focus();
    };

    return (
      <form onSubmit={add} className="mb-6">
        <div className="flex mb-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-l-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
          />
          <button 
            type="submit" 
            className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-r-lg 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
          >
            <IoMdAdd className="mr-1 text-lg" /> Add
          </button>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <p className="text-gray-600 dark:text-gray-300">Priority:</p>
          <div className="flex gap-2">
            {[
              { value: "low", label: "Low", icon: <BiDownArrow />, color: "text-green-500" },
              { value: "normal", label: "Normal", icon: <BiMinus />, color: "text-yellow-500" },
              { value: "high", label: "High", icon: <BiUpArrow />, color: "text-red-500" }
            ].map((p) => (
              <label key={p.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="priority"
                  className="mr-1 hidden"
                  value={p.value}
                  checked={priority === p.value}
                  onChange={() => setPriority(p.value)}
                />
                <span className={`flex items-center px-2 py-1 rounded ${
                  priority === p.value 
                    ? `bg-gray-200 dark:bg-gray-700 ${p.color}` 
                    : 'text-gray-500'
                }`}>
                  {p.icon} {p.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </form>
    );
}

export default TodoForm;
