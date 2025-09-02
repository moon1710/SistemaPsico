import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GreetingHeader from "../components/dashboard/GreetingHeader";
import RoleRenderer from "../components/dashboard/RoleRenderer";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <GreetingHeader user={user} />
      <RoleRenderer rol={user?.rol} />
    </div>
  );
};

export default DashboardPage;
