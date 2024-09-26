import React from "react";
import { useUser } from "@/hooks/useMe";
import { FullPageLoader } from "../layout/FullPageLoader";
import { Navigate } from "react-router-dom";

export default function IsTemporaryPassword({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading } = useUser();

  const user = data ? data.data : null;

  if (isLoading) return <FullPageLoader />;

  if (!user) throw new Error("no user");

  if (user.passwordIsTemporary) {
    return <Navigate to={"/onboard/choose-password"} replace={true} />;
  }

  return <>{children}</>;
}
