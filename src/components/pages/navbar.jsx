import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    const role = localStorage.getItem('role');
    
  return (
    <>
    <div>      <nav className="bg-green-900 text-white py-4 px-6 flex justify-center space-x-4">
      <Link
        to="/user"
        className="text-white hover:bg-green-700 focus:ring focus:ring-green-300 px-4 py-2 rounded transition"
      >
        User Dashboard
      </Link>
      <Link
        to="/loan-application"
        className="text-white hover:bg-green-700 focus:ring focus:ring-green-300 px-4 py-2 rounded transition"
      >
        Loan Application Form
      </Link>
     {role === 'verifier' && <Link
        to="/verifier"
        className="text-white hover:bg-green-700 focus:ring focus:ring-green-300 px-4 py-2 rounded transition"
      >
        Verifier Dashboard
      </Link>}
      {role === 'admin' && <Link
        to="/admin"
        className="text-white hover:bg-green-700 focus:ring focus:ring-green-300 px-4 py-2 rounded transition"
      >
        Admin Dashboard
      </Link>}
</nav>
</div>

    </>
  )
}

export default Navbar
