import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { BarChart, Users, DollarSign, Briefcase, PiggyBank, Building, CreditCard } from "lucide-react";
import { LineChart, Line, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios'; // Add axios for HTTP requests

const sidebarItems = [
  "Dashboard", "Users", "Loans", "Reports", "Settings", "Loan Types", "Loan Products",
  "Savings", "Expenses", "Income", "Charts", "Investments", "System Configuration",
  "Borrower Types", "Collateral Types", "Penalty Types"
];

const keyMetrics = [
  { title: "Active Users", value: "200", icon: Users },
  { title: "Borrowers", value: "100", icon: Users },
  { title: "Loan Requests", value: "$50,000", icon: DollarSign },
  { title: "Total Requests", value: "1,000,000", icon: Briefcase },
  { title: "Deposits", value: "450,000", icon: PiggyBank },
  { title: "Active Loans", value: "30", icon: CreditCard },
  { title: "Linked Accounts", value: "10", icon: Building },
  { title: "Loans", value: "50", icon: CreditCard },
];

const loansReleasedData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 200 },
  { month: "Mar", value: 300 },
  { month: "Apr", value: 150 },
  { month: "May", value: 250 },
  { month: "Jun", value: 400 },
];

const outstandingLoansData = [
  { month: "Jan", value: 1000 },
  { month: "Feb", value: 1200 },
  { month: "Mar", value: 1500 },
  { month: "Apr", value: 1300 },
  { month: "May", value: 1400 },
  { month: "Jun", value: 1600 },
];

export default function adminDashboard() {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [loans, setLoans] = useState([]);
    const token = localStorage.getItem('token');
  // Fetch loans from the backend
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

  // Update loan status
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
    <div className="flex w-full h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-900 text-white p-4 h-screen">
        <h2 className="text-2xl font-bold mb-6">CREDIT APP</h2>
        <nav>
          <ul>
            {sidebarItems.map((item) => (
              <li
                key={item}
                className={`mb-2 p-2 rounded cursor-pointer ${
                  activeItem === item ? 'bg-green-700' : 'hover:bg-green-800'
                }`}
                onClick={() => setActiveItem(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {keyMetrics.map((metric) => (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Loans */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Loan Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loans?.length>0 && loans.map((loan) => (
                  <TableRow key={loan._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Avatar className="mr-2">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={loan.fullName} />
                          <AvatarFallback>
                            {loan.fullName}
                          </AvatarFallback>
                        </Avatar>
                        {loan.fullName}
                      </div>
                    </TableCell>
                    <TableCell>{loan.loanReason}</TableCell>
                    <TableCell>{loan.applicationDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          loan.status === 'Approved'
                            ? 'success'
                            : loan.status === 'Pending'
                            ? 'warning'
                            : 'destructive'
                        }
                      >
                        {loan.status}
                      </Badge>
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
                          <SelectItem value="Approved">Approve</SelectItem>
                          <SelectItem value="Rejected">Reject</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Loans Released Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={loansReleasedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#4ade80" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Total Outstanding Open Loans - Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsBarChart data={outstandingLoansData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
