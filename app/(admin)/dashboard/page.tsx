export default function AdminDashboard() {
  return (
    <div className="min-h-screen p-8 bg-cloud-mist">
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6 text-3xl font-bold text-midnight-slate font-poppins">
          Admin Dashboard
        </h1>
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <p className="text-ironstone-gray font-inter">
            Welcome to the admin dashboard. This page will be protected by
            authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
