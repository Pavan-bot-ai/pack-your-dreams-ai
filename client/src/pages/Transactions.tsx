import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

const Transactions = () => {
  const [, setLocation] = useLocation();

  // Placeholder data - will be replaced with database fetch
  const transactions = [];

  const handleTripClick = (tripId: string) => {
    setLocation(`/transaction-details/${tripId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="mr-3"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        </div>

        {/* Content */}
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-2">No transactions yet</div>
            <div className="text-gray-400">Your payment history will appear here</div>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction: any) => (
              <Card 
                key={transaction.id} 
                className="w-full cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTripClick(transaction.tripId)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{transaction.tripName}</CardTitle>
                  <p className="text-gray-600">Trip ID: {transaction.tripId}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="font-medium text-lg">${transaction.amount}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{transaction.date}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;