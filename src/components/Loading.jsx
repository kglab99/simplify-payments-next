import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner color="success" size="lg" aria-label="Loading" />
    </div>
  );
}
