import { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create Razorpay order via API route
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 50000 }), // ₹500.00 in paise
      });

      const order = await orderRes.json();
      if (!order.id) {
        alert("Failed to create order");
        setLoading(false);
        return;
      }

      // Open Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Kanishka Sweets & Snacks",
        description: "Order Payment",
        order_id: order.id,
        handler: function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9876543210",
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <p className="mb-4">Click below to pay ₹500 for your sweets order.</p>
      <button
        onClick={handlePayment}
        disabled={loading}
        className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Pay with Razorpay"}
      </button>
    </div>
  );
}
