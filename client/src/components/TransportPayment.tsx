import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, Building, Smartphone } from "lucide-react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: any;
  description: string;
}

interface TransportPaymentProps {
  amount: number;
  onPaymentComplete: (paymentDetails: any) => void;
  bookingDetails: any;
}

const TransportPayment = ({ amount, onPaymentComplete, bookingDetails }: TransportPaymentProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Visa, Mastercard, American Express"
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: Wallet,
      description: "PayPal, Apple Pay, Google Pay"
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building,
      description: "Direct bank transfer"
    },
    {
      id: "upi",
      name: "UPI/Mobile Banking",
      icon: Smartphone,
      description: "UPI ID, Mobile banking apps"
    }
  ];

  const handlePaymentMethodChange = (method: string) => {
    setSelectedMethod(method);
    setPaymentDetails({});
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePay = async () => {
    if (!selectedMethod || !isFormValid()) return;

    setIsProcessing(true);
    
    // Simulate payment processing - always successful
    setTimeout(() => {
      const transactionId = `TXN-${Date.now()}`;
      
      const paymentResult = {
        transactionId,
        amount,
        paymentMethod: selectedMethod,
        status: "success", // Always successful
        bookingDetails,
        paymentDetails: {
          method: selectedMethod,
          ...paymentDetails
        }
      };

      setIsProcessing(false);
      onPaymentComplete(paymentResult);
    }, 2000); // Reduced processing time
  };

  const isFormValid = () => {
    switch (selectedMethod) {
      case "card":
        return paymentDetails.cardNumber && paymentDetails.expiryDate && 
               paymentDetails.cvv && paymentDetails.holderName;
      case "wallet":
        return paymentDetails.email || paymentDetails.phoneNumber;
      case "bank":
        return paymentDetails.accountNumber && paymentDetails.ifscCode;
      case "upi":
        return paymentDetails.upiId || paymentDetails.phoneNumber;
      default:
        return false;
    }
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="holderName">Cardholder Name</Label>
              <Input
                id="holderName"
                placeholder="John Doe"
                value={paymentDetails.holderName || ""}
                onChange={(e) => handleInputChange("holderName", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber || ""}
                onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate || ""}
                  onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={paymentDetails.cvv || ""}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        );

      case "wallet":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={paymentDetails.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className="text-center text-sm text-gray-600">OR</div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="+1 234 567 8900"
                value={paymentDetails.phoneNumber || ""}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </div>
        );

      case "bank":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input
                id="accountNumber"
                placeholder="123456789012"
                value={paymentDetails.accountNumber || ""}
                onChange={(e) => handleInputChange("accountNumber", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                placeholder="ABCD0123456"
                value={paymentDetails.ifscCode || ""}
                onChange={(e) => handleInputChange("ifscCode", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="accountHolder">Account Holder Name</Label>
              <Input
                id="accountHolder"
                placeholder="John Doe"
                value={paymentDetails.accountHolder || ""}
                onChange={(e) => handleInputChange("accountHolder", e.target.value)}
              />
            </div>
          </div>
        );

      case "upi":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                placeholder="john@paytm"
                value={paymentDetails.upiId || ""}
                onChange={(e) => handleInputChange("upiId", e.target.value)}
              />
            </div>
            <div className="text-center text-sm text-gray-600">OR</div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                placeholder="+91 98765 43210"
                value={paymentDetails.phoneNumber || ""}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Transport Booking</span>
              <span>${amount}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span>$5</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>${(amount * 0.05).toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-lg">
              <span>Total Amount</span>
              <span>${(amount + 5 + amount * 0.05).toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Select Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={handlePaymentMethodChange}>
            <div className="space-y-3">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-medium cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {selectedMethod && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent>
            {renderPaymentForm()}
          </CardContent>
        </Card>
      )}

      <Button 
        onClick={handlePay}
        disabled={!isFormValid() || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Processing Payment...
          </div>
        ) : (
          `Pay $${(amount + 5 + amount * 0.05).toFixed(2)}`
        )}
      </Button>
    </div>
  );
};

export default TransportPayment;