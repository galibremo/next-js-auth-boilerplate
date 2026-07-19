import { LoadingButton } from "@/components/custom-ui/loading-button";
import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface DataTableExportDataProps {
  isExporting: boolean;
  handleExportData: () => void;
}

export default function DataTableExportData({
  isExporting,
  handleExportData,
}: DataTableExportDataProps) {
  return (
    <LoadingButton
      size="sm"
      className="hidden h-8 lg:flex"
      loadingText="Exporting..."
      isLoading={isExporting}
      onClick={handleExportData}
    >
      <HugeiconsIcon
        icon={Download04Icon}
        className="size-4"
        aria-hidden="true"
      />
      Export Data
    </LoadingButton>
  );
}
