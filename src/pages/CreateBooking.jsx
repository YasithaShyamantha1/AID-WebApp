import CreateBookingForm from "@/components/CreateBookingForm";
export default function CreateBookingPage() {
    return (
      <main className="container mx-auto px-4 py-8 min-h-screen">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Hotel Bookings</h2>
        <CreateBookingForm />
      </main>
    );
  }