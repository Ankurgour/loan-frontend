import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
// import { toast } from '../../components/ui/use-toast';

const LoanApplicationForm = () => {
    const token = localStorage.getItem('token')
  const [formData, setFormData] = useState({
    fullName: '',
    loanAmount: '',
    loanTenure: '',
    employmentStatus: '',
    loanReason: '',
    employmentAddress1: '',
    employmentAddress2: '',
    termsAccepted:true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulating a POST request to a backend
      const response = await fetch('http://localhost:5000/api/loans/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await response.json();
      if(data.message){
        window.location.href = '/user'
        }
      toast({
        title: "Application Submitted",
        description: "Your loan application has been successfully submitted.",
      });
      // Reset form after successful submission
      setFormData({
        fullName: '',
        loanAmount: '',
        loanTenure: '',
        employmentStatus: '',
        loanReason: '',
        employmentAddress1: '',
        employmentAddress2: ''
      });
      
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        <nav className="bg-white p-4 mb-4 rounded-lg shadow flex items-center justify-between">
          <div className="text-green-700 font-bold text-xl">CREDIT APP</div>
          <div className="flex space-x-4">
            <a href="#" className="text-green-700">Home</a>
            <a href="#" className="text-gray-600">Payments</a>
            <a href="#" className="text-gray-600">Budget</a>
            <a href="#" className="text-gray-600">Card</a>
            <a href="#" className="text-gray-600">User</a>
          </div>
        </nav>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">APPLY FOR A LOAN</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full name as it appears on bank account</Label>
                  <Input 
                    id="fullName" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name" 
                  />
                </div>
                <div>
                  <Label htmlFor="loanAmount">How much do you need?</Label>
                  <Input 
                    id="loanAmount" 
                    name="loanAmount"
                    type="number" 
                    value={formData.loanAmount}
                    onChange={handleChange}
                    placeholder="Enter loan amount" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="loanTenure">Loan tenure (in months)</Label>
                  <Input 
                    id="loanTenure" 
                    name="loanTenure"
                    type="number" 
                    value={formData.loanTenure}
                    onChange={handleChange}
                    placeholder="Enter loan tenure" 
                  />
                </div>
                <div>
                  <Label htmlFor="employmentStatus">Employment status</Label>
                  <Input 
                    id="employmentStatus" 
                    name="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleChange}
                    placeholder="Enter employment status" 
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="loanReason">Reason for loan</Label>
                <Textarea 
                  id="loanReason" 
                  name="loanReason"
                  value={formData.loanReason}
                  onChange={handleChange}
                  placeholder="Enter reason for loan" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="employmentAddress1">Employment address</Label>
                  <Input 
                    id="employmentAddress1" 
                    name="employmentAddress1"
                    value={formData.employmentAddress1}
                    onChange={handleChange}
                    placeholder="Enter employment address" 
                  />
                </div>
                <div>
                  <Label htmlFor="employmentAddress2">Employment address</Label>
                  <Input 
                    id="employmentAddress2" 
                    name="employmentAddress2"
                    value={formData.employmentAddress2}
                    onChange={handleChange}
                    placeholder="Enter additional address info" 
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>I have read the terms and conditions and accept them by submitting this application.</p>
                <p>Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureaus or other credit reporting agencies.</p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-green-700 hover:bg-green-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoanApplicationForm;