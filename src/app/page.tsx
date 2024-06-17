"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";

interface UploadedFile {
  filename: string;
  originalname: string;
  status: string;
}

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_API_URL + "/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadedFiles((prev) => [
          ...prev,
          ...data.files.map((file: { filename: string; originalname: string }) => ({
            filename: file.filename,
            originalname: file.originalname,
            status: "processing",
          })),
        ]);

        checkFileStatus(data.files.map((file: { filename: string }) => file.filename));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Failed to upload files", error);
    }
  };

  const checkFileStatus = async (filenames: string[]) => {
    for (const filename of filenames) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch(process.env.NEXT_PUBLIC_API_URL + `/status/${filename}`);
          if (response.ok) {
            const data = await response.json();
            if (data.status === "completed") {
              clearInterval(interval);
              setUploadedFiles((prev) =>
                prev.map((file) =>
                  file.filename === filename
                    ? { ...file, status: "completed" }
                    : file
                )
              );
              setInputKey(Date.now()); // Reset file input
            }
          } else if (response.status === 404) {
            clearInterval(interval);
            console.error(`File status not found for ${filename}`);
          } else {
            console.error(`Failed to fetch status for ${filename}`);
          }
        } catch (error) {
          clearInterval(interval);
          console.error(`Error fetching status for ${filename}: ${(error as Error).message}`);
        }
      }, 5000); // Check status every 5 seconds
    }
  };

  return (
    <>
      <div className="ucul">
        <Header />
        <main className="ucul-main">
          <section className="ucul-section__upload-file">
            <h2 className="ucul-section__upload-file-title">検閲データ</h2>
            <Label className="ucul-section__upload-file-label">
              <Input
                key={inputKey}
                id="picture"
                type="file"
                accept=".csv"
                multiple
                className="ucul-section__upload-file-input"
                onChange={handleFileUpload}
              />
            </Label>
          </section>
          <section className="ucul-section__lists">
            <table className="ucul-section__lists-table">
              <thead>
                <tr>
                  <th>ファイルリスト</th>
                  <th>ファイルリスト（検閲済み）</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((file, index) => (
                  <tr key={index}>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.originalname}</span>
                      </div>
                    </td>
                    <td>
                      <div className="ucul-section__lists-table-cell-aligner">
                        <span>{file.originalname}</span>
                        <Button
                          onClick={() =>
                            (window.location.href = process.env.NEXT_PUBLIC_API_URL + `/download/${file.filename}`)
                          }
                          disabled={file.status !== "completed"}
                        >
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
