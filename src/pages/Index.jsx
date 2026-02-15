import { useState } from "react";
import AgencyModal from "../components/agency/AgencyModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Agency Manager</h1>
          <p className="text-lg text-gray-500 max-w-md mx-auto">
            Add and manage your brand's agencies and their points of contact in one place.
          </p>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
          onClick={() => setModalOpen(true)}
        >
          Manage Agencies
        </button>
      </div>
      <AgencyModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;