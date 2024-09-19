import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from "../../components/ui/button";
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Assuming you're using axios for API requests

export default function UserDashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);

  // Fetch loans from the backend
  useEffect(() => {
    // Fetch loans from the backend
    axios
      .get('http://localhost:5000/api/loans/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add Authorization header
        },
      })
      .then((response) => {
        setLoans(response.data); // Assuming the response data contains loans
      })
      .catch((error) => {
        console.error('Error fetching loans:', error);
      });
  }, []);
  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-green-700">CREDIT APP</h1>
              <nav className="ml-10">
                <ul className="flex space-x-4">
                  <li><a href="#" className="text-green-700 font-medium">Home</a></li>
                  <li><a href="#" className="text-gray-500">Payments</a></li>
                  <li><a href="#" className="text-gray-500">Budget</a></li>
                  <li><a href="#" className="text-gray-500">Card</a></li>
                </ul>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-500"><Search className="w-5 h-5" /></button>
              <button className="text-gray-500"><span className="sr-only">Notifications</span>🔔</button>
              <button className="text-gray-500"><span className="sr-only">Settings</span>⚙</button>
              <button className="text-gray-500" onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-green-500 text-white p-3 rounded-lg mr-4">💵</div>
              <div>
                <p className="text-sm text-gray-500">BALANCE</p>
                <p className="text-3xl font-bold">$0.0</p>
              </div>
            </div>
            <Button>Get a Loan</Button>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" className="flex-1">Borrow Cash</Button>
            <Button variant="outline" className="flex-1">Transact</Button>
            <Button variant="outline" className="flex-1">Deposit Cash</Button>
          </div>
        </div>

        <div className="mb-6">
          <Input type="text" placeholder="Search for loans" className="w-full" />
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Applied Loans</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <button>Sort</button>
              <button>Filter</button>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Officer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Applied</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loans.length > 0 ? (
                loans.map((loan, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg?height=32&width=32" alt={loan.fullName[0]} />
                          <AvatarFallback>{loan.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{loan.fullName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${loan.loanAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{loan.applicationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={
                        loan.status === "Pending" ? "warning" :
                        loan.status === "Approved" ? "success" :
                        loan.status === "Rejected" ? "destructive" :
                        "default"
                      }>{loan.status}</Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                    No loans available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
