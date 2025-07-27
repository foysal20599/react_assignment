import { useState } from 'react';
import Assignment from './Assignment'; 
import FontGroupForm from './FontGroupForm';
import Task2 from './Task2';

function Menu() {
  const [active, setActive] = useState('Section1');
  const menuItems = ['Section1', 'Section2', 'Task2'];

  return (
    <>
      {/* Menu Bar */}
      <nav className="bg-white shadow-md p-4 rounded-md flex justify-center space-x-6">
        {menuItems.map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer
              ${active === item ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            {item}
          </button>
        ))}
      </nav>

      {/* Conditional Content */}
      <div className="mt-8">
        {active === 'Section1' && <Assignment />}
        {active === 'Section2' && <FontGroupForm />}
        {active === 'Task2' && <Task2/>}
      </div>
    </>
  );
}

export default Menu;
