"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useRouter } from "next/navigation";

interface CsvUploadDialogProps {
  entityName: string; // e.g., "Products" or "Parties"
  expectedHeaders: string[];
  uploadUrl: string; // API endpoint
  onSuccess?: () => void;
}

export function CsvUploadDialog({
  entityName,
  expectedHeaders,
  uploadUrl,
  onSuccess,
}: CsvUploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError(null);
    setSuccess(false);
    
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        return;
      }
      setFile(selectedFile);
      parseCsv(selectedFile);
    }
  };

  const parseCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedHeaders = results.meta.fields || [];
        setHeaders(parsedHeaders);
        setParsedData(results.data);

        // Validation: Check if all expected headers exist
        const missingHeaders = expectedHeaders.filter(
          (h) => !parsedHeaders.includes(h)
        );

        if (missingHeaders.length > 0) {
          setError(
            `Missing columns: ${missingHeaders.join(", ")}. Please check your CSV format.`
          );
        } else if (results.data.length === 0) {
            setError("The CSV file appears to be empty.");
        }
      },
      error: (error) => {
        setError(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  const handleUpload = async () => {
    if (!parsedData.length || error) return;

    setUploading(true);
    setError(null);

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: parsedData }),
      });

      if (!response.ok) {
        const resData = await response.json();
        throw new Error(resData.error || "Failed to upload data");
      }

      setSuccess(true);
      setFile(null);
      setParsedData([]);
      if (onSuccess) onSuccess();
      
      // Refresh the page to show new data
      router.refresh();
      
      // Close dialog after a delay
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 1500);

    } catch (err: any) {
      setError(err.message || "Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Upload {entityName}</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk add {entityName.toLowerCase()}.
            <br />
            <span className="text-xs text-muted-foreground">
              Required columns: {expectedHeaders.join(", ")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="csvFile" className="text-right">
              File
            </Label>
            <Input
              id="csvFile"
              type="file"
              accept=".csv"
              className="col-span-3"
              onChange={handleFileChange}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-500 text-green-500">
               <CheckCircle2 className="h-4 w-4" />
               <AlertTitle>Success</AlertTitle>
               <AlertDescription>Uploaded successfully!</AlertDescription>
            </Alert>
          )}

          {parsedData.length > 0 && !error && !success && (
             <div className="text-sm text-muted-foreground ml-auto">
                Ready to upload {parsedData.length} records.
             </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleUpload} 
            disabled={!file || !!error || uploading || parsedData.length === 0}
          >
            {uploading ? "Uploading..." : "Import Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
