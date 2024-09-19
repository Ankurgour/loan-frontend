import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { ChevronLeft, ChevronRight, Menu, Bell, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

function VerifierDashboard() {
  const [loans, setLoans] = useState([]);
  const token = localStorage.getItem('token')

  const dashboardStats = {
    totalLoans: 50,
    totalBorrowers: 100,
    cashDisbursed: 550000,
    savings: 450000,
    repaidLoans: 30,
    cashReceived: 1000000,
  };

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/loans/all',{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }); // Adjust this URL based on your backend API
        console.log(response.data)
        setLoans(response.data)
        console.log(loans)

      } catch (error) {
        console.error("Error fetching loans:", error);
      }
    };

    fetchLoans();
  }, []);
  useEffect(() => {
    console.log(loans);  // This will now log the updated loans
  }, [loans]);

  const updateLoanStatus = async (id, newStatus) => {
    try {
        
      await fetch(`http://localhost:5000/api/loans/update-status/${id}`,
        {
            method:'PATCH',
        headers:{
            Authorization:`Bearer ${token}`
        },
        body:JSON.stringify({status:newStatus})
      }); // Adjust the URL and payload based on your backend API
      setLoans(loans.map(loan =>
        loan._id === id ? { ...loan, status: newStatus } : loan
      ));
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-green-800 text-white p-4">
        <h2 className="text-xl font-bold mb-4">CREDIT APP</h2>
        <nav>
          {[
            "Dashboard",
            "Borrowers",
            "Loans",
            "Repayments",
            "Loan Parameters",
            "Accounting",
            "Reports",
            "Collateral",
            "Access Configuration",
            "Savings",
            "Expenses",
            "E-signature",
            "Investor Accounts",
            "Calendar",
            "Settings",
          ].map((item) => (
            <div key={item} className="py-2 px-4 hover:bg-green-700 cursor-pointer">
              {item}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard • Loans</h1>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6" />
            <MessageCircle className="h-6 w-6" />
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=32&width=32" alt="JO" />
              <AvatarFallback>JO</AvatarFallback>
            </Avatar>
            <span>John Okoh</span>
            <Menu className="h-6 w-6" />
          </div>
        </header>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { title: "LOANS", value: dashboardStats.totalLoans },
            { title: "BORROWERS", value: dashboardStats.totalBorrowers },
            { title: "CASH DISBURSED", value: dashboardStats.cashDisbursed.toLocaleString() },
            { title: "SAVINGS", value: dashboardStats.savings.toLocaleString() },
            { title: "REPAID LOANS", value: dashboardStats.repaidLoans },
            { title: "CASH RECEIVED", value: dashboardStats.cashReceived.toLocaleString() },
          ].map((item) => (
            <div key={item.title} className="bg-white p-4 rounded-lg shadow flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.value}</h3>
                <p className="text-sm text-gray-500">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Applied Loans</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User Recent Activity</TableHead>
                <TableHead>Customer name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan._id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt={loan.fullName} />
                      <AvatarFallback>{loan.fullName[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>{loan.fullName}</TableCell>
                  <TableCell>{loan.applicationDate}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      loan.status === 'verified' ? 'bg-green-100 text-green-800' :
                      loan.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Select
                      onValueChange={(value) => updateLoanStatus(loan._id, value)}
                      defaultValue={loan.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">Verify</SelectItem>
                        <SelectItem value="rejected">Reject</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-sm text-gray-500">Showing 1-7 of 100</div>
            <Button variant="outline" size="sm">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default VerifierDashboard;