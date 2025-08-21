export default function AdminPage() {
  return (
    <div className="min-h-screen bg-cloud-mist p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-midnight-slate font-poppins mb-6">
          Admin Dashboard
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-ironstone-gray font-inter">
            Welcome to the admin dashboard. This page will be protected by
            authentication.
          </p>
        </div>
      </div>
    </div>
  );
}
